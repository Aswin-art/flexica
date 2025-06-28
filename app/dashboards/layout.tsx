"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./__components/dashboard-sidebar";
import { useUser } from "@clerk/nextjs";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MobileNavbar } from "./__components/mobile-navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  if (user.id !== process.env.NEXT_PUBLIC_CLERK_ADMIN_ID) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-blue-50 p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-32 w-32 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
              <AlertTriangle className="h-16 w-16 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          <Alert className="border-blue-500 bg-blue-100">
            <AlertTitle className="text-2xl font-bold text-blue-700">
              403 - Access Forbidden
            </AlertTitle>
            <AlertDescription className="text-blue-600 mt-2">
              Sorry, you don&apos;t have permission to access this page. This
              area is restricted to administrators only.
            </AlertDescription>
          </Alert>

          <div className="mt-6">
            <Link href="/">
              <Button className="bg-blue-500 hover:bg-blue-600">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <MobileNavbar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </SidebarProvider>
  );
}
