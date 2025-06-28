import { SidebarProvider } from "@/components/ui/sidebar";
import { MapSidebar } from "./__components/map-sidebar";
import { Suspense } from "react";
import LoadingState from "@/components/loading-state";
import MobileNavbar from "./__components/mobile-navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Suspense fallback={<LoadingState color="blue" className="w-screen" />}>
        <MapSidebar />
        <MobileNavbar />
        <main className="overflow-hidden w-full">{children}</main>
      </Suspense>
    </SidebarProvider>
  );
}
