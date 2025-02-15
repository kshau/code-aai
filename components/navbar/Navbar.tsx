"use client";

import Link from "next/link";
import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { LoadingPage } from "../loading";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { useAuth } from "@/hooks/useAuth";
import { NavbarLoginModal } from "./NavbarLoginModal";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"
import Footer from "./Footer";

export const links = [
  { href: "/#about", name: "About" },
  { href: "/#howitworks", name: "How it works" },
  { href: "/#signup", name: "Sign up" }
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
  const { user, status, signIn, logOut } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const isActive = (href: string) => path === href;
  const [scrolled, setScrolled] = useState(!dynamic)

  useEffect(() => {
    if (protectedRoute && status === "unauthenticated") {
      router.push("/");
    }

    if (status == "authenticated") {
      links[links.length - 1] = ({ href: "/dashboard", name: "Dashboard" })
    }

  }, [protectedRoute, status, router]);
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
        className={`w-full flex justify-between gap-32 px-4 sm:px-32 py-4 fixed top-0 left-0 right-0 z-50 ${scrolled ? "bg-background/90 backdrop-blur-lg border-b shadow-sm" : "bg-transparent"
          }`}
      >
        <Link href="/" className="flex items-center justify-center gap-x-1">
          <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="font-bold text-lg sm:text-xl ml-2">CodeAAI</span>
        </Link>

        <nav className="hidden sm:flex flex-row gap-6 items-center">
          {links.map(({ href, name }, index) => {
            return (
              <Link
                key={index}
                href={href}
                className={`relative text-center transition-all ${isActive(href)
                  ? "text-blue-500 font-bold"
                  : "text-foreground/70 hover:text-blue-500"
                  }`}
              >
                {name}
              </Link>
            );
          })}

          <div className="flex items-center">
            {status !== "unauthenticated" ? (
              <NavbarUserMenu />
            ) : (
              <NavbarLoginModal signIn={signIn} />
            )}
          </div>
        </nav>

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
      </motion.nav>

      <main className={cn(className, "z-0 flex-grow py-32 md:py-0")}>{children}</main>
      {footer && <Footer />}
    </div>
  );
}
