"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export interface DropZoneProps {
  onDragStateChange: (isDragActive: boolean) => void
  onFilesDrop: (files: File[]) => void
  children: React.ReactNode
}

export default function DropZone(
  props: React.PropsWithChildren<DropZoneProps>
) {
  const { onDragStateChange, onFilesDrop } = props

  const [isDragActive, setIsDragActive] = useState(false)
  const dropZoneRef = useRef<null | HTMLDivElement>(null)

  const handleDragIn = useCallback((event: any) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragActive(true)
    }
  }, [])

  const handleDragOut = useCallback((event: any) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDrag = useCallback(
    (event: any) => {
      event.preventDefault()
      event.stopPropagation()
      if (!isDragActive) {
        setIsDragActive(true)
      }
    },
    [isDragActive]
  )

  const handleDrop = useCallback(
    (event: any) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragActive(false)

      if (event.dataTransfer.files && event.dataTransfer.files.length > 1) {
        return toast({
          title: "Too many files.",
          description: `You are allowed to drop one file at a time.`,
          variant: "destructive",
        })
      }

      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const filesToUpload = []

        for (let i = 0; i < event.dataTransfer.files.length; i++) {
          filesToUpload.push(event.dataTransfer.files.item(i))
        }

        console.log("filesToUpload", filesToUpload)
        onFilesDrop?.(filesToUpload)
        // event.dataTransfer.clearData()
      }
    },
    [onFilesDrop]
  )

  useEffect(() => {
    onDragStateChange(isDragActive)
    console.log("isDragActive", isDragActive)
  }, [isDragActive])

  useEffect(() => {
    const tempZoneRef = dropZoneRef.current
    if (tempZoneRef) {
      tempZoneRef.addEventListener("dragenter", handleDragIn)
      tempZoneRef.addEventListener("dragleave", handleDragOut)
      tempZoneRef.addEventListener("dragover", handleDrag)
      tempZoneRef.addEventListener("drop", handleDrop)

      return () => {
        tempZoneRef.removeEventListener("dragenter", handleDragIn)
        tempZoneRef.removeEventListener("dragleave", handleDragOut)
        tempZoneRef.removeEventListener("dragover", handleDrag)
        tempZoneRef.removeEventListener("drop", handleDrop)
      }
    }
  }, [])

  return (
    <div
      ref={dropZoneRef}
      className={cn(
        "flex flex-col relative w-2/3 md:w-1/2 min-w-[300px] h-72 bg-muted border-2 border-muted-foreground border-dotted gap-5 items-center justify-center rounded-xl p-3 shadow-lg",
        isDragActive && "transition duration-500 scale-[1.05]"
      )}
    >
      {props.children}
    </div>
  )
}
