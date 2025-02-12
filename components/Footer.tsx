import React from "react"
import { currentYear } from "../lib/utils"

export default function Footer() {
  return (
    <footer className="absolute bottom-0 z-50 h-auto w-full bg-gradient-to-br from-grOne via-grTwo to-grThr p-5">

      <p className="my-auto h-auto w-full justify-center text-center text-xs">
        <span>Copyright © {currentYear} - Developed by </span>
        <a href="https://www.buildsoftware.co.za" target="_blank" rel="noreferrer">
          BuildSoftware.co.za
        </a>{" "}
        | All rights reserved
      </p>
    </footer>
  )
}
