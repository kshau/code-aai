import { initAdmin } from "@/lib/firebase-admin/config";
import { sendEmail } from "@/lib/sendEmail";
import { User } from "@/lib/utils";
import { auth, firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",")
  : [];

export async function POST(request: NextRequest) {
  await initAdmin();
  const Auth = auth();
  const Firestore = firestore();

  try {
    const body = await request.json();
    const { userToken, username, parentEmail, codingExperience, gradeLevel } =
      body;

    // const adminUser = await Auth.verifyIdToken(userToken);
    // if(!adminUser || !adminUser.email || !ADMIN_EMAILS.includes(adminUser.email)){
    //   return NextResponse.json(Errors.UNAUTHORIZED);
    // }

    if (!username) {
      return NextResponse.json(
        {
          error: "Username is required",
        },
        { status: 400 }
      );
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
      "Code AAI Account Activation: Successful Signup!",
      `
        Dear Parent/Guardian,\n
    
        We are pleased to inform you that your child, with the username "${username}", has been successfully approved to use Code AAI!\n
    
        To complete the registration process and set up your child's account, please follow the link below to create a secure password for their account:
    
        <a href="${resetLink}">Set Account Password</a>\n
    
        Once the password is set, your child will be able to log in and begin using the platform. You can access the official Code AAI website here: 
        <a href="https://codeaai.org">https://codeaai.org</a>.\n
    
        If you have any questions or need assistance, please do not hesitate to contact us.\n
    
        Best regards,  
        The Code AAI Team
      `
    );

    const userDoc: User = {
      uid: userRecord.uid,
      avatar: "boy1",
      username: username,
      parentEmail: parentEmail,
      points: 0,
      solvedChallengeIds: [],
      codingExperience: codingExperience,
      gradeLevel: gradeLevel,
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
