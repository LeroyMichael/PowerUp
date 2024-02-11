import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="space-y-6 p-10 pb-16 ">
        <div className="space-y-0.5 grid grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
            <p className="text-muted-foreground">List of invoice</p>
          </div>
          <div className="flex justify-end">
            <Link href="/transactionForm">
              <Button>+ New Transaction</Button>
            </Link>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row ">
          <div className="flex-1 ">{children}</div>
        </div>
      </div>
    </>
  );
}
