"use client";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

interface AutoFillProps {
  autoFill: (raw: string) => void;
}

const AutoFill: React.FC<AutoFillProps> = (props) => {
  const [rawformData, setRawFormData] = useState("");
  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setRawFormData(val);
  };
  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle className="text-l font-bold tracking-tight">
          Auto Generate
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="mt-5 space-y-0.5 flex">
          <p className="text-m text-muted-foreground pr-2">
            Nama: <br />
            Nama PT: <br />
            Alamat pengiriman: <br />
            No HP: <br />
            Email:
          </p>
          <Textarea
            className=""
            value={rawformData}
            placeholder="Copy the filled template here."
            onChange={handleChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className=""
          onClick={() => props.autoFill(rawformData)}
        >
          Auto Fill
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AutoFill;
