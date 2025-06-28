"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { SidebarProvider } from "./ui/sidebar";
import { DashboardSidebar } from "@/app/dashboards/__components/dashboard-sidebar";

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  console.log(user);
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </SidebarProvider>
  );
};

export default DashboardProvider;
