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

const defaultForm: UserSignupRequestData = {
  username: "",
  gradeLevel: 9,
  parentEmail: "",
  codingExperience: "beginner",
};

export default function SignupForm() {
  const [userSignupRequestData, setUserSignupRequestData] =
    useState<UserSignupRequestData>(defaultForm);
  const [alertMessage, setAlertMessage] = useState("");
  const { createDocument } = useFirestore();

  const handleSignupFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userSignupRequestData.username.includes(" ")) {
      setAlertMessage("Username cannot contain spaces.");
      return;
    }
    if (userSignupRequestData.username.includes("@")) {
      setAlertMessage("Username cannot include an @");
      return;
    }
    if (userSignupRequestData.username.includes("^")) {
      setAlertMessage("Username cannot include an ^");
      return;
    }

    await createDocument("signup-requests", userSignupRequestData);

    setAlertMessage(
      "Signup successful! Check your parent email once you are approved in!"
    );
    setUserSignupRequestData(defaultForm);
  };

  return (
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
              defaultValue="9"
            >
              <SelectTrigger id="gradeLevel">
                <SelectValue placeholder="Select your grade level" />
              </SelectTrigger>

              <SelectContent>
                {[...Array(13)].map((gradeLevel, index) => (
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
              placeholder="Enter your parent email"
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

          <Button type="submit" className="w-full mb-2">
            Sign Up
          </Button>
        </form>
        <span className="h-4 mt-4 w-full flex justify-center items-center  text-sm font-semibold mb-2">
          {alertMessage}
        </span>
      </CardContent>
    </Card>
  );
}
