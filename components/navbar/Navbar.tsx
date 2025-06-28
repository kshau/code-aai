"use client";

import Link from "next/link";
import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogInIcon, Menu, UserPlus } from "lucide-react";
import { LoadingPage } from "../loading";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"
import Footer from "./Footer";

export const links = [
  { href: "/#about", name: "About" },
  { href: "/#benefits", name: "Benefits" },
  { href: "/#features", name: "Features" },
];

interface NavbarProps {
  children?: ReactNode;
  className?: string;
  protectedRoute?: boolean;
  dynamic?: boolean
  footer?: boolean
}

export default function Navbar({
  children,
  className,
  protectedRoute = false,
  dynamic = false,
  footer = false
}: NavbarProps) {
  const { status, logOut } = useAuth();
  const path = usePathname();
  const isActive = (href: string) => path === href;
  const [scrolled, setScrolled] = useState(!dynamic)

  useEffect(() => {
    if (dynamic) {
      const handleScroll = () => {
        setScrolled(window.scrollY > 30)
      }

      window.addEventListener("scroll", handleScroll)

      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (
    (status === "loading" || status === "unauthenticated") &&
    protectedRoute
  ) {
    return <LoadingPage />;
  }


  return (
    <div className="flex flex-col min-h-screen">
      <motion.nav
        animate={{ y: scrolled ? 0 : -2, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className={`w-full flex justify-between px-4 sm:px-32 py-4 fixed top-0 left-0 right-0 z-50  ${scrolled ? "bg-background/70 backdrop-blur-lg border-b shadow-sm" : "bg-transparent"
          }`}
      >
        <Link href="/" className="flex items-center justify-center">
          <Image src={logo} alt="Logo" width={60} height={60} className="rounded-full" />
          <span className="font-bold text-lg sm:text-xl ml-2">CodeAAI</span>
        </Link>

        <div className="hidden sm:flex flex-row gap-12 items-center justify-center flex-1">
          {links.map(({ href, name }, index) => (
            <Link
              key={index}
              href={href}
              className={`relative text-center text-lg font-medium transition-all ${isActive(href)
                ? "text-blue-500 font-bold"
                : "text-foreground/70 hover:text-blue-500"
                }`}
            >
              {name}
            </Link>
          ))}
        </div>

        <div className="items-center justify-end hidden sm:flex ">
          {status !== "unauthenticated" ? (
            <NavbarUserMenu />
          ) : (
            <div className="flex w-full gap-2">
              <Button asChild className="flex items-center justify-center w-full h-full text-white">
                <Link href="/authentication">
                  Login <LogInIcon className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex items-center justify-center w-full h-full">
                <Link href="/authentication?signup=true">
                  Sign Up <UserPlus className="ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>

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
              {status == "unauthenticated" ? (
                <div className="flex flex-col gap-2">
                  <Button asChild className="flex items-center justify-center w-full h-full text-white">
                    <Link href="/authentication">
                      Login <LogInIcon className="ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex items-center justify-center w-full h-full">
                    <Link href="/authentication?signup=true">
                      Sign Up <UserPlus className="ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button onClick={logOut}>Log out</Button>
              )}
              
            </nav>
          </SheetContent>
        </Sheet>
      </motion.nav>

      <main className={cn(className, "z-0 flex-grow")}>{children}</main>
      {footer && <Footer />}
    </div>
  );
}
