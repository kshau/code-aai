"use client";

import Link from "next/link";
import React, { ReactNode, useEffect } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { LoadingPage } from "../loading";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { NavbarLoginModal } from "./NavbarLoginModal";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", name: "About" },
  { href: "/dashboard", name: "Dashboard" },
];

interface NavbarProps {
  children?: ReactNode;
  className?: string;
  protectedRoute?: boolean;
}

export default function Navbar({
  children,
  className,
  protectedRoute = false,
}: NavbarProps) {
  const { user, status, signIn, logOut } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const isActive = (href: string) => path === href;

  // State to manage the modal visibility inside the Sheet

  useEffect(() => {
    if (protectedRoute && status === "unauthenticated") {
      router.push("/");
    }
  }, [protectedRoute, status, router]);

  if (
    (status === "loading" || status === "unauthenticated") &&
    protectedRoute
  ) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 w-full flex justify-between items-center px-6 sm:px-12 py-3 z-50 bg-background/80 backdrop-blur-lg border-b">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center justify-center gap-x-1">
          <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full"/>
          <span className="font-bold text-lg sm:text-xl ml-2">CodeAAI</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden sm:flex flex-row gap-6 items-center">
          {links.map(({ href, name }, index) => {
            if (status === "unauthenticated" && href === "/dashboard") {
              return (
                <span
                  key={index}
                  className="relative text-foreground/50 cursor-not-allowed"
                >
                  {name}
                </span>
              );
            }

            return (
              <Link
                key={index}
                href={href}
                className={`relative transition-all ${
                  isActive(href)
                    ? "text-blue-500 font-bold"
                    : "text-foreground/70 hover:text-blue-500"
                }`}
              >
                {name}
              </Link>
            );
          })}

          {/* Auth Buttons */}
          <div className="flex items-center">
            {status !== "unauthenticated" ? (
              <NavbarUserMenu />
            ) : (
              <NavbarLoginModal signIn={signIn} />
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
              {links.map(({ href, name: label }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="text-foreground/70 hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
              {user ? (
                <Button onClick={logOut}>Log out</Button>
              ) : (
                <NavbarLoginModal signIn={signIn} />
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      <main className={cn(className, "z-0 flex-grow")}>{children}</main>
    </div>
  );
}
