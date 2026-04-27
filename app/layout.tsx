import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoginWrapper from "@/components/LoginWrapper";

const geistSans = Geist({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "BS Banking",
  description: "Created by Sheena and Bradley",

  // THIS IS WHAT YOU ADD
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} ${geistMono.className}`}>
        <LoginWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}