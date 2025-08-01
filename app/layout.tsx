import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Script from "next/script";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flexica",
  description:
    "Flexica adalah platform pemetaan fasilitas umum ramah difabel. Temukan dan tandai lokasi inklusif untuk mendukung akses yang setara bagi semua.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="id" suppressHydrationWarning>
        <Script
          id="chatbase"
          dangerouslySetInnerHTML={{
            __html: `
                window.embeddedChatbotConfig = {
                  chatbotId: "OdHgTCe8kJUcVV29jYRKG",
                  domain: "www.chatbase.co"
                };
              `,
          }}
        />
        <Script
          src="https://www.chatbase.co/embed.min.js"
          data-chatbot-id="OdHgTCe8kJUcVV29jYRKG"
          data-domain="www.chatbase.co"
          defer
        />

        <Script
          src="https://cdn.userway.org/widget.js"
          data-account="kdsxBGio8k"
          defer
        />

        <body
          className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Providers>{children}</Providers>
          <Toaster richColors position="top-center" closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
