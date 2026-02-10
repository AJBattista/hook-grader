import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ad Hook Grader — DTC Ad Creative Tool | AJ Battista, Marketing · TampaFL",
  description: "Score your TikTok, Instagram Reel, or Meta ad hooks in seconds. Get a breakdown on 5 dimensions + 5 stronger alternatives.",
  openGraph: {
    title: "Ad Hook Grader — Grade & Improve Your DTC Ad Hooks",
    description: "Paste your hook → instant score + better variants. Built for DTC marketers.",
    type: "website",
    url: "https://ajbattista.com/hook-grader",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
