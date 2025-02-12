import React from "react"
import Image from "next/image"
import Link from "next/link"
import Build from "@/components/Assets/Build_Logo.png"
import { ThemeToggle } from "../theme-toggle"

export default async function NavBar() {
  return (
    <header className="sticky top-0 z-50 flex w-full flex-col items-center justify-center bg-muted/60 px-5 backdrop-blur-xl">
      <div className="relative flex  h-[140px] w-full max-w-[75vw] items-center justify-between space-x-4 sm:h-20 sm:space-x-0">
        <Link href="/" className="flex">
          <div className="w-20 h-12 flex items-center justify-center">
            <Image src={Build} width={50} alt="build" />
          </div>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
