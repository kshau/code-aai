import { initAdmin } from "@/lib/firebase-admin/config";
import { sendEmail } from "@/lib/sendEmail";
import { UserSignupRequestData } from "@/lib/utils";
import { auth, firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { ErrorTypes } from "@/lib/errors";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",")
  : [];

export async function POST(request: NextRequest) {
  await initAdmin();
  const Auth = auth();
  const Firestore = firestore();

  try {
    const body = await request.json();
    const { userToken, requestId, reason } = body;

    // Validate token and admin user
    const adminUser = await Auth.verifyIdToken(userToken);
    if (
      !adminUser ||
      !adminUser.email ||
      !ADMIN_EMAILS.includes(adminUser.email)
    ) {
      return NextResponse.json(ErrorTypes.UNAUTHORIZED);
    }

    const signupRequestDoc = await Firestore.collection("signup-requests")
      .doc(requestId)
      .get();

    if (!signupRequestDoc.exists) {
      return NextResponse.json(
        { error: "Signup request not found" },
        { status: 404 }
      );
    }

    const signupRequestData = signupRequestDoc.data() as UserSignupRequestData;
    const { parentEmail, username } = signupRequestData;

    await sendEmail(
      parentEmail,
      "Code AAI Account Activation - Signup Denied!",
      `
        Dear Parent or Guardian,<br/><br/>

        We are sorry to inform you that your account with username ${username} is unable to be registered on Code AAI. This is due to the following reason:<br/><br/>
        ${reason}

        <br/>
        Feel free to sign up again after resolving the issue above. 
        <br/>
        Best regards, <br/>
        The Code AAI Team
      `
    );

    await Firestore.collection("signup-requests").doc(requestId).delete();

    return NextResponse.json({
      message: "Signup request processed successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: "Failed to process the request",
      },
      { status: 500 }
    );
  }
}
