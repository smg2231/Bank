import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  //website icon in browser tab
  icons: {
    icon: "/icon.png",
  },
};
// Root layout that wraps all pages, applies global styles and fonts
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} ${geistMono.className}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}