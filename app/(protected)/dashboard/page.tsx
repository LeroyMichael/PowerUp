"use client";
import "moment-timezone";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { File, LineChart } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SaleDashboard from "./components/saleDashboard";
import TransactionDashboard from "./components/transactionDashboard";
import React from "react";

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard
          <Link href="/report">
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-sm ml-4"
            >
              <LineChart className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Report</span>
            </Button>
          </Link>
        </h2>
        <div className="flex items-center space-x-2">
          {/* <CalendarDateRangePicker /> */}
        </div>
      </div>
      <Tabs defaultValue="new" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new">New Dashboard</TabsTrigger>
          <TabsTrigger value="old">Old Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="new" className="space-y-4">
          <SaleDashboard />
        </TabsContent>
        <TabsContent value="old" className="space-y-4">
          <TransactionDashboard />
        </TabsContent>
      </Tabs>
    </>
  );
}
