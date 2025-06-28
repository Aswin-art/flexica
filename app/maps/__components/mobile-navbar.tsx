"use client";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function MobileNavbar() {
  const { user } = useUser();
  return (
    <div className="block md:hidden">
      <div className="fixed top-0 left-0 right-0 h-16 border-b bg-white flex items-center justify-between px-4 z-40">
        <SidebarTrigger className="text-blue-500"></SidebarTrigger>

        <Link href={"/dashboards"} className="flex gap-2">
          <div className="relative size-7">
            <Image
              src="/logo.svg"
              alt="logo"
              fill
              sizes="100%"
              className="object-contain"
              loading="lazy"
            />
          </div>
          <div className="font-semibold text-md">Flexica</div>
        </Link>
        <div></div>

        {user && (
          <UserButton
            appearance={{
              elements: {
                userButtonPopoverActionButton__manageAccount: {
                  display: "none",
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default MobileNavbar;
