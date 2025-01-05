"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Challenge } from "@/lib/utils";
import Link from "next/link";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

export default function ChallengeSection() {
	const [challengesData, setChallengesData] = useState<Challenge[]>([
		{
			id: "banana",
			title: "Fizz Buzz",
			description:
				"A very nice description for a very nice challenges that you should totally solve!",
			difficulty: "easy",
			testCases: [],
			solved: false,
			points: 100,
		},
		{
			id: "mango",
			title: "Summation",
			description:
				"Are you smart enough to be able to add two integers together? Prove it by solving!",
			difficulty: "medium",
			testCases: [],
			solved: false,
			points: 100,
		},
		{
			id: "strawberry",
			title: "Integration",
			description:
				"What do you still remember from your calculus class in high school or college?",
			difficulty: "hard",
			testCases: [],
			solved: false,
			points: 100,
		},
		{
			id: "strawberry",
			title: "Integration",
			description:
				"What do you still remember from your calculus class in high school or college?",
			difficulty: "hard",
			testCases: [],
			solved: false,
			points: 100,
		},
		{
			id: "strawberry",
			title: "Integration",
			description:
				"What do you still remember from your calculus class in high school or college?",
			difficulty: "hard",
			testCases: [],
			solved: false,
			points: 100,
		},
		{
			id: "strawberry",
			title: "Integration",
			description:
				"What do you still remember from your calculus class in high school or college?",
			difficulty: "hard",
			testCases: [],
			solved: false,
			points: 100,
		},
	]);

	const [searchQuery, setSearchQuery] = useState<string>("");

	return (
		<div>
			<div className="flex flex-row border-[1px] rounded-md mb-2">
				<SearchIcon className="my-auto m-2" />
				<Input
					placeholder="Search for a challenge"
					className="border-none p-1"
					onChange={e => {setSearchQuery(e.target.value)}}
				/>
			</div>
			<ScrollArea className="flex-grow pr-4">
				<div className="grid lg:grid-cols-2 gap-2 h-full max-w-[50rem] max-h-[40vh]">
					{challengesData.map((challenge: Challenge, index) => (
						<Card className="max-w-3xl" key={index}>
							<CardHeader className="flex flex-row gap-4">
								<CardTitle>{challenge.title}</CardTitle>
								<Badge
									className="my-auto relative bottom-1"
									difficulty={challenge.difficulty}
								>
									{challenge.difficulty.toUpperCase()}
								</Badge>
							</CardHeader>

							<CardContent className="text-lg flex flex-row gap-x-4">
								<span className="font-thin">
									{challenge.description}
								</span>
								<Link href={`/solve?c=${challenge.id}`}>
									<Button
										variant="outline"
										className="my-auto rounded-full aspect-square h-12"
									>
										<ArrowRightIcon strokeWidth={3} />
									</Button>
								</Link>
							</CardContent>
						</Card>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
