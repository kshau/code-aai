"use client"

import Link from 'next/link';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image";
import { useAuth } from '@/lib/authContext';
// import LoginModal from './custom/LoginModal';
// import { UserMenu } from './custom/UserMenu';
// import { ThreeDots } from './custom/Loading';
import { Menu } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';


function Navbar({ children }: { children?: React.ReactNode }) {
  const { user, status, signIn, logOut } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="sticky top-0 w-full flex justify-between px-4 sm:px-16 py-4 z-50 bg-background/80 backdrop-blur-lg border-b">
        <Link href="/" className='font-bold text-xl sm:text-2xl flex items-center gap-2'>
          <Image src={logo} alt="NSACC Logo" width={40} height={40} />
          <h1>NSACC</h1>
        </Link>
        <div className='hidden sm:flex flex-row gap-4 md:gap-8 items-center'>
          <Link href="/#about" className="text-foreground/60 hover:text-purple-500 transition-all">About Us</Link>

          <DropdownMenu onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger
              onPointerDown={() => { router.push("/#programs")}}
              className="flex items-center gap-1"
            >
              <p className="text-foreground/60 hover:text-purple-500 transition-all">Our Programs</p>
              <ChevronDown
                className={`h-4 w-4 text-foreground/60 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => { router.push("/programs/realworld-experience-hub") }}>Real World Hub</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/contact" className="text-foreground/60 hover:text-purple-500 transition-all">Contact</Link>

          {status === "loading" ? (
            <ThreeDots />
          ) : (
            <div>
              {user ? (
                <UserMenu />
              ) : (
                <LoginModal
                  isLoginOpen={isLoginOpen}
                  signUp={() => { }}
                  setIsLoginOpen={setIsLoginOpen}
                  signIn={signIn}
                />
              )}
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
              <Link href="/#about" className="text-foreground/60 hover:text-foreground">About Us</Link>
              <Link href="/#programs" className="text-foreground/60 hover:text-foreground">Our Programs</Link>
              <Link href="/contact" className="text-foreground/60 hover:text-foreground">Contact</Link>
              {user ? (
                <Button onClick={logOut}>Logout</Button>
              ) : (
                <Button onClick={() => setIsLoginOpen(true)}>Login</Button>
              )}
              <Button asChild>
                <Link target='_blank' href="https://forms.gle/9cAKaWxixZu7WHP5A">Join Waitlist</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      <main className='z-0'>
        {children}
      </main>
    </>
  );
}

export default Navbar;

