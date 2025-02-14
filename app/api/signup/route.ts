import { initAdmin } from "@/lib/firebase-admin/config";
import { CreateError, verifyRecaptcha } from "@/lib/adminUtils";
import { UserSignupRequestData } from "@/lib/utils";
import { firestore } from "firebase-admin";
import { NextResponse } from "next/server";
import { ErrorTypes } from "@/lib/adminUtils";
import { signupRateLimiter } from "@/lib/rateLimiter"; // Rate limit function
import type { NextRequest } from 'next/server'


export async function POST(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const isRateLimited = await signupRateLimiter.consume(ip);

    if (isRateLimited.remainingPoints <= 0) {
        return NextResponse.json({ error: "Too many requests", left: isRateLimited.msBeforeNext }, { status: 429 });
    }

    await initAdmin();
    const Firestore = firestore();

    try {
        const { parentEmail, username, codingExperience, gradeLevel, recaptchaToken } = await request.json();

        if (!parentEmail || !username || !codingExperience || !gradeLevel || !recaptchaToken) {
            return CreateError(ErrorTypes.INVALID_ARGUMENTS);
        }

        // Verify reCAPTCHA token
        const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
        if (!isValidRecaptcha) {
            return NextResponse.json({ message: "reCAPTCHA verification failed" }, { status: 400 });
        }

        const signupData: UserSignupRequestData = {
            parentEmail,
            username,
            codingExperience,
            gradeLevel,
        };

        await Firestore.collection("signup-requests").add(signupData);

        return NextResponse.json({
            message: "Signed up successfully",
        });
    } catch (err) {
        console.error("Signup error:", err);
        return NextResponse.json(
            { message: "Signup failed" },
            { status: 500 }
        );
    }
}
