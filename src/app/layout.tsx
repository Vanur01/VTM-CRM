import type { Metadata } from "next";
import { Inter, Fira_Mono } from "next/font/google";
import "./globals.css";

import PushNotificationProvider from '@/components/Common/PushNotificationProvider';
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const firaMono = Fira_Mono({
  variable: "--font-fira-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "VTM CRM",
  description: "A CRM for VTM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${firaMono.variable}`}>
      <body className="antialiased">
        {/* 🔥 Client-side push notifications run here */}
      <PushNotificationProvider />
        <Toaster richColors />

        {children}
      </body>
    </html>
  );
}
