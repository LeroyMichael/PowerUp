"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/molecules/password-input";
import { signIn } from "next-auth/react";
import { LoginForm } from "../login/login-form";

interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    const result = await signIn("credentials", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <div className="grid grid-cols-2 gap-1">
              <Input
                id="firstname"
                placeholder="First Name"
                autoCapitalize="none"
                autoComplete="firstname"
                autoCorrect="off"
                disabled={isLoading}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                id="lastname"
                placeholder="Last Name"
                autoCapitalize="none"
                autoComplete="lastname"
                autoCorrect="off"
                disabled={isLoading}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="password"
            />
          </div>
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground ">
            already have an account?
          </span>
        </div>
      </div>

      <LoginForm className="">
        <Button variant="secondary" className="">
          Login
        </Button>
      </LoginForm>
      {/* <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button> */}
    </div>
  );
}
