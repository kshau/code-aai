"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Editor, { loader } from "@monaco-editor/react";
import { PlayIcon, RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { ChallengeTestCaseInput, loadCustomDarkEditorTheme } from "@/lib/utils";
import Navbar from "@/components/navbar";

interface ChallengeFailedTestCase {
  inputs: ChallengeTestCaseInput[];
  expectedOutput: string;
  recievedOutput: string;
}

export default function Challenge({
  params,
}: {
  params: { challengeId: string };
}) {
  const searchParams = useSearchParams();

  const [editorContent, setEditorContent] = useState("");
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [codeProducedError, setCodeProducedError] = useState<boolean>(false);
  const [codeFailedTestCase, setCodeFailedTestCase] =
    useState<ChallengeFailedTestCase | null>(null);

  const [challengeSolved, setChallengeSolved] = useState<boolean>(false);

  const attemptChallengeSolve = async () => {
    const res = await axios.post(
      "/api/attemptChallengeSolve",
      {
        editorContent,
        challengeId: params.challengeId,
      },
      { withCredentials: true }
    );

    setCodeOutput(res.data.codeOutput);
    setCodeProducedError(res.data.producedError);
    setCodeFailedTestCase(res.data.failedTestCase);
  };

  const resetEditorContent = () => {
    setEditorContent("");
    setCodeOutput(null);
    setCodeProducedError(false);
  };

  useEffect(() => {
    loadCustomDarkEditorTheme();
  }, []);

  return (
    <Navbar>
      <div className="w-screen flex justify-center mt-12">
        <div className="flex gap-y-4">
          <Card className="p-6 flex flex-wrap">
            <Editor
              height="70vh"
              width="30vw"
              defaultLanguage="python"
              theme="custom-light"
              value={editorContent}
              onChange={(value) => {
                setEditorContent(value || "");
              }}
            />
          </Card>
          <div className="flex flex-col pl-6 w-[15vw] gap-y-6">
            {codeFailedTestCase && (
              <Card className="h-full border-none mt-4">
                <CardHeader className="p-0 mb-4">
                  <CardTitle>Failed Test Case</CardTitle>
                  <CardDescription>
                    Your code caused one or more test cases to fail! Details are
                    below for one of them.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm p-0">
                  <div className="space-y-1">
                    <span>Input</span>
                    <pre className="bg-neutral-800 rounded-sm p-2">
                      {codeFailedTestCase.inputs.map(
                        (input, index) =>
                          `${input.name} = ${input.value} ${
                            index > codeFailedTestCase.inputs.length + 1
                              ? ","
                              : ""
                          }`
                      )}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <span>Recieved output</span>
                    <pre className="bg-neutral-800 rounded-sm p-2">
                      {codeFailedTestCase.recievedOutput}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <span>Expected output</span>
                    <pre className="bg-neutral-800 rounded-sm p-2">
                      {codeFailedTestCase.expectedOutput}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="relative h-full p-4">
              <pre className={`${codeProducedError && "text-red-600"} h-full`}>
                {codeOutput || (
                  <span className="italic text-gray-400">
                    Output will appear here
                  </span>
                )}
              </pre>
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
      </div>
    </Navbar>
  );
}
