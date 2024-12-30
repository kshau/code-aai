"use client"

import Link from 'next/link';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import { ThreeDots } from './loading';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/lib/firebase/useAuth';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LoginModalProps {
    signIn: ( user: string, password: string) => void
    setIsLoginOpen: (isOpen: boolean) => void
    isLoginOpen: boolean
}

export function LoginModal({ signIn, setIsLoginOpen, isLoginOpen }: LoginModalProps) {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        signIn(user, password)
    }


    return (
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogTrigger asChild>
                <Button className='text-white'>Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Authentication</DialogTitle>
                    <DialogDescription>
                        Login to continue
                    </DialogDescription>
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
                            <Button type="submit" className="w-full text-white" onClick={()=>{signIn(user, password)}}>
                                Login with user
                            </Button>
                        </form>
            </DialogContent>
        </Dialog>
    )
}

export function UserMenu() {
    const { user, logOut } = useAuth();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full w-9 h-9">
                    <Avatar>
                        <AvatarFallback>          
                            {user?.displayName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-w-72">
                <DropdownMenuLabel>{user?.email?.replace("@codeaai.org", "")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={logOut} className="hover:cursor-pointer">Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function Navbar({ children }: { children?: React.ReactNode }) {
  const { user, status, signIn, logOut } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className='flex flex-col h-screen'>
      <header className="sticky top-0 w-full flex justify-between px-4 sm:px-16 py-3 mb-4 z-50 bg-background/80 backdrop-blur-lg border-b">
        <Link href="/" className='font-bold text-xl flex items-center gap-2'>
          {/* <Image src={logo} alt="NSACC Logo" width={40} height={40} /> */}
          <h1>CodeAAI</h1>
        </Link>
        <div className='hidden sm:flex flex-row gap-4 md:gap-8 items-center'>
          <Link href="/" className="text-foreground/60 hover:text-purple-500 transition-all">About</Link>
          <Link href="/dashboard" className="text-foreground/60 hover:text-purple-500 transition-all">Dashboard</Link>
          <Link href="/contact" className="text-foreground/60 hover:text-purple-500 transition-all">Contact</Link>
        </div>
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
      <main className='z-0 flex-grow'>
        {children}
      </main>
    </div>
  );
}

export default Navbar;
