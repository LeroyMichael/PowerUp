"use client";
import { getProfitLoss, TGetProfitLossParams } from "@/lib/report/utils";
import { ProfitLoss } from "@/types/report";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const ProfitLossComponent = () => {
  const { data: session, status } = useSession();

  const [profitLoss, setProfitLoss] = useState<ProfitLoss>({});

  async function fetchProfitLoss() {
    if (session?.user.merchant_id) {
      const filter: TGetProfitLossParams = {
        merchant_id: Number(session?.user.merchant_id),
        start_date: "01-07-2024",
        end_date: "01-09-2024",
      };
      const resp = await getProfitLoss(filter);
      setProfitLoss(resp);
    }
  }

  useEffect(() => {
    fetchProfitLoss();
  }, [session?.user.merchant_id]);

  return <div>{JSON.stringify(profitLoss)}</div>;
};

export default ProfitLossComponent;
