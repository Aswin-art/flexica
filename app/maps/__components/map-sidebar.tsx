"use client";

import React, { Suspense } from "react";
import {
  Home,
  MapPinCheck,
  PersonStanding,
  Plus,
  Waypoints,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useUser, UserButton } from "@clerk/nextjs";

const items = [
  { title: "Halaman Beranda", url: "/", icon: Home },
  { title: "Lokasi Fasum", url: "/maps", icon: MapPinCheck },
  {
    title: "Indikator Ketersediaan Fasum",
    url: "/maps/accessibility",
    icon: PersonStanding,
  },
  { title: "Penunjuk Jalan", url: "/maps/route-navigation", icon: Waypoints },
  { title: "Ajukan Lokasi Fasum", url: "/maps/submissions", icon: Plus },
];

function SidebarMenuItems() {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <div className="hidden md:block">
            <SidebarMenuButton asChild>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.url}
                      className={clsx(
                        "font-medium flex items-center justify-center",
                        "hover:text-blue-500",
                        { "text-blue-500": item.url === pathname }
                      )}
                    >
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <item.icon />
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarMenuButton>
          </div>

          <div className="block md:hidden">
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                className={clsx(
                  "group font-medium flex items-center justify-start",
                  "w-full h-12 px-4 rounded-lg",
                  "hover:bg-gray-100",
                  { "bg-gray-100 text-blue-500": item.url === pathname }
                )}
              >
                <div className="p-1 rounded-lg mr-1 flex-shrink-0">
                  <item.icon
                    size={16}
                    className={clsx(
                      "transition-colors duration-200",
                      "group-hover:text-blue-500", // icon berubah biru di hover
                      item.url === pathname && "text-blue-500"
                    )}
                  />
                </div>
                <span
                  className={clsx(
                    "text-xs transition-colors duration-200",
                    "group-hover:text-blue-500", // teks berubah biru di hover
                    item.url === pathname && "text-blue-500"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </div>
        </SidebarMenuItem>
      ))}
    </>
  );
}

export function MapSidebar() {
  const { user } = useUser();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              className="mt-5 w-full flex flex-row md:flex-col items-center ml-5 md:ml-0 gap-2"
            >
              <div className="relative size-7 md:w-[42px] md:h-[42px]">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  fill
                  sizes="100%"
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <p className="font-semibold text-md md:text-xl">Flexica</p>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="justify-center">
        <SidebarGroupContent>
          <SidebarMenu>
            <Suspense fallback={<div>Loading...</div>}>
              <SidebarMenuItems />
              {user && (
                <SidebarMenuItem className="self-start md:self-center ml-3 md:ml-0">
                  <SidebarMenuButton>
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonPopoverActionButton__manageAccount: {
                            display: "none",
                          },
                        },
                      }}
                    />
                    <p className="md:hidden ml-3">{user.firstName}</p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </Suspense>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
    </Sidebar>
  );
}
