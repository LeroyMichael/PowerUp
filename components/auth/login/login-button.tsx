"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";

const LoginButton = () => {
  const { data: session } = useSession();
  if (session && session.user) {
    return (
      <Button
        className="absolute right-4 top-4 md:right-8 md:top-8"
        onClick={() => signOut()}
      >
        Logout
      </Button>
    );
  }
  return (
    <Button
      className=""
      onClick={() => signIn()}
    >
      Login
    </Button>
  );
};

export default LoginButton;
