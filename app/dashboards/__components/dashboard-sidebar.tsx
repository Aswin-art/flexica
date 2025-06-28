"use client";
import { Suspense } from "react";
import {
  FileClock,
  FileWarning,
  Home,
  Map,
  MapPinCheck,
  MessageCircleCode,
  Store,
  Tags,
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
import { UserButton, useUser } from "@clerk/nextjs";
import { Slot } from "@radix-ui/react-slot";

// Menu items
const items = [
  {
    title: "Halaman Beranda",
    url: "/dashboards",
    icon: Home,
  },
  {
    title: "Lokasi Fasum",
    url: "/dashboards/locations",
    type: "all",
    icon: MapPinCheck,
  },
  {
    title: "Ajuan Lokasi",
    url: "/dashboards/submissions",
    type: "potential",
    icon: FileClock,
  },
  {
    title: "Fasilitas Umum",
    url: "/dashboards/facilities",
    type: "fasum",
    icon: Store,
  },
  {
    title: "Tag Lokasi",
    url: "/dashboards/tags",
    type: "fasum",
    icon: Tags,
  },
  {
    title: "Laporan Lokasi",
    url: "/dashboards/reports",
    type: "fasum",
    icon: FileWarning,
  },
  {
    title: "Ulasan Lokasi",
    url: "/dashboards/feedbacks",
    type: "fasum",
    icon: MessageCircleCode,
  },
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
                  "font-medium flex items-center w-full px-4 py-2 rounded-lg",
                  "hover:bg-gray-100 hover:text-blue-500",
                  { "text-blue-500 bg-gray-100": item.url === pathname }
                )}
              >
                <div className="bg-gray-100 p-1 rounded-lg mr-3">
                  <item.icon />
                </div>
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </div>
        </SidebarMenuItem>
      ))}
    </>
  );
}

export function DashboardSidebar() {
  const { user } = useUser();
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/dashboards"
              className="mt-5 w-full flex flex-row md:flex-col items-center md:justify-center ml-5 md:ml-0 gap-2"
            >
              <div className="relative w-[42px] h-[42px]">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  fill
                  sizes="100%"
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <p className="font-semibold text-xl">Flexica</p>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="mt-4 md:mt-10">
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
