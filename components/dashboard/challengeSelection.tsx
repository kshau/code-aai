"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Challenge } from "@/lib/utils";
import Link from "next/link";
import { ArrowRightIcon, SearchIcon, SearchXIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useFirestore } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Loading } from "../loading";

interface ChallengeSearchQuery {
	keyword: string;
	difficulty: "easy" | "medium" | "hard" | null;
}

export default function ChallengeSection() {
	const [challengesData, setChallengesData] = useState<Challenge[] | null>(
		null
	);
	const [searchQuery, setSearchQuery] = useState<ChallengeSearchQuery>({
		keyword: "",
		difficulty: null,
	});
	const [searchedChallengesData, setSearchedChallengesData] = useState<
		Challenge[]
	>([]);
	const { getDocuments } = useFirestore();
	const { user } = useAuth();

	useEffect(() => {
		const fetchChallenges = async () => {
			if (user) {
				try {
					const challenges: Challenge[] =
						await getDocuments<Challenge>("challenges");
					setChallengesData(challenges);
				} catch (error) {
					console.error("Error fetching challenges:", error);
				}
			}
		};

		fetchChallenges();
	}, [user, getDocuments]);

	useEffect(() => {
		if (!challengesData) {
			return;
		}

		const newSearchedChallengesData = challengesData.filter(
			(challenge: Challenge) => {
				const challengeNameFormatted = challenge.name.toLowerCase();
				const challengeDescriptionFormatted =
					challenge.description.toLowerCase();
				const searchQueryKeywordFormatted =
					searchQuery.keyword.toLowerCase();

				return (
					(challengeNameFormatted.includes(
						searchQueryKeywordFormatted
					) ||
						challengeDescriptionFormatted.includes(
							searchQueryKeywordFormatted
						)) &&
					(challenge.difficulty === searchQuery.difficulty ||
						!searchQuery.difficulty)
				);
			}
		);

		setSearchedChallengesData(newSearchedChallengesData);
	}, [challengesData, searchQuery]);

	return (
		<div className="animate-flyInFromBottomLeft lg:min-w-[50rem] flex justify-center">
			{challengesData ? (
				<div>
					<div className="flex flex-row gap-x-2">
						<div className="flex flex-row border-[1px] rounded-md mb-2 w-full">
							<SearchIcon className="my-auto m-2" />
							<Input
								placeholder="Search for a challenge"
								className="border-none p-1"
								onChange={(e) => {
									setSearchQuery({
										...searchQuery,
										keyword: e.target.value,
									});
								}}
							/>
						</div>
						<Select
							onValueChange={(value) => {
								setSearchQuery({
									...searchQuery,
									difficulty:
										value === "any"
											? null
											: (value as
													| "easy"
													| "medium"
													| "hard"),
								});
							}}
						>
							<SelectTrigger className="w-28">
								<SelectValue
									placeholder={
										searchQuery.difficulty || "Any"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="any">Any</SelectItem>
								<SelectItem value="easy">Easy</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="hard">Hard</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<ScrollArea className="flex-grow pr-4">
						{searchedChallengesData.length > 0 ? (
							<div className="grid lg:grid-cols-2 gap-2 h-full max-w-[50rem] max-h-[40vh]">
								{searchedChallengesData.map(
									(challenge: Challenge, index) => (
										<Card className="max-w-3xl" key={index}>
											<CardHeader className="flex flex-row gap-4">
												<CardTitle>
													{challenge.name}
												</CardTitle>
												<Badge
													className="my-auto relative bottom-1"
													difficulty={
														challenge.difficulty
													}
												>
													{challenge.difficulty.toUpperCase()}
												</Badge>
											</CardHeader>
											<CardContent className="text-lg flex flex-row gap-x-4">
												<span className="font-thin">
													{challenge.description}
												</span>
												<Link
													href={`/challenge/${challenge.id}`}
												>
													<Button
														variant="outline"
														className="my-auto rounded-full aspect-square h-12"
													>
														<ArrowRightIcon
															strokeWidth={3}
														/>
													</Button>
												</Link>
											</CardContent>
										</Card>
									)
								)}
							</div>
						) : (
							<div className="flex flex-col items-center text-gray-400 gap-y-4 pt-12">
								<SearchXIcon size={40} />
								<span className="max-w-48 text-center">
									No challenges found. Try a different search!
								</span>
							</div>
						)}
					</ScrollArea>
				</div>
			) : (
				<div className="mt-20">
					<Loading />
				</div>
			)}
		</div>
	);
}
