import { MainNav } from "@/components/molecules/main-nav";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Search } from "@/components/atoms/search";
import { UserNav } from "@/components/organisms/user-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invoice Generator",
  description: "Invoice Generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
