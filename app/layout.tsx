import { MainNav } from "@/components/molecules/main-nav";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Search } from "@/components/atoms/search";
import { UserNav } from "@/components/organisms/user-nav";
import NextAuthProvider from "@/components/auth/next-auth-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });
type DashboardLayoutProps = {
  children: React.ReactNode;
  session: any;
};
export const metadata = {
  title: "Power Up",
  description: "Jump Start with Power Up!",
};
export default function RootLayout({
  children,
  session,
}: DashboardLayoutProps) {
  return (
    <NextAuthProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </NextAuthProvider>
  );
}
