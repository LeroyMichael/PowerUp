"use client";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

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
    <div>
      <div className="space-y-0.5">
        <h3 className="text-l font-bold tracking-tight">Auto Generate</h3>
        <p className="text-m text-muted-foreground">
          Nama: <br />
          Nama PT: <br />
          Alamat pengiriman: <br />
          No HP: <br />
          Email:
        </p>
      </div>
      <Textarea
        className="my-6"
        value={rawformData}
        placeholder="Copy the filled template here."
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => props.autoFill(rawformData)}
      >
        Auto Fill
      </Button>
    </div>
  );
};

export default AutoFill;
