import { CreateError, ErrorTypes } from "@/lib/errors";
import { initAdmin } from "@/lib/firebase-admin/config";
import { runCode } from "@/lib/runCode";
import { Challenge, User } from "@/lib/utils";
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

  const userDatas = await Firestore.collection("users")
    .where("uid", "==", user.uid)
    .get();

  if (!userDatas.docs[0]) {
    return CreateError(ErrorTypes.UNAUTHORIZED);
  }
  const userData: User = userDatas.docs[0].data() as User;
  const userDoc = userDatas.docs[0];

  const challenges = await Firestore.collection("challenges")
    .where("id", "==", challengeId)
    .get();

  if (!challenges.docs[0]) {
    return CreateError(ErrorTypes.CHALLENGE_NOT_FOUND);
  }

  const challengeData: Challenge = challenges.docs[0].data() as Challenge;
  let pass = 0;
  let failedTestCase: any = null;

  if (userData.solvedChallengeIds.includes(challengeData.id)) {
    return CreateError(ErrorTypes.SOLVED_ALREADY);
  }

  try {
    await Promise.all(
      challengeData.testCases.map(async (testCase, index) => {
        let args: any[] = [];
        let inputs: any[] = [];

        testCase.inputs.forEach((input) => {
          args.push(input.value);
          inputs.push({ name: input.name, value: input.value });
        });

        const result = await runCode(editorContent, args);
        if (result.stdout === testCase.expectedOutput.toString().trim()) {
          pass += 1;
        } else if (!failedTestCase) {
          failedTestCase = {
            inputs: inputs,
            expectedOutput: testCase.expectedOutput,
            recievedOutput: result.stdout,
          };
        }
      })
    );

    if (pass === challengeData.testCases.length) {
      await userDoc.ref.update({
        points: userData.points + challengeData.points,
        solvedChallengeIds: [...userData.solvedChallengeIds, challengeData.id],
      });
    }

    return NextResponse.json(
      {
        failedTestCase: failedTestCase,
        passedCases: pass,
        totalCases: challengeData.testCases.length,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
}
