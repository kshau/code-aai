"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";


export function NavbarLoginModal() {
  const router = useRouter();
  const [inputtedUsername, setInputtedUsername] = useState<string>("");
  const [inputtedPassword, setInputtedPassword] = useState<string>("");
  const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signIn(inputtedUsername, inputtedPassword);

      if (inputtedUsername && !inputtedUsername.includes("@")) {
        router.push("/dashboard")
      }
    } catch {
      setInvalidCredentials(true);
    };
  }

  return (
    <Dialog onOpenChange={(isOpen) => {
      if (!isOpen) {
        setInputtedUsername("");
        setInputtedPassword("");
        setInvalidCredentials(false);
      }
    }}
    >
      <DialogTrigger asChild>
        <Button className="text-white">Log in</Button>
      </DialogTrigger>
      <DialogContent className="max-w-96">
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>Log in to continue.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={inputtedUsername}
              onChange={(e) => setInputtedUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={inputtedPassword}
              onChange={(e) => setInputtedPassword(e.target.value)}
              required
            />
          </div>

          {invalidCredentials && (
            <div className="text-difficulty-hard font-semibold mt-2 flex flex-row gap-x-1">
              <XIcon />
              <span>Invalid credentials!</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full "
          >
            Log in
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
