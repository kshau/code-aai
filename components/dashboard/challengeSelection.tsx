"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Challenge } from "@/lib/utils";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function ChallengeSection() {
  const [challengesData, setChallengesData] = useState<Challenge[]>([
    {
      id: "banana",
      title: "Fizz Buzz",
      description:
        "A very nice description for a very nice challenges that you should totally solve!",
      difficulty: "easy",
      testCases: [],
    },
    {
      id: "mango",
      title: "Summation",
      description:
        "Are you smart enough to be able to add two integers together? Prove it by solving!",
      difficulty: "medium",
      testCases: [],
    },
    {
      id: "strawberry",
      title: "Integration",
      description:
        "What do you still remember from your calculus class in high school or college?",
      difficulty: "hard",
      testCases: [],
    },
  ]);

  return (
    <ScrollArea className="pr-4">
      <div className="grid lg:grid-cols-2 gap-4 max-h-[23rem]">
        {challengesData.map((challenge: Challenge, index) => (
          <Card className="min-w-64 lg:max-w-96" key={index}>
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
              <span className="font-thin">{challenge.description}</span>
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
  );
}
