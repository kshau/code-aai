import { initAdmin } from "@/lib/firebase-admin/config";
import { auth } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

// Utility function to generate a random password
function generateRandomPassword(length: number = 12): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

export async function POST(request: NextRequest) {
  await initAdmin();
  const fAuth = auth();

  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        {
          error: "Username is required",
        },
        { status: 400 }
      );
    }

    const randomPassword = generateRandomPassword();
    console.log(randomPassword)

    const userRecord = await fAuth.createUser({
      email:`${username}@codeaai.org`,
      password: randomPassword,
    });

    return NextResponse.json({
      message: "User created successfully",
      user: userRecord,
      password: randomPassword,
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
