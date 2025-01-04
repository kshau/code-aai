"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toOrdinal, UserSignupRequestData } from "@/lib/utils";
import { useFirestore } from "@/lib/firebase/useFirestore";
import Navbar from "@/components/navbar";
import Image from "next/image";

export default function Signup() {
	const { createDocument } = useFirestore();

	const [userSignupRequestData, setUserSignupRequestData] =
		useState<UserSignupRequestData>({
			name: "",
			gradeLevel: null,
			email: "",
			codingExperience: "beginner",
		});
	const [alertMessage, setAlertMessage] = useState("");

	const handleSignupFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		if (userSignupRequestData == null) {
			return;
		}

		e.preventDefault();

		await createDocument<UserSignupRequestData>(
			"signup-requests",
			userSignupRequestData
		);

		setAlertMessage("Signup successful!");
		setUserSignupRequestData({
			name: "",
			gradeLevel: null,
			email: "",
			codingExperience: "beginner",
		});
	};

	return (
		<Navbar>
			<div className="flex flex-wrap gap-16 justify-center mt-32 p-4">
				<div className="flex flex-col my-auto">
					<img
						src="/undraw-proud-coder.svg"
						alt="Proud Coder"
						className="w-96"
					/>
					<span className="text-3xl font-bold max-w-md mb-2 mt-10">
						Sign up for Code AAI
					</span>
					<span className="text-md font-light max-w-md">
						Cosiva is dedicated to teaching kids coding through fun,
						hands-on projects, while preparing them for the future
						with concepts like AI and other emerging technologies.
					</span>
				</div>
				<Card className="w-full max-w-md h-fit">
					<CardHeader>
						<CardTitle>Sign Up</CardTitle>
					</CardHeader>

					<CardContent>
						<form
							onSubmit={handleSignupFormSubmit}
							className="flex flex-col gap-y-4 pt-4"
						>
							<div className="space-y-2">
								<Label>Grade Level</Label>

								<Select
									value={userSignupRequestData?.gradeLevel?.toString()}
									onValueChange={(value: string) => {
										setUserSignupRequestData({
											...userSignupRequestData,
											gradeLevel: parseInt(value),
										});
									}}
								>
									<SelectTrigger id="gradeLevel">
										<SelectValue placeholder="Select your grade level" />
									</SelectTrigger>

									<SelectContent>
										{[...Array(13)].map(
											(gradeLevel, index) => (
												<SelectItem
													key={index}
													value={(index + 1).toString()}
												>
													{/* Will fix 1th 2th etc later */}
													{index < 12 ? `${toOrdinal(index + 1)} grade` : "College or higher"}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Name</Label>

								<Input
									id="name"
									value={userSignupRequestData?.name}
									onChange={(e) =>
										setUserSignupRequestData({
											...userSignupRequestData,
											name: e.target.value,
										})
									}
									placeholder="Jeff Bezos"
								/>
							</div>

							<div className="space-y-2">
								<Label>Email</Label>

								<Input
									id="email"
									value={userSignupRequestData?.email}
									onChange={(e) =>
										setUserSignupRequestData({
											...userSignupRequestData,
											email: e.target.value,
										})
									}
									placeholder="jeff.bezos@amazon.com"
								/>
							</div>

							<div className="space-y-2 mb-4">
								<Label>Coding Experience</Label>

								<RadioGroup
									value={
										userSignupRequestData?.codingExperience
									}
									onValueChange={(
										value:
											| "beginner"
											| "intermediate"
											| "advanced"
									) => {
										setUserSignupRequestData({
											...userSignupRequestData,
											codingExperience: value,
										});
									}}
									className="flex flex-col space-y-1"
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="beginner"
											id="beginner"
										/>
										<Label>Beginner</Label>
									</div>

									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="intermediate"
											id="intermediate"
										/>
										<Label>Intermediate</Label>
									</div>

									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="advanced"
											id="advanced"
										/>
										<Label>Advanced</Label>
									</div>
								</RadioGroup>
							</div>

							<Button type="submit" className="w-full">
								Sign Up
							</Button>
						</form>

						{alertMessage && (
							<span className="mt-4 text-center text-green-600 text-sm font-semibold">
								{alertMessage}
							</span>
						)}
					</CardContent>
				</Card>
			</div>
		</Navbar>
	);
}
