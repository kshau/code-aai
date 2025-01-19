import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loading } from "../loading";
import { useAuth } from "@/hooks/useAuth";
import { useFirestore } from "@/hooks/useFirestore";
import { User } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CogIcon, LogOut, MoonIcon, SunIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { DialogDescription } from "@radix-ui/react-dialog";
import Link from "next/link";

export function NavbarUserMenu() {
  const { user, logOut, status } = useAuth();
  const { getUserData, editUserData } = useFirestore();
  const [userData, setUserData] = useState<User | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const fetchUser = async () => {
    if (user?.uid) {
      try {
        const userData = await getUserData(user.uid);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [status, user]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-9 h-9"
          >
            <Avatar>
              <AvatarImage
                src={`${
                  userData?.avatar ? `/avatars/${userData.avatar}.svg` : ""
                }`}
                alt="pfp"
              />
              <AvatarFallback>
                {user ? user?.email?.charAt(0) : <Loading />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-72">
          <DropdownMenuLabel>
            {user?.email?.replace("@codeaai.org", "")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setSettingsOpen(true);
            }}
            className="hover:cursor-pointer"
          >
            <CogIcon /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logOut} className="hover:cursor-pointer">
            <LogOut /> Log out
          </DropdownMenuItem>
          <DropdownMenuLabel className="flex items-center  gap-2">
            {theme == "light" ? <SunIcon /> : <MoonIcon />}
            <Switch
              onCheckedChange={() => {
                setTheme(`${theme === "light" ? "dark" : "light"}`);
              }}
            />
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              You can edit basic settings here! For more sensitive changes,
              please contact{" "}
              <Link
                href="mailto:contact.codeaai@gmail.com"
                className="underline text-primary"
              >
                contact.codeaai@gmail.com
              </Link>
            </DialogDescription>
          </DialogHeader>
          <DialogHeader>Avatar</DialogHeader>
          <div className="flex items-center  w-full gap-2 mb-4">
            {["boy1", "boy2", "girl1", "girl2"].map((avatar, index) => (
              <Button
                key={index}
                variant={`${selectedAvatar == avatar ? "default" : "outline"}`}
                className="flex w-24 h-24"
                onClick={() => {
                  setSelectedAvatar(avatar);
                }}
              >
                <img
                  src={`/avatars/${avatar}.svg`}
                  alt={avatar}
                  className="object-cover w-full h-full"
                />
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSettingsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (userData) {
                  await editUserData(userData.uid, {
                    avatar: selectedAvatar || "boy1",
                  });
                  await fetchUser();
                }
                setSettingsOpen(false);
              }}
              className="w-fit"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
