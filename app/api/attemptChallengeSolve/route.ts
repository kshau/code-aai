import { CreateError, ErrorTypes, runCode } from "@/lib/adminUtils";
import { initAdmin } from "@/lib/firebase-admin/config";
import { challengeSubmitRateLimit } from "@/lib/rateLimiter";
import { Challenge, SupportedProgrammingLanguage, User } from "@/lib/utils";
import { auth, firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

interface AttemptChallengeData {
  editorContent: string;
  challengeId: string;
  userToken: string;
  language: SupportedProgrammingLanguage;
}

export async function POST(request: NextRequest) {

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const isRateLimited = await challengeSubmitRateLimit.consume(ip);

  if (isRateLimited.remainingPoints <= 0) {
    return NextResponse.json({ error: "Too many requests", left: isRateLimited.msBeforeNext }, { status: 429 });
  }

  await initAdmin();
  const Auth = auth();
  const Firestore = firestore();

  const { editorContent, challengeId, userToken, language }: AttemptChallengeData =
    await request.json();

  // Verify the user
  const user = await Auth.verifyIdToken(userToken);
  if (!user || !user.email) {
    return CreateError(ErrorTypes.UNAUTHORIZED);
  }

  if (!user.email_verified) {
    return CreateError(ErrorTypes.EMAIL_NOT_VERIFIED);
  }

  const usersData = await Firestore.collection("users")
    .where("uid", "==", user.uid)
    .get();

  if (!usersData.docs[0]) {
    return CreateError(ErrorTypes.UNAUTHORIZED);
  }
  const userData: User = usersData.docs[0].data() as User;
  const userDoc = usersData.docs[0];

  // Fetch the challenge data
  const challenges = await Firestore.collection("challenges")
    .where("id", "==", challengeId)
    .get();

  if (!challenges.docs[0]) {
    return CreateError(ErrorTypes.CHALLENGE_NOT_FOUND);
  }

  const challengeData: Challenge = challenges.docs[0].data() as Challenge;

  const testCasesDoc = await Firestore.collection("challenge-testcases")
    .doc(challengeData.id)
    .get();

  if (!testCasesDoc.exists) {
    return CreateError(ErrorTypes.INVALID_ARGUMENTS);
  }

  const testCases = testCasesDoc.data()?.testCases || [];
  let pass = 0;
  let failedTestCase: any = null;

  // Check if the challenge is already solved
  if (
    userData.solvedChallenges.some(
      (challenge) => challenge.id === challengeData.id
    )
  ) {
    return CreateError(ErrorTypes.SOLVED_ALREADY);
  }

  try {
    // Process and validate test cases
    await Promise.all(
      testCases.map(async (testCase: any) => {
        const args: any[] = [];
        const inputs: any[] = [];

        testCase.inputs.forEach((input: any) => {
          args.push(input.value);
          inputs.push({ name: input.name, value: input.value });
        });

        const result = await runCode(editorContent, args, language);
        const output = result.run.stdout || result.run.stderr;

        if (output.trim() === testCase.expectedOutput.trim()) {
          pass += 1;
        } else if (!failedTestCase) {
          failedTestCase = {
            inputs: inputs,
            expectedOutput: testCase.expectedOutput,
            recievedOutput: output,
          };
        }
      })
    );



    if (pass === testCases.length) {
      await userDoc.ref.update({
        points: userData.points + challengeData.points,
        solvedChallenges: [
          ...userData.solvedChallenges,
          {
            id: challengeData.id,
            timestamp: new Date().toDateString(),
            points: challengeData.points,
          },
        ],
      });
    }

    // Return results
    return NextResponse.json(
      {
        failedTestCase: failedTestCase,
        passedCases: pass,
        totalCases: testCases.length,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.status }
    );
  }
}
