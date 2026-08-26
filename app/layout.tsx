import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Priosuite IMS",
  description: "Enterprise Metrics and Inventory Management",
};

import { CookieSetter } from "@/components/CookieSetter";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased")}
    >
      <body className="h-full overflow-hidden flex flex-col">
        <CookieSetter />
        <Toaster position="top-right"  />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
