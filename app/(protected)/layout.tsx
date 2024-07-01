import { MainNav, MainNavMobile } from "@/components/molecules/main-nav";
import { UserNav } from "@/components/organisms/user-nav";
import CompanySwitcher from "@/components/molecules/company-switcher";
import { TooltipProvider } from "@/components/ui/tooltip";
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
            <div className="flex-1 space-y-4 md:pt-0 pt-4 px-4 ">
              {children}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}
