import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BTC-game",
  description: "A BTC price guessing game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen container mx-auto flex flex-col",
          inter.className,
        )}
      >
        <header>
          <h1 className="text-nowrap px-4 pt-4 text-2xl font-semibold text-neutral-200/80">
            BTC-game
          </h1>
        </header>
        {children}
      </body>
    </html>
  );
}
