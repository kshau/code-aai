"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Challenge, ChallengeDifficulty, User } from "@/lib/utils";
import Link from "next/link";
import { ArrowRightIcon, Check, SearchIcon, SearchXIcon } from "lucide-react";
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
  difficulty: ChallengeDifficulty | null;
}

export default function DashboardChallenges() {
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

  const { getDocuments, getUserData } = useFirestore();
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      if (user) {
        try {
          const challenges: Challenge[] = await getDocuments<Challenge>(
            "challenges"
          );
          setChallengesData(challenges);
        } catch (error) {
          console.error("Error fetching challenges:", error);
        }
      }
    };

    fetchChallenges();
  }, [user, getDocuments]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userData: User = await getUserData(user.uid);
        setUserData(userData);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!challengesData) {
      return;
    }

    const newSearchedChallengesData = challengesData.filter(
      (challenge: Challenge) => {
        const challengeNameFormatted = challenge.name.toLowerCase();
        const challengeDescriptionFormatted =
          challenge.description.toLowerCase();
        const searchQueryKeywordFormatted = searchQuery.keyword.toLowerCase();

        return (
          (challengeNameFormatted.includes(searchQueryKeywordFormatted) ||
            challengeDescriptionFormatted.includes(
              searchQueryKeywordFormatted
            )) &&
          (challenge.difficulty == searchQuery.difficulty ||
            !searchQuery.difficulty)
        );
      }
    );

    setSearchedChallengesData(newSearchedChallengesData);
  }, [challengesData, searchQuery]);

  return (
    <div className="lg:animate-flyInFromBottomLeft lg:min-w-[50rem]">
      {challengesData && userData ? (
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
                    value == "any" ? null : (value as ChallengeDifficulty),
                });
              }}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder={searchQuery.difficulty || "Any"} />
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
                {searchedChallengesData.map((challenge: Challenge, index) => {
                  const isSolved = userData.solvedChallenges.some(
                    (solvedChallenge) => solvedChallenge.id === challenge.id
                  );

                  return (
                    <Card className="max-w-3xl" key={index}>
                      <CardHeader className="flex flex-row items-center gap-4">
                        <CardTitle>{challenge.name}</CardTitle>
                        <Badge difficulty={challenge.difficulty}>
                          {challenge.difficulty.toUpperCase()}
                        </Badge>
                      </CardHeader>
                      <CardContent className="text-lg flex flex-row gap-x-4">
                        <span className="font-light text-sm">
                          {challenge.description}
                        </span>
                        <Link href={`/challenge/${challenge.id}`}>
                          <Button
                            variant="outline"
                            className={`my-auto rounded-full aspect-square h-12 ${
                              isSolved ? "bg-green-600 hover:bg-green-700" : ""
                            } `}
                          >
                            {isSolved == false ? (
                              <ArrowRightIcon strokeWidth={3} />
                            ) : (
                              <Check className="text-white" />
                            )}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
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
