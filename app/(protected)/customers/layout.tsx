import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <Card>
      <CardHeader className="space-y-0.5">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Customers
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          List of customers
        </CardDescription>
      </CardHeader>
      <Separator className="" />
      <CardContent className="pt-5 flex flex-col space-y-8 lg:flex-row ">
        <div className="flex-1 ">{children}</div>
      </CardContent>
    </Card>
  );
}
