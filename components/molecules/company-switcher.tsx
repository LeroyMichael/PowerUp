"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Company } from "@/types/company";
import { setActiveMerchant } from "@/lib/merchant/utils";

const groups = [
  {
    label: "Companies",
    teams: [
      {
        label: "Loading...",
        value: "8",
      },
    ],
  },
];

type Team = Company[number]["teams"][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface CompanySwitcherProps extends PopoverTriggerProps {}

export async function getTeams(userId: string) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/merchants?adminId=${userId}`,
    {
      method: "GET",
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((merc) => {
      var temp: Array<Team> | void = [];
      merc.map((e: any) => {
        temp?.push({
          label: e.name,
          value: e.merchant_id,
          state: e.is_active,
        });
      });
      return temp;
    })
    .catch((error) => console.log("error", error));
}

export default function CompanySwitcher({ className }: CompanySwitcherProps) {
  const { data: session, status, update } = useSession();
  const [merchants, setMerchants] = useState<Array<Company> | void>(groups);
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(
    groups[0].teams[0]
  );
  React.useEffect(() => {
    async function fetchData() {
      if (session?.user.merchant_id) {
        const dbteams: Array<Team> | void = await getTeams(session?.user.id);
        const companies: Array<Company> = [
          {
            label: "Companies",
            teams: JSON.parse(JSON.stringify(dbteams)),
          },
        ];
        setMerchants(companies);
        setSelectedTeam(dbteams?.find((e: Team) => e.state === "true"));
      }
    }
    fetchData();
  }, [session?.user?.id]);

  const updateMerchantIdSession = async (merchantId: string) => {
    await setActiveMerchant(merchantId, session?.user.id).then(() =>
      update({
        merchant_id: merchantId,
      })
    );
  };

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/1.png`}
                alt={selectedTeam.label}
                className="grayscale"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedTeam.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No team found.</CommandEmpty>
              {merchants?.map((group: Company) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group?.teams?.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        setSelectedTeam(team);
                        setOpen(false);
                        updateMerchantIdSession(team.value);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                        <AvatarFallback>L</AvatarFallback>
                      </Avatar>
                      {team.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam.value === team.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  );
}
