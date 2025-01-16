import { NextRequest, NextResponse } from "next/server";
import { CreateError, ErrorTypes, isAdmin } from "@/lib/adminUtils";
import { initAdmin } from "@/lib/firebase-admin/config";
import { firestore } from "firebase-admin";
import { UserSignupRequestDataDocument } from "@/lib/utils";

const challengeTemplate = `{
    "name": "Example Challenge",
    "description": "This is an example challenge description.",
    "difficulty": "medium",
    "solved": false,
    "points": 100,
    "testCases": [
      {
        "inputs": [
          { "name": "arg1", "type": "int", "value": 10 },
          { "name": "arg2", "type": "int", "value": 20 }
        ],
        "expectedOutput": "30"
      },
      {
        "inputs": [
          { "name": "arg1", "type": "int", "value": 40 },
          { "name": "arg2", "type": "int", "value": 50 }
        ],
        "expectedOutput": "90"
      }
    ]
  }`;

export async function POST(request: NextRequest) {
  await initAdmin();
  const Firestore = firestore();

  try {
    const body = await request.json();
    const { userToken } = body;
    const isAdminUser = await isAdmin(userToken);

    if (!isAdminUser) {
      return NextResponse.json(ErrorTypes.UNAUTHORIZED);
    }
    const snapshot = await Firestore.collection("signup-requests").get();
    const signupRequests = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id || "N/A",
    })) as UserSignupRequestDataDocument[];

    return NextResponse.json({
      challengeTemplate,
      signupRequests,
    });
  } catch {
    return CreateError(ErrorTypes.INVALID_ARGUMENTS);
  }
}
