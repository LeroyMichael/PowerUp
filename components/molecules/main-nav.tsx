"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Banknote,
  BanknoteIcon,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShoppingCart,
  Users2,
  Wallet,
  CircleDollarSign,
  HandIcon,
  Coins,
} from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";

export function MainNavMobile() {
  const { data: session, status } = useSession();
  const activeClass = (path: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isActive: boolean = usePathname().includes(path);
    return isActive
      ? " text-foreground"
      : " text-muted-foreground hover:text-foreground";
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium pt-10">
          {session?.user.role != "manager" && (
            <>
              <SheetClose asChild>
                <Link
                  href="/dashboard"
                  className={
                    "flex items-center gap-4 px-2.5" + activeClass("dashboard")
                  }
                >
                  <Home className="h-5 w-5" />
                  Dashboard {session?.user.role}
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/wallets"
                  className={
                    "flex items-center gap-4 px-2.5 " + activeClass("wallets")
                  }
                >
                  <Wallet className="h-5 w-5" />
                  Wallets
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/purchases"
                  className={
                    "flex items-center gap-4 px-2.5" + activeClass("purchases")
                  }
                >
                  <BanknoteIcon className="h-5 w-5" />
                  Purchases
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/transactions"
                  className={
                    "flex items-center gap-4 px-2.5 " +
                    activeClass("transactions")
                  }
                >
                  <ShoppingCart className="h-5 w-5" />
                  Transactions
                </Link>
              </SheetClose>
            </>
          )}
          <SheetClose asChild>
            <Link
              href="/sales"
              className={
                "flex items-center gap-4 px-2.5 " + activeClass("sales")
              }
            >
              <CircleDollarSign className="h-5 w-5" />
              Sales
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/inventory"
              className={
                "flex items-center gap-4 px-2.5" + activeClass("inventory")
              }
            >
              <Package className="h-5 w-5" />
              Inventory
            </Link>
          </SheetClose>
          {session?.user.role != "manager" && (
            <>
              <SheetClose asChild>
                <Link
                  href={"/expenses"}
                  className={
                    "flex items-center gap-4 px-2.5" + activeClass("expenses")
                  }
                >
                  <Coins className={"h-5 w-5" + activeClass("settings")} />
                  Expenses
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/contacts"
                  className={
                    "flex items-center gap-4 px-2.5" + activeClass("contacts")
                  }
                >
                  <Users2 className={"h-5 w-5" + activeClass("contacts")} />
                  Contacts
                </Link>
              </SheetClose>
            </>
          )}
          <SheetClose asChild>
            <Link
              href="/settings"
              className={
                "flex items-center gap-4 px-2.5" + activeClass("settings")
              }
            >
              <LineChart className={"h-5 w-5" + activeClass("settings")} />
              Settings
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { data: session, status } = useSession();
  const activeClass = (path: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isActive: boolean = usePathname().includes(path);
    return isActive
      ? " bg-accent text-accent-foreground"
      : " text-muted-foreground";
  };
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2
            className={"h-4 w-4 transition-all group-hover:scale-110"}
          />
          <span className="sr-only">Acme Inc</span>
        </Link>

        {session?.user.role != "manager" && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className={
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8" +
                    activeClass("dashboard")
                  }
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/wallets"
                  className={
                    "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                    activeClass("wallets")
                  }
                >
                  <Wallet className="h-5 w-5" />
                  <span className="sr-only">Wallets</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Wallets</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/purchases"
                  className={
                    "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                    activeClass("purchases")
                  }
                >
                  <BanknoteIcon className="h-5 w-5" />
                  <span className="sr-only">Purchases</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Purchases</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/transactions"
                  className={
                    "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                    activeClass("transactions")
                  }
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Transactions</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Transactions</TooltipContent>
            </Tooltip>
          </>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/sales"
              className={
                "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                activeClass("sales")
              }
            >
              <CircleDollarSign className="h-5 w-5" />
              <span className="sr-only">Sales</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Sales</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/inventory"
              className={
                "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                activeClass("inventory")
              }
            >
              <Package className="h-5 w-5" />
              <span className="sr-only">Inventory</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Inventory</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/expenses"
              className={
                "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                activeClass("expenses")
              }
            >
              <Coins className={"h-5 w-5" + activeClass("settings")} />
              <span className="sr-only">Expenses</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Expenses</TooltipContent>
        </Tooltip>
        {session?.user.role != "manager" && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/contacts"
                  className={
                    "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                    activeClass("contacts")
                  }
                >
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Contacts</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Contacts</TooltipContent>
            </Tooltip>
          </>
        )}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              className={
                "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                activeClass("settings")
              }
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
