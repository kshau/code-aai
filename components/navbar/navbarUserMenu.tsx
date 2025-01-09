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
import { CogIcon, LogOut } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

export function NavbarUserMenu() {
	const { user, logOut, status } = useAuth();
	const { getUserData, editUserData } = useFirestore();
	const [userData, setUserData] = useState<User | null>(null);
	const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
	const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

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
						variant="secondary"
						size="icon"
						className="rounded-full w-9 h-9"
					>
						<Avatar>
							<AvatarImage
								src={`${
									userData?.avatar
										? `/avatars/${userData.avatar}.svg`
										: ""
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
					<DropdownMenuItem
						onClick={logOut}
						className="hover:cursor-pointer"
					>
						<LogOut /> Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Settings</DialogTitle>
					</DialogHeader>
					<DialogHeader>Avatar</DialogHeader>
					<div className="flex items-center  w-full gap-2">
						{["boy1", "boy2", "girl1", "girl2"].map(
							(avatar, index) => (
								<Button
									key={index}
									variant={`${
										selectedAvatar == avatar
											? "default"
											: "outline"
									}`}
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
							)
						)}
					</div>
					<DialogFooter>
						<DialogClose>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<DialogClose>
							<Button
								onClick={async () => {
									if (userData) {
										await editUserData(userData.uid, {
											avatar: selectedAvatar || "boy1",
										});
										await fetchUser();
									}
								}}
								className="w-fit"
							>
								Save
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
