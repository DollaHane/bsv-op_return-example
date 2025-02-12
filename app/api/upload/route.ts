import { appendFile, chmod, readFile, writeFile } from "fs/promises"
import { headers } from "next/headers"
import { redis } from "@/server/upstash"
import { P2PKH, PrivateKey, Script, Transaction } from "@bsv/sdk"
import { Ratelimit } from "@upstash/ratelimit"
import axios from "axios"
import { z } from "zod"

import { backendValidation } from "@/lib/validators/uploadValidation"

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "30 s"),
  analytics: true,
})

interface UnspentTX {
  height: number
  tx_pos: number
  tx_hash: string
  value: number
}

export async function POST(req: Request) {
  try {

    // ______________________________________________________________
    // PVT & PUB KEYS:

    // (NEED TO FIGURE OUT HOW TO GET PVT KEY FROM .ENV AND NOT .WIF)
    const WIF = await readFile(".wif")
    const key = PrivateKey.fromWif(WIF.toString())
    const address = process.env.PUBLIC_KEY!

    // ______________________________________________________________
    // FORM DATA & VALIDATION:
    const body = await req.formData()
    const validateData = {
      text: body.get("text"),
      files: body.get("file") || undefined,
    }
    backendValidation.parse(validateData)

    // ______________________________________________________________
    // DATA BUFFER ENCODING:
    let file = undefined
    let text = body.get("text")?.toString()

    for (let [key, value] of body.entries()) {
      if (value instanceof File) {
        const extractedFile = {
          name: value.name,
          file: value,
        }
        file = extractedFile
      }
    }

    const fileBuffer = file
      ? Buffer.from(await file!.file.arrayBuffer())
      : undefined
    const textBuffer = text ? Buffer.from(text!, "utf8") : undefined


    // ______________________________________________________________
    // UPSTASH RATE LIMITER:
    const ip = (await headers()).get("x-forwarded-for")
    const {
      remaining,
      limit,
      success: limitReached,
    } = await rateLimit.limit(ip!)
    console.log("Rate Limit Stats:", remaining, limit, limitReached)


    if (!limitReached) {
      return new Response("API request limit reached", { status: 429 })
    } else {

      // ______________________________________________________________
      // GET UNSPENT UTXO's FROM WHATSONCHAIN:
      console.log(`Fetching UTXOs for address: ${address}`)
      let unspentTx: string = ""
      try {
        const response = await axios.get(
          `https://api.whatsonchain.com/v1/bsv/main/address/${address}/unspent`
        )
        unspentTx = JSON.stringify(response.data)
      } catch (error) {
        console.error("Error fetching UTXOs:", error)
        return new Response(`Error fetching UTXOs: ERR - ${error}`, {
          status: 500,
        })
      }

      const parsedUnspentTx: UnspentTX[] = JSON.parse(unspentTx) // COULD RETURN AN ARRAY WHERE SOURCE TX IS NOT AT POSITION 0
      console.log("UnspentTX: ", parsedUnspentTx)

      /* 
      RETURNS:
      UnspentTX:  [
        {
          height: 883672,
          tx_pos: 1,
          tx_hash: 'b294312bedceb1807c9d41dfe09331b53600efdd64579da8802563d9a2583f49',
          value: 2567049
        },
        {
          height: 0,
          tx_pos: 0,
          tx_hash: '14efc4640cc98579a1fcab63315d3e3124bb36d1d8074686efff1b42b7d68d29',
          value: 1279174
        }
      ]
      */

      // ______________________________________________________________
      // GET THE SOURCE TX (LAST TX?):

      // NEED TO FIGURE OUT HOW TO CHECK WHERE THE LATEST TX IS IN parsedUnspentTx[N].tx_hash
      // CHANGES DEPENDING ON HOW MANY UNCONFIRMED TX'S THERE ARE -> RESULTS IN AXIOS ERROR
      console.log(`Fetching hex source for txid: `, parsedUnspentTx[1].tx_hash) 
      let sourceTransaction: Transaction
      try {
        const response = await axios.get(
          `https://api.whatsonchain.com/v1/bsv/main/tx/${parsedUnspentTx[1].tx_hash}/hex`
        )
        sourceTransaction = Transaction.fromHex(response.data)
      } catch (error) {
        console.error("Failed to fetch transaction from WhatsOnChain:", error)
        return new Response(
          `Failed to fetch transaction from WhatsOnChain: ERR - ${error}`,
          { status: 500 }
        )
      }

      console.log(
        "Preparing new transaction from source transaction:",
        sourceTransaction
      )

      // ______________________________________________________________
      // PREPARE TX INPUTS (SENDER) & OUPUTS (RECIEVER):
      const tx = new Transaction()

      tx.addInput({
        sourceTransaction,
        sourceOutputIndex: 1,
        unlockingScriptTemplate: new P2PKH().unlock(key),
      })

      tx.addOutput({
        satoshis: 0,
        lockingScript: Script.fromASM(`OP_FALSE OP_RETURN ${textBuffer!.toString("hex")}`), 
      })

      tx.addOutput({
        satoshis: 0,
        lockingScript: Script.fromASM(`OP_FALSE OP_RETURN ${fileBuffer!.toString("hex")}`), 
      })

      tx.addOutput({
        satoshis: 100,
        change: true,
        lockingScript: new P2PKH().lock(key.toAddress()),
      })

      await tx.fee(100) // MAY NEED TO PLAY AROUND WITH TRANSACTION FEES FOR BIGGER FILES
      await tx.sign()
      console.log(tx.toHex())

      const response = await tx.broadcast()

      console.log(response)
      if (response.status === "error") {
        return new Response("Transaction failed", { status: 465 })
      }

      // append new transaction
      await appendFile(".transactions", "\n" + tx.toHex())
      return new Response(JSON.stringify("Success"), { status: 200 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }
    return new Response(`Failed to complete transaction: ERR - ${error}`, {
      status: 500,
    })
  }
}
