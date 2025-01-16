"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import {
  CheckCircleIcon,
  PlayIcon,
  RefreshCcwDotIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Challenge,
  ChallengeTestCaseInput,
  loadCustomDarkEditorTheme,
} from "@/lib/utils";
import Navbar from "@/components/navbar/Navbar";
import { useFirestore } from "@/hooks/useFirestore";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ChallengeFailedTestCase {
  inputs: ChallengeTestCaseInput[];
  expectedOutput: string;
  recievedOutput: string;
}

interface ChallengeSubmissionResult {
  failedTestCase: ChallengeFailedTestCase | null;
  passedCases: number;
  totalCases: number;
}

export default function ChallengePage() {
  const params = useParams<{ challengeId: string }>();
  const { queryDocuments } = useFirestore();
  const { user } = useAuth();

  const [challengeData, setChallengeData] = useState<Challenge | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [codeSubmissionResult, setCodeSubmissionResult] =
    useState<ChallengeSubmissionResult | null>(null);

  const [isSolvedAlready, setIsSolvedAlready] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const attemptChallengeSolve = async () => {
    try {
      const userToken = await user?.getIdToken();

      const res = await axios.post(
        "/api/attemptChallengeSolve",
        {
          editorContent,
          challengeId: params.challengeId,
          userToken,
        },
        { withCredentials: true }
      );

      if (res.data.solvedAlready) {
        setIsSolvedAlready(true);
        setCodeSubmissionResult(null); // Clear any previous submission results
      } else {
        setIsSolvedAlready(false);
        setCodeSubmissionResult(res.data);
        setErrorMessage(""); // Clear any error messages
      }
    } catch (error: any) {
      console.error("Error while attempting to solve the challenge:", error);
      setErrorMessage(
        "An error occurred while submitting your code. Please try again."
      );
    }
  };

  const resetEditorContent = () => {
    setEditorContent("");
  };

  useEffect(() => {
    loadCustomDarkEditorTheme();
  }, []);

  useEffect(() => {
    const getChallengeData = async () => {
      const challengeDatas: Challenge[] = await queryDocuments<Challenge>(
        "challenges",
        "id",
        params.challengeId
      );

      const challengeData = challengeDatas[0];
      setChallengeData(challengeData);
      setEditorContent(
        `'''\n${challengeData.name}:\n${challengeData.description}\n'''\n`
      );
    };

    getChallengeData();
  }, []);

  return (
    <Navbar className="flex items-center justify-center mb-16">
      <div className="flex gap-y-4">
        <Card className="p-6 flex flex-wrap">
          <Editor
            height="70vh"
            width="50vw"
            defaultLanguage="python"
            theme="custom-light"
            value={editorContent}
            onChange={(value) => {
              setEditorContent(value || "");
            }}
          />
        </Card>
        <div className="flex flex-col pl-2 w-[20vw] gap-y-6">
          <Card className="relative h-full p-4">
            <CardTitle className="mb-2">{challengeData?.name}</CardTitle>

            {isSolvedAlready ? (
              <div className="flex flex-col h-full justify-center items-center pb-32">
                <div className="bg-gray-500 rounded-full p-4">
                  <RefreshCcwDotIcon className="text-white aspect-square" />
                </div>
                <span className="text-center mt-4">
                  You already solved this challenge. Good work!
                </span>
              </div>
            ) : errorMessage ? (
              <CardDescription className="text-red-500">
                {errorMessage}
              </CardDescription>
            ) : codeSubmissionResult !== null ? (
              codeSubmissionResult.failedTestCase !== null ? (
                <>
                  <CardDescription className="mb-4">
                    Try again! Your code caused{" "}
                    {codeSubmissionResult.totalCases -
                      codeSubmissionResult.passedCases}
                    /{codeSubmissionResult.totalCases} test cases to fail!
                    Details are below for one of them.
                  </CardDescription>
                  <CardContent className="space-y-4 text-sm p-0">
                    <div className="space-y-1">
                      <span>Input</span>
                      <pre className="rounded-sm p-2">
                        {codeSubmissionResult?.failedTestCase.inputs
                          .map(
                            (input, index) =>
                              `${input.name} = ${input.value}${
                                index <
                                codeSubmissionResult.failedTestCase!.inputs
                                  .length -
                                  1
                                  ? ", "
                                  : ";"
                              }`
                          )
                          .join("")}
                      </pre>
                    </div>
                    <div className="space-y-1">
                      <span>Received output</span>
                      <pre className="rounded-sm p-2">
                        {codeSubmissionResult?.failedTestCase.recievedOutput ||
                          "None"}
                      </pre>
                    </div>
                    <div className="space-y-1">
                      <span>Expected output</span>
                      <pre className="rounded-sm p-2">
                        {codeSubmissionResult?.failedTestCase.expectedOutput}
                      </pre>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex flex-col h-full justify-center items-center pb-32">
                  <div className="bg-green-500 rounded-full p-4">
                    <CheckCircleIcon className="text-white aspect-square" />
                  </div>
                  <span className="text-center mt-4">
                    Your code passed all test cases! Great job, +
                    <span className="text-green-600 underline">
                      {challengeData?.points}
                    </span>{" "}
                    points
                  </span>
                </div>
              )
            ) : (
              <CardDescription>
                Test your code against the test cases by pressing run. This is a{" "}
                {challengeData?.difficulty} challenge!
              </CardDescription>
            )}

            <div className="absolute bottom-2 left-0 right-0 flex flex-row justify-center gap-2">
              <Button
                className="w-fit self-center"
                onClick={attemptChallengeSolve}
              >
                <PlayIcon />
                Run
              </Button>

              <Button
                className="w-fit self-center"
                variant="secondary"
                onClick={resetEditorContent}
              >
                <RefreshCwIcon />
                Reset
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Navbar>
  );
}
