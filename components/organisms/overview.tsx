"use client";

import { rupiah } from "@/lib/utils";
import { transcode } from "buffer";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const dataa = [
  {
    name: "Jan",
    total: 0,
  },
  {
    name: "Feb",
    total: 0,
  },
  {
    name: "Mar",
    total: 0,
  },
  {
    name: "Apr",
    total: 0,
  },
  {
    name: "May",
    total: 0,
  },
  {
    name: "Jun",
    total: 0,
  },
  {
    name: "Jul",
    total: 0,
  },
  {
    name: "Aug",
    total: 0,
  },
  {
    name: "Sep",
    total: 0,
  },
  {
    name: "Oct",
    total: 0,
  },
  {
    name: "Nov",
    total: 0,
  },
  {
    name: "Dec",
    total: 0,
  },
];
interface Foo {
  [key: string]: number;
}
export function Overview(props: { trans: any }) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    let temp: any = {};
    let temp2: any[] = [];
    if (props.trans.length != 0) {
      props.trans.map((e: any) => {
        const total_price =
          e.type === "invoice"
            ? Number(e.total_price) / 1000
            : (Number(e.total_price) * e.details.dp) / 100 / 1000;
        if (temp[e.date_string]) temp[e.date_string] += total_price;
        else temp[e.date_string] = total_price;
        console.log(temp);
      });
      for (let key in temp) {
        // console.log(temp[key]);
        temp2.push({
          name: key,
          total: temp[key],
        });
      }
      setData(temp2);
    }
  }, [props.trans]);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${rupiah(value).split(",")[0]}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[10, 10, 0, 0]} />
        <Tooltip cursor={{ fill: "transparent" }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
