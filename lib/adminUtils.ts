import "server-only";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import axios from "axios";
import { auth } from "firebase-admin";
import { Challenge, ChallengeTestCase, ChallengeTestCases } from "./utils";

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
      html: text,
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
  }
}

const { RAPIDAPI_API_KEY } = process.env;

export async function runCode(code: string, args: any[]) {
  const res = await axios.post(
    "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
    {
      language: "python",
      stdin: args.join(" "),
      files: [
        {
          name: "index.py",
          content: code,
        },
      ],
    },
    {
      headers: {
        "x-rapidapi-key": RAPIDAPI_API_KEY,
        "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
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
      ADMIN_EMAILS.includes(adminUser.email)
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
