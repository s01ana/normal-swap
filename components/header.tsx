"use client"

import Link from "next/link"
import Image from "next/image"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./theme-toggle"

const shortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function Header() {
  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()
  return (
    <header className="sticky top-0 z-50 w-full flex justify-center bg-background border-b-2">
      <div className="container max-w-7xl flex h-16 items-center justify-between py-4 mx-2 xs:mx-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="rochevalley Logo"
              width={36}
              height={36}
              className="object-cover"
            />
            <div className="hidden sm:flex text-2xl font-bold">
              Normal Swap For Fiverr Order
            </div>
          </Link>
        </div>

        <div className="flex gap-2">
          {/* <div className="hidden sm:flex">
            <ModeToggle />
          </div> */}
          <div className="items-center">
            {!isConnected && 
              <Button
                onClick={() => open({ view: "Connect"})}
                className="cursor-pointer"
              >Connect Wallet</Button>}
            {isConnected && <Button
              onClick={() => open({ view: "Account"})}
              className="cursor-pointer"
            >
              {shortAddress(address ?? "")}
            </Button>}
          </div>
        </div>
      </div>
    </header>
  )
}
