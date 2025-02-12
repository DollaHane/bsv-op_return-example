import React from 'react'

export interface FileListProps {
  files: File[]
}

export default function DropZoneFileList(props: React.PropsWithChildren<FileListProps>) {
  return (
    <>
      <p>Send {props.files.length} Statements?</p>
    </>
  )
}