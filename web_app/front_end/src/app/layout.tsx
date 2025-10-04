import { Background } from "@/components/layout/Background";
import Providers from "@/lib/providers/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExoSage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/uplot@1.6.24/dist/uPlot.min.css"
        />
      </Head>
      <body
        className={`${inter.variable} antialiased dark px-3 md:px-6 sm:px-4 py-1 h-full`}
      >
        <Providers>{children}</Providers>
        <Background />
      </body>
    </html>
  );
}
