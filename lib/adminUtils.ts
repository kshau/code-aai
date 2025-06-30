import "server-only";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import axios from "axios";
import { auth } from "firebase-admin";
import {
  Challenge,
  ChallengeTestCase,
  ChallengeTestCases,
  SupportedProgrammingLanguage,
} from "./utils";

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_EMAIL,
        pass: process.env.NODE_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODE_EMAIL,
      to,
      subject,
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="padding: 20px; text-align: center; border-bottom: 1px solid #ddd;">
          <img src="https://codeaai.org/logo.svg" alt="Welcome" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px 8px 0 0; display: block;">
          <h1 style="color: #333; margin: 0;">CodeAAI</h1>
        </div>
        <div style="padding: 20px;">
          ${text}
        </div>
      </div>
    </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",")
  : [];

export enum ErrorTypes {
  INVALID_ARGUMENTS,
  UNAUTHORIZED,
  CHALLENGE_NOT_FOUND,
  SOLVED_ALREADY,
  EMAIL_NOT_VERIFIED
}

export function CreateError(error: ErrorTypes) {
  console.log(`Error: ${error.valueOf()}`);
  switch (error) {
    case ErrorTypes.INVALID_ARGUMENTS:
      return NextResponse.json(
        { message: "Invalid Arguments" },
        { status: 400 }
      );
    case ErrorTypes.CHALLENGE_NOT_FOUND:
      return NextResponse.json(
        { message: "Challenge does not exist?" },
        { status: 400 }
      );
    case ErrorTypes.UNAUTHORIZED:
      return NextResponse.json(
        { message: "You are not allowed to preform this action" },
        { status: 401 }
      );
    case ErrorTypes.SOLVED_ALREADY:
      return NextResponse.json(
        { solvedAlready: true, message: "You already solved this challenge!" },
        { status: 200 }
      );
    case ErrorTypes.EMAIL_NOT_VERIFIED:
      return NextResponse.json(
        { solvedAlready: true, message: "Your email is not verified!" },
        { status: 400 }
      );
  }
}

export async function runCode(
  code: string,
  args: any[],
  language: SupportedProgrammingLanguage
) {
  let extension;
  let version;
  switch (language) {
    case "python":
      extension = "py";
      version = "3.10";
      break;
    case "c":
      extension = "c";
      version = "10.2.0";
      break;
    case "java":
      extension = "java";
      version = "15.0.2";
      break;
  }

  const res = await axios.post(
    "https://emkc.org/api/v2/piston/execute",
    {
      language,
      version,
      stdin: args.join(" "),
      files: [
        {
          name: `index.${extension}`,
          content: code,
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}

export async function isAdmin(userToken: any) {
  const Auth = auth();

  try {
    const adminUser = await Auth.verifyIdToken(userToken);

    if (
      adminUser &&
      adminUser.email &&
      ["keshavrshah@gmail.com", "kshaurya731@gmail.com", "srithansh@gmail.com"].includes(adminUser.email)
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function validateChallengeData(data: any): data is Challenge {
  return (
    typeof data.id === "string" &&
    typeof data.name === "string" &&
    typeof data.description === "string" &&
    ["easy", "medium", "hard"].includes(data.difficulty) &&
    typeof data.points === "number"
  );
}

export function validateTestCases(
  data: any
): data is Omit<ChallengeTestCases, "id"> {
  return (
    Array.isArray(data.testCases) &&
    data.testCases.every(
      (testCase: ChallengeTestCase) =>
        Array.isArray(testCase.inputs) && testCase.expectedOutput !== undefined
    )
  );
}

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY!,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}
