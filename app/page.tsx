import React from "react"
import UploadOnChain from "@/components/PageMain/UploadOnChain"

interface Tx {
  tx_hash: string,
      height: number
}

interface PKHistory {
  address: string,
  script: string,
  result: Tx[],
  error: string
}

export default async function AssetsPage() {

  // NOTE: STILL NEED TO FINISH FETCHING AND DECODING

  // const address = process.env.PUBLIC_KEY;

  // console.log(`Fetching UTXOs for address: ${address}`);
  // let addressHistory: PKHistory;
  // try {
  //   const response = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/address/${address}/confirmed/history`);
  //   addressHistory = response.data;
  // } catch (error) {
  //   console.error("Error fetching address history:", error);
  //   return [];
  // }

  // console.log("unspent: ", addressHistory);

  // let txData: any = []
  // addressHistory.result.forEach(async(tx: Tx) => {
  //   try {
  //     const response = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${tx.tx_hash}`)
  //     console.log('resonse: ', response.data)
  //     txData.push(JSON.stringify(response.data))
  //   } catch (error) {
  //     console.error("Error fetching transaction data:", error);
  //     return false;
  //   }
  // })

  // console.log('txData: ', txData)

  return (
    <section className="flex flex-col items-center h-screen py-5 md:py-10">
      <UploadOnChain />
    </section>
  )
}
