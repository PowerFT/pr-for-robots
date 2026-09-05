import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const title = "PR for Robots | How Publicity Fuels Patient AI Searches for Healthcare";
const description =
  "If AI can't find, understand or trust your brand, you may be invisible to your next customer. A webinar series from Rose Creative Marketing and Fitch Technologies.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "PR for Robots",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
