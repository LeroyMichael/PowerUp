"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const WalletPage = ({ params }: { params: { wallet: string } }) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-4">
          <Button
            type="reset"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {params?.wallet ? params?.wallet : "New Transaction"}
          </h1>
        </div>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <div className="flex flex-col md:flex-row gap-5">
            <Button>Save</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default WalletPage;
