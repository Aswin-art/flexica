"use client";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function MobileNavbar() {
  const { user } = useUser();
  return (
    <div className="block md:hidden">
      <div className="fixed top-0 left-0 right-0 h-16 border-b bg-white flex items-center justify-between px-4 z-40">
        <SidebarTrigger className="text-blue-500">
          <Menu size={24} />
        </SidebarTrigger>

        <Link href={"/dashboards"} className="flex gap-2 items-center">
          <div className="relative w-[30px] h-[30px]">
            <Image
              src="/logo.svg"
              alt="logo"
              fill
              sizes="100%"
              className="object-contain"
              loading="lazy"
            />
          </div>
          <div className="font-semibold text-lg">Flexica</div>
        </Link>

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
