import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Dictionary App",
  description: "Created by Catherine An",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable}`}>
      <body className="bg-primary font-primary">{children}</body>
    </html>
  );
}
