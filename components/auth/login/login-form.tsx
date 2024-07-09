"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/molecules/password-input";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginButton from "./login-button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    console.log("onSubmit", email, password);
    event.preventDefault();
    setIsLoading(true);
    const response = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      // callbackUrl: "/dashboard",
    }).then((e) => {
      if (e?.ok == false) {
        toast({
          title: "Wrong email or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful",
          variant: "default",
        });
        router.push("/dashboard");
      }
    });

    setIsLoading(false);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Enter your email below to login your account
          </DialogDescription>
        </DialogHeader>
        <Button variant="outline" type="button" disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="password"
            />
          </div>
          <Button disabled={isLoading} type="submit" onClick={onSubmit}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </form>
        <DialogFooter className="flex justify-items-center"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
