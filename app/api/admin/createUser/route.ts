import { initAdmin } from "@/lib/firebase-admin/config";
import { User } from "@/lib/utils";
import { auth, firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  await initAdmin();
  const Auth = auth();
  const Firestore = firestore();

  try {
    const body = await request.json();
    const { username, parentEmail, codingExperience, gradeLevel} = body;
    console.log(username, parentEmail, codingExperience, gradeLevel)

    if (!username) {
      return NextResponse.json(
        {
          error: "Username is required",
        },
        { status: 400 }
      );
    }


    const userRecord = await Auth.createUser({
      email: `${username}@codeaai.org`,
      password: "secure123",
    });


    const userDoc : User = {
      uid: userRecord.uid,
      username: username,
      parentEmail: parentEmail,
      points:0,
      solves:0,
      codingExperience:codingExperience,
      gradeLevel:gradeLevel
    };

    await Firestore.collection("users").doc(userRecord.uid).set(userDoc);

    return NextResponse.json({
      message: "User created successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to create user",
      },
      { status: 500 }
    );
  }
}
