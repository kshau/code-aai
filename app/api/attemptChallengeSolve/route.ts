import { CreateError, ErrorTypes } from "@/lib/errors";
import { initAdmin } from "@/lib/firebase-admin/config";
import { runCode } from "@/lib/runCode";
import { Challenge } from "@/lib/utils";
import exp from "constants";
import { auth, firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

interface attemptChallengeData {
  editorContent: string;
  challengeId: string;
  userToken: string;
}

export async function POST(request: NextRequest) {
  await initAdmin();
  const Auth = auth();
  const Firestore = firestore();

  const { editorContent, challengeId, userToken }: attemptChallengeData =
    await request.json();

  const user = await Auth.verifyIdToken(userToken);
  if (!user || !user.email) {
    return CreateError(ErrorTypes.UNAUTHORIZED);
  }

  const challenges = await Firestore.collection("challenges")
    .where("id", "==", challengeId)
    .get();

  if (!challenges.docs[0]) {
    return CreateError(ErrorTypes.CHALLENGE_NOT_FOUND);
  }

  const challenge: Challenge = challenges.docs[0].data() as Challenge;
  let pass = 0;
  let failedTestCase: any = null;

  try {
    await Promise.all(
      challenge.testCases.map(async (testCase, index) => {
        let args: any[] = [];
        let inputs: any[] = [];

        testCase.inputs.forEach((input) => {
          args.push(input.value);
          inputs.push({ name: input.name, value: input.value });
        });

        const result = await runCode(editorContent, args);

        if (result.stdout === testCase.expectedOutput) {
          pass += 1;
        } else if (!failedTestCase) {
          failedTestCase = {
            inputs: inputs,
            expectedOutput: testCase.expectedOutput,
            recievedOutput: result.stdout, // Fix typo from 'stddout' to 'stdout'
          };
        }
      })
    );

    return NextResponse.json(
      {
        failedTestCase: failedTestCase,
        passedCases: pass,
        totalCases: challenge.testCases.length,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
}
