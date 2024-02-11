import { MainNav } from "@/components/molecules/main-nav";
import { Search } from "@/components/atoms/search";
import { UserNav } from "@/components/organisms/user-nav";
import { useSession } from "next-auth/react";

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
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
