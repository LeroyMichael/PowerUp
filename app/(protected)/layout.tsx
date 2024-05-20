import { MainNav, MainNavMobile } from "@/components/molecules/main-nav";
import { Search } from "@/components/atoms/search";
import { UserNav } from "@/components/organisms/user-nav";
import { useSession } from "next-auth/react";
import CompanySwitcher from "@/components/molecules/company-switcher";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Users2,
} from "lucide-react";
import BreadcrumbPwr from "@/components/molecules/breadcrumb-pwr";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}
3;
export const metadata = {
  title: "Power Up",
  description: "Jump Start with Power Up!",
};
export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <>
      <TooltipProvider delayDuration={0}>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <MainNav className="mx-6" />
          <div className="flex-col md:flex gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <MainNavMobile />
              <BreadcrumbPwr />
              <div className="relative ml-auto flex-1 md:grow-0">
                <CompanySwitcher className="md:flex" />
              </div>
              <UserNav />
            </header>
            <div className="flex-1 space-y-4 md:pt-0 pt-4 px-6 ">
              {children}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}
