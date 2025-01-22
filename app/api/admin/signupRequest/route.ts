import { initAdmin } from "@/lib/firebase-admin/config";
import { CreateError, isAdmin, sendEmail } from "@/lib/adminUtils";
import { User, UserSignupRequestData } from "@/lib/utils";
import { auth, firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { ErrorTypes } from "@/lib/adminUtils";
import { randomBytes } from "crypto";

export async function DELETE(request: NextRequest) {
  await initAdmin();
  const Firestore = firestore();

  try {
    const body = await request.json();
    const { userToken, requestId, reason } = body;

    const isAdminUser = await isAdmin(userToken);
    if (!isAdminUser) {
      return CreateError(ErrorTypes.UNAUTHORIZED);
    }

    const signupRequestDoc = await Firestore.collection("signup-requests")
      .doc(requestId)
      .get();

    if (!signupRequestDoc.exists) {
      return CreateError(ErrorTypes.INVALID_ARGUMENTS);
    }

    const signupRequestData = signupRequestDoc.data() as UserSignupRequestData;
    const { parentEmail, username } = signupRequestData;

    await sendEmail(
      parentEmail,
      "Code AAI Account Activation - Signup Denied!",
      `
        Dear Parent or Guardian,<br/><br/>

        We are sorry to inform you that your account with username "${username}" is unable to be registered on Code AAI. This is due to the following reason:<br/><br/>
        ${reason}

        <br/>
        Feel free to sign up again after resolving the issue above. 
            <br/>
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

export async function POST(request: NextRequest) {
  await initAdmin();
  const Auth = auth();
  const Firestore = firestore();

  try {
    const body = await request.json();
    const { userToken, requestId } = body;

    const signupRequestDoc = await Firestore.collection("signup-requests")
      .doc(requestId)
      .get();

    if (!signupRequestDoc.exists) {
      return CreateError(ErrorTypes.INVALID_ARGUMENTS);
    }

    const signupRequestData = signupRequestDoc.data() as UserSignupRequestData;
    const { parentEmail, username, codingExperience, gradeLevel } =
      signupRequestData;

    const isAdminUser = await isAdmin(userToken);
    if (!isAdminUser) {
      return CreateError(ErrorTypes.UNAUTHORIZED);
    }

    if (!username) {
      return CreateError(ErrorTypes.INVALID_ARGUMENTS);
    }

    const randomPassword = randomBytes(16).toString("hex"); // 16 bytes = 32 hex characters

    const userRecord = await Auth.createUser({
      email: `${username}@codeaai.org`,
      password: randomPassword,
    });

    const resetLink = await Auth.generatePasswordResetLink(
      `${username}@codeaai.org`
    );
    await sendEmail(
      parentEmail,
      "Code AAI Account Activation - Signup Successful!",
      `
        Dear Parent or Guardian,<br/><br/>
    
        We are pleased to inform you that your child, with the username "${username}", has been successfully approved to use Code AAI!${" "}
        To complete the registration process and set up your child's account, please click <a href="${resetLink}">this link</a> to create a secure password for their account${" "}
        Once the password is set, your child will be able to log in and begin using the platform. You can access the official Code AAI website here: <a href="https://codeaai.org">CodeAAI.org</a>.${" "}
        If you have any questions or need assistance, please don't hesitate to contact us.<br/><br/>
    
        Best regards, <br/>
        The Code AAI Team
      `
    );

    const userDoc: User = {
      uid: userRecord.uid,
      avatar: "boy1",
      username: username,
      parentEmail: parentEmail,
      points: 0,
      solvedChallenges: [],
      codingExperience: codingExperience,
      gradeLevel: gradeLevel,
    };
    await Firestore.collection("users").doc(userRecord.uid).set(userDoc);
    await Firestore.collection("signup-requests").doc(requestId).delete();

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
