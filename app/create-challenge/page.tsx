"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Challenge } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function CreateChallenge() {

	const [challengeData, setChallengeData] = useState<Challenge>({
		id: null,
		title: "Untitled Challenge", 
		description: "", 
		difficulty: "easy", 
		testCases: [
			{
				inputs: [
					{
						name: "Input 1", 
						value: ""
					}
				],
				expectedOutput: ""
			}
		]
	})

	return (

		<div className="w-screen flex justify-center">

			<div className="flex flex-col gap-4">

				<Card>

					<CardHeader>

						<CardTitle>
							Information
						</CardTitle>

					</CardHeader>

					<CardContent className="mt-2 flex flex-col gap-y-4">

						<div className="space-y-2">
							<Label>
								Title
							</Label>
							<Input value={challengeData.title}/>
						</div>

						<div className="space-y-2">
							<Label>
								Description
							</Label>
							<Textarea value={challengeData.description}/>
						</div>

					</CardContent>

				</Card>

				<Card>

					<CardHeader>

						<CardTitle>
							Test cases
						</CardTitle>

					</CardHeader>

					<CardContent className="mt-2">

						<Table>

							<TableHeader>
								<TableRow>

									<TableHead>
										<div className="flex flex-row gap-x-2 w-40">
											<Input defaultValue="Input 1" className="my-4"/>
											<Select>
												<SelectTrigger className="my-auto">
													<SelectValue placeholder="str"/>
												</SelectTrigger>
											</Select>
										</div>
									</TableHead>

									<TableHead>
										<div className="flex flex-row gap-x-2 w-40">
											<Input defaultValue="Input 1" className="my-4"/>
											<Select>
												<SelectTrigger className="my-auto">
													<SelectValue placeholder="str"/>
												</SelectTrigger>
											</Select>
										</div>
									</TableHead>
									
									<TableHead className="text-center">
										Output
									</TableHead>

								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow >

									<TableCell>
										<Input className=" w-40"/>
									</TableCell>

									<TableCell>
										<Input className=" w-40"/>
									</TableCell>

									<TableCell>
										<Input className=" w-24"/>
									</TableCell>

								</TableRow>
							</TableBody>

						</Table>

						<div className="flex flex-row gap-x-2 mt-6 justify-end">

							<Button size="sm">
								<PlusIcon/>
								Test case
							</Button>

							<Button size="sm" variant="secondary">
								<PlusIcon/>
								Input
							</Button>

						</div>

					</CardContent>

				</Card>

			</div>

		</div>

	)

}