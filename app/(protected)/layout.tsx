import { MainNav } from "@/components/molecules/main-nav";
import { Search } from "@/components/atoms/search";
import { UserNav } from "@/components/organisms/user-nav";
import { useSession } from "next-auth/react";
import CompanySwitcher from "@/components/molecules/company-switcher";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}
export const metadata = {
  title: "Power Up",
  description: "Jump Start with Power Up!",
};
export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <CompanySwitcher className="hidden md:flex" />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
        <div className="flex items-center justify-center pb-4 md:hidden">
          <CompanySwitcher />
        </div>
      </div>

      {children}
    </>
  );
}
