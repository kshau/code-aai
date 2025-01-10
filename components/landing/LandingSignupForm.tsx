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
import { useFirestore } from "@/hooks/useFirestore";
import { CheckCircleIcon } from "lucide-react";

const defaultForm: UserSignupRequestData = {
  username: "",
  gradeLevel: 9,
  parentEmail: "",
  codingExperience: "beginner",
};

export default function LandingSignupForm() {
  const [userSignupRequestData, setUserSignupRequestData] =
    useState<UserSignupRequestData>(defaultForm);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // Track success or failure
  const { createDocument } = useFirestore();

  const handleSignupFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userSignupRequestData.username.includes(" ")) {
      setAlertMessage("Username cannot contain spaces.");
      setIsSuccess(false);
      return;
    }
    if (userSignupRequestData.username.includes("@")) {
      setAlertMessage("Username cannot include an @");
      setIsSuccess(false);
      return;
    }
    if (userSignupRequestData.username.includes("^")) {
      setAlertMessage("Username cannot include an ^");
      setIsSuccess(false);
      return;
    }

    await createDocument("signup-requests", userSignupRequestData);
    setAlertMessage(
      "Signup successful! Check your parent email once you are approved!"
    );
    setIsSuccess(true);
    setUserSignupRequestData(defaultForm);
  };

  return (
    <Card className="w-full max-w-md min-h-[60vh]">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        {isSuccess === null ? (
          <form
            onSubmit={handleSignupFormSubmit}
            className="flex flex-col gap-y-4 pt-4 flex-grow"
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
                defaultValue="9"
              >
                <SelectTrigger id="gradeLevel">
                  <SelectValue placeholder="Select your grade level" />
                </SelectTrigger>

                <SelectContent>
                  {[...Array(13)].map((_, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      {index < 12
                        ? `${toOrdinal(index + 1)} grade`
                        : "College or higher"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={userSignupRequestData?.username}
                onChange={(e) =>
                  setUserSignupRequestData({
                    ...userSignupRequestData,
                    username: e.target.value,
                  })
                }
                type="text"
                placeholder="Enter a username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Parent's Email</Label>
              <Input
                id="email"
                value={userSignupRequestData?.parentEmail}
                onChange={(e) =>
                  setUserSignupRequestData({
                    ...userSignupRequestData,
                    parentEmail: e.target.value,
                  })
                }
                type="email"
                placeholder="Enter your parent's email"
                required
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label>Coding Experience</Label>

              <RadioGroup
                value={userSignupRequestData?.codingExperience}
                onValueChange={(
                  value: "beginner" | "intermediate" | "advanced"
                ) => {
                  setUserSignupRequestData({
                    ...userSignupRequestData,
                    codingExperience: value,
                  });
                }}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" required />
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

            <Button type="submit" className="w-full text-white">
              Sign Up
            </Button>
          </form>
        ) : (
          <div className="flex flex-col text-center flex-grow items-center justify-center gap-4">
            <h2 className="flex flex-col items-center mx-16">
              {isSuccess && (
                <div className="bg-green-500 rounded-full p-4 mb-4">
                  <CheckCircleIcon className="text-white" />
                </div>
              )}
              {alertMessage}
            </h2>
            <Button
              onClick={() => {
                setIsSuccess(null);
                setAlertMessage("");
              }}
              className="text-white"
            >
              {isSuccess ? "Go to Home" : "Try Again"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
