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

interface NavbarLoginModalProps {
	signIn: (user: string, password: string) => void;
	setIsLoginOpen: (isOpen: boolean) => void;
	isLoginOpen: boolean;
}

export function NavbarLoginModal({
	signIn,
	setIsLoginOpen,
	isLoginOpen,
}: NavbarLoginModalProps) {
	const [inputtedUsername, setInputtedUsername] = useState<string>("");
	const [inputtedPassword, setInputtedPassword] = useState<string>("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		signIn(inputtedUsername, inputtedPassword);
	};

	return (
		<Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
			<DialogTrigger asChild>
				<Button className="text-white">Login</Button>
			</DialogTrigger>
			<DialogContent className="max-w-96">
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
					<Button
						type="submit"
						className="w-full"
						onClick={() => {
							signIn(inputtedUsername, inputtedPassword);
						}}
					>
						Log in
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
