"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"

import { cn } from "@/lib/utils"
import { UploadValidationRequest } from "@/lib/validators/uploadValidation"
import { toast } from "@/hooks/use-toast"

import { Button } from "../ui/button"
import DropZone from "../ui/dropzone"
import { Input } from "../ui/input"
import "@/styles/globals.css"

export default function UploadOnChain() {
  const [text, setText] = useState<string>("")
  const [files, setFiles] = useState<File[]>()
  const [disable, setDisabled] = useState<boolean>(true)
  const clickRef = useRef<null | HTMLDivElement>(null)
  const inputRef = useRef<null | HTMLInputElement>(null)

  useEffect(() => {
    if (text.length > 3) {
      setDisabled(false)
    }
    if (text.length > 100) {
      setDisabled(true)
    }
  }, [text])

  // HANDLE FILE UPLOAD
  function handleFiles(event: any) {
    event.preventDefault()
    if (event.target.files) {
      setDisabled(false)
      setFiles(event.target.files)
    }
  }

  function onSubmit() {
    const payload = {
      files: files,
      text: text,
    }
    sendToNetwork(payload)
  }

  const { mutate: sendToNetwork } = useMutation({
    mutationFn: async ({ files, text }: UploadValidationRequest) => {
      const payload = new FormData()
      payload.append("text", text)

      if (files !== undefined) {
        const file = new Blob([files[0]], { type: files[0].type })
        payload.append("file", file, files[0].name)
      }

      console.log("payload:", payload)

      const response = await axios.post("/api/upload", payload)
      console.log("response: ", response)
    },
    onError: (error: AxiosError) => {
      setFiles(undefined)
      setText("")
      setDisabled(true)
      if (error.response?.status === 400) {
        return toast({
          title: "Bad Request.",
          description: `Data validation error, text cannot be longer than 100 chars, only 1 file is allowed.`,
          variant: "destructive",
        })
      }
      if (error.response?.status === 429) {
        return toast({
          title: "Limit reached.",
          description: `API request limit reached.`,
          variant: "destructive",
        })
      }
      if (error.response?.status === 465) {
        return toast({
          title: "Transaction failed.",
          description: `Transaction failed, either due to a network connection error or insufficient funds.`,
          variant: "destructive",
        })
      }
      if (error.response?.status === 500) {
        return toast({
          title: "Server Error.",
          description:
            "Failed to complete operation due to a server error. Please try again.",
          variant: "destructive",
        })
      }
    },
    onSuccess: () => {
      setFiles(undefined)
      setText("")
      setDisabled(true)
      return toast({
        title: "Success!",
        description: "Successfully uploaded to the network.",
      })
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log("onSettled error:", error)
      }
    },
  })

  // DROPZONE
  const [isDropActive, setIsDropActive] = useState<boolean>(false)

  const onDragStateChange = useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive)
  }, [])

  const onFilesDrop = useCallback((files: File[]) => {
    console.log("setFiles:", files)
    setFiles(files)
    setDisabled(false)
  }, [])

  function handleClick() {
    console.log("click")
    document.getElementById("input")?.click()
  }

  function clear() {
    setFiles(undefined)
    return toast({
      title: "Cleared",
      description: "Dropzone has been cleared.",
    })
  }

  useEffect(() => {
    const currentRef = clickRef.current
    if (currentRef) {
      currentRef.addEventListener("click", handleClick)
    }
  }, [])

  return (
    <div className="flex flex-col items-center font-zilla w-full min-h-screen py-5 md:py-10">
      <Input
        className="w-2/3 md:w-1/2 mb-5 border-muted-foreground outline-none"
        placeholder="Send text on-chain"
        value={text}
        onChange={(event: any) => setText(event.target.value)}
      />
      <DropZone onDragStateChange={onDragStateChange} onFilesDrop={onFilesDrop}>
        <div
          ref={clickRef}
          className="top-2 left-2 flex absolute w-28 h-8 border border-muted-foreground hover:border-orange-500 items-center justify-center text-center bg-muted rounded-full transition duration-200 hover:scale-[0.97] "
        >
          <p className="text-primary cursor-pointer">Browse..</p>
          <Input
            id="input"
            ref={inputRef}
            hidden
            type="file"
            className="w-0 h-0 absolute top-0 left-0 bg-transparent text-transparent border-none"
            onChangeCapture={handleFiles}
          ></Input>
        </div>
        <h2 className="font-semibold text-2xl">Drop files on-chain</h2>
        {files && files.length > 0 ? (
          <p className="flex text-center text-orange-500 font-semibold items-center justify-center gap-2 w-60 h-8 italic border-transparent rounded-full shadow-md">
            <span>{files?.length} file selected</span>
          </p>
        ) : (
          <p className="flex text-center text-muted-foreground items-center justify-center w-60 h-8 italic border-transparent rounded-full shadow-md">
            No file selected
          </p>
        )}
      </DropZone>
      <div className="flex gap-5">
        <Button
          id="submitButton"
          disabled={disable}
          className={cn("shinycta mt-5 hover:bg-orange-500")}
          onClick={onSubmit}
        >
          Submit
        </Button>
        <Button
          className={cn(
            "h-10 w-20 mt-5 bg-muted border-muted-foreground hover:border-orange-500 transition duration-75 hover:scale-[0.97] "
          )}
          onClick={clear}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
