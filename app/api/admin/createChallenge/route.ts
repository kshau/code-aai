import { NextRequest, NextResponse } from "next/server";
import {
  CreateError,
  ErrorTypes,
  isAdmin,
  validateChallengeData,
  validateTestCases,
} from "@/lib/adminUtils";
import { initAdmin } from "@/lib/firebase-admin/config";
import { firestore } from "firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Initialize Firebase Admin
    await initAdmin();
    const Firestore = firestore();

    // Parse the request body
    const body = await request.json();
    const { userToken, challengeData } = body;

    // Validate if the user is an admin
    const isAdminUser = await isAdmin(userToken);

    if (!isAdminUser) {
      return CreateError(ErrorTypes.UNAUTHORIZED);
    }

    if (!validateChallengeData(challengeData)) {
      return CreateError(ErrorTypes.INVALID_ARGUMENTS);
    }

    if (!validateTestCases(challengeData)) {
      return CreateError(ErrorTypes.INVALID_ARGUMENTS);
    }

    const { testCases, ...challengeWithoutTestCases } = challengeData;
    await Firestore.collection("challenges")
      .doc(challengeData.id)
      .set(challengeWithoutTestCases);

    if (testCases) {
      await Firestore.collection("challenge-testcases")
        .doc(challengeData.id)
        .set({ testCases });
    }

    return NextResponse.json({
      message: "Challenge created successfully",
    });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      {
        message: "An error occurred while creating the challenge.",
      },
      { status: 500 }
    );
  }
}
