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
import { UserSignupRequestData } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";
import { useReCaptcha } from "next-recaptcha-v3";
import Link from "next/link";

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
  const { executeRecaptcha } = useReCaptcha();

  const handleSignupFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = await executeRecaptcha("form_submit");

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

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userSignupRequestData,
          recaptchaToken: token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed.");
      }

      setAlertMessage(
        "Signup successful! Check your parent email once you are approved!"
      );
      setIsSuccess(true);
      setUserSignupRequestData(defaultForm);
    } catch (error: any) {
      setAlertMessage(error.message || "An error occurred. Please try again.");
      setIsSuccess(false);
    }
  };

  return (
    <Card className="w-full max-w-md min-h-[60vh]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
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
                  {["9", "10", "11", "12"].map((position) => (
                    <SelectItem key={position} value={(position).toString()}>
                      {position}th Grade
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
              <Label>Parent Email</Label>
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
            <p className="text-muted-foreground text-center text-[10px]">
              By signing up, you agree to CodeAAI&apos;s <Link href="/privacy-policy" className="underline">privacy policy</Link> and <Link href="/terms" className="underline">terms of use</Link>
            </p>
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