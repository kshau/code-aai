"use client";

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSignupRequestData } from "@/lib/utils"
import { useFirestore } from "@/lib/firebase/useFirestore"

export default function Signup() {

	const { createDocument } = useFirestore();

	const [userSignupRequestData, setUserSignupRequestData] = useState<UserSignupRequestData>({
		name: "",
		gradeLevel: null,
		email: "",
		codingExperience: "beginner"
	});
	const [alertMessage, setAlertMessage] = useState("");


	const handleSignupFormSubmit = async (e: FormEvent<HTMLFormElement>) => {

		if (userSignupRequestData == null) {
			return;
		}

		e.preventDefault()

		await createDocument<UserSignupRequestData>("signup-requests", userSignupRequestData);

		setAlertMessage("Signup successful!")

	}

	const editUserSignupRequestDataField = (field: string, value: any) => {

		setUserSignupRequestData({
			...userSignupRequestData,
			[field]: value
		})

	}

	return (
		<Card className="w-full max-w-md mx-auto mt-32">

			<CardHeader>

				<CardTitle>
					Sign Up
				</CardTitle>

			</CardHeader>

			<CardContent>
				<form onSubmit={handleSignupFormSubmit} className="flex flex-col gap-y-4 pt-4">

					<div className="space-y-2">

						<Label>
							Grade Level
						</Label>

						<Select value={userSignupRequestData?.gradeLevel?.toString()} onValueChange={(value: string) => { editUserSignupRequestDataField("gradeLevel", value) }}>

							<SelectTrigger id="gradeLevel">
								<SelectValue placeholder="Select your grade level" />
							</SelectTrigger>

							<SelectContent>

								{[...Array(12), "College or higher"].map((gradeLevel, index) => (
									<SelectItem key={index} value={(index + 1).toString()}>
										{/* Will fix 1th 2th etc later */}
										{index + 1}th grade
									</SelectItem>
								))}

							</SelectContent>

						</Select>

					</div>

					<div className="space-y-2">

						<Label>
							Name
						</Label>

						<Input
							id="name"
							value={userSignupRequestData?.name}
							onChange={(e) => editUserSignupRequestDataField("name", e.target.value)}
							placeholder="Jeff Bezos"
						/>

					</div>

					<div className="space-y-2">

						<Label>
							Email
						</Label>

						<Input
							id="email"
							value={userSignupRequestData?.email}
							onChange={(e) => editUserSignupRequestDataField("email", e.target.value)}
							placeholder="jeff.bezos@amazon.com"
						/>

					</div>

					<div className="space-y-2 mb-4">

						<Label>
							Coding Experience
						</Label>

						<RadioGroup value={userSignupRequestData?.codingExperience} onValueChange={(value: string) => { editUserSignupRequestDataField("codingExperience", value) }} className="flex flex-col space-y-1">

							<div className="flex items-center space-x-2">
								<RadioGroupItem value="beginner" id="beginner" />
								<Label>Beginner</Label>
							</div>

							<div className="flex items-center space-x-2">
								<RadioGroupItem value="intermediate" id="intermediate" />
								<Label>Intermediate</Label>
							</div>

							<div className="flex items-center space-x-2">
								<RadioGroupItem value="advanced" id="advanced" />
								<Label>Advanced</Label>
							</div>

						</RadioGroup>

					</div>

					<Button type="submit" className="w-full">Sign Up</Button>

				</form>

				{alertMessage && <span className="mt-4 text-center text-green-600">{alertMessage}</span>}

			</CardContent>
		</Card>
	)
}

