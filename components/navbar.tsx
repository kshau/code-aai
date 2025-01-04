"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { LoadingPage, ThreeDots } from "./loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/firebase/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

import Image from "next/image";
import logo from "@/public/logo.png";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const links = [
  { href: "/#about", label: "About Us" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/contact", label: "Contact" },
];

function Navbar({
  children,
  className,
  protectedRoute = false,
}: {
  children?: React.ReactNode;
  className?: string;
  protectedRoute?: boolean;
}) {
  const { user, status, signIn, logOut } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const isActive = (href: string) => path === href;

  useEffect(() => {
    if (protectedRoute && status != "authenticated") {
      router.push("/");
    }
  }, [status]);

  if (status == "loading" && protectedRoute) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 w-full flex justify-between items-center px-6 sm:px-12 py-3 z-50 bg-background/80 backdrop-blur-lg border-b">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center justify-center">
          <Image src={logo} alt="NSACC Logo" width={30} height={30} />
          <h1 className="font-bold text-xl sm:text-2xl ml-2">CodeAAI</h1>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden sm:flex flex-row gap-6 items-center">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative text-foreground/70 hover:text-blue-500 transition-all ${
                isActive(href) ? "text-blue-500" : ""
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Auth Buttons */}
          <div className={`flex items-center ${user ? "ml-4" : ""}`}>
            {status === "loading" ? (
              <ThreeDots />
            ) : (
              <div>
                {user ? (
                  <UserMenu />
                ) : (
                  <LoginModal
                    isLoginOpen={isLoginOpen}
                    setIsLoginOpen={setIsLoginOpen}
                    signIn={signIn}
                  />
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-foreground/70 hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
              {user ? (
                <Button onClick={logOut}>Logout</Button>
              ) : (
                <Button onClick={() => setIsLoginOpen(true)}>Login</Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <main className={`z-0 flex-grow ${className}`}>{children}</main>
    </div>
  );
}

interface LoginModalProps {
  signIn: (user: string, password: string) => void;
  setIsLoginOpen: (isOpen: boolean) => void;
  isLoginOpen: boolean;
}

export function LoginModal({
  signIn,
  setIsLoginOpen,
  isLoginOpen,
}: LoginModalProps) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(user, password);
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>Login to continue</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full text-white"
            onClick={() => {
              signIn(user, password);
            }}
          >
            Login with user
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function UserMenu() {
  const { user, logOut } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full w-9 h-9"
        >
          <Avatar>
            <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-72">
        <DropdownMenuLabel>
          {user?.email?.replace("@codeaai.org", "")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logOut} className="hover:cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Navbar;
