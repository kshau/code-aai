import { NextRequest, NextResponse } from "next/server";
import { ErrorTypes, isAdmin, validateChallengeData } from "@/lib/adminUtils";
import { initAdmin } from "@/lib/firebase-admin/config";
import { firestore } from "firebase-admin";

export async function POST(request: NextRequest) {
  try {
    await initAdmin();
    const Firestore = firestore();

    const body = await request.json();
    const { userToken, challengeData } = body;

    const isAdminUser = await isAdmin(userToken);

    if (!isAdminUser) {
      return NextResponse.json(ErrorTypes.UNAUTHORIZED, { status: 403 });
    }

    if (!validateChallengeData(challengeData)) {
      return NextResponse.json(ErrorTypes.INVALID_ARGUMENTS, { status: 400 });
    }

    await Firestore.collection("challenges").add(challengeData);

    return NextResponse.json({
      message: "Challenge created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "An error occurred while creating the challenge.",
      },
      { status: 500 }
    );
  }
}
