import { initAdmin } from "@/lib/firebase-admin/config";
import { User } from "@/lib/utils";
import { firestore, auth } from "firebase-admin";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



export async function POST(request: NextRequest) {
    await initAdmin();

    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json(
                { error: "Missing Firebase ID token" },
                { status: 400 }
            );
        }

        // Verify Firebase Auth ID token
        const decodedToken = await auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const db = firestore();

        const userDocRef = db.collection("users").doc(uid);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            const defaultUser: User = {
                uid,
                avatar: "/boy1",
                email: decodedToken.email || "",
                solvedChallenges: [],
                points: 0,
            };

            await userDocRef.set(defaultUser);
            return NextResponse.json(defaultUser, { status: 201 });
        } else {
            // User doc already exists, return existing data
            return NextResponse.json(userDoc.data(), { status: 200 });
        }
    } catch (error: any) {
        console.error("CreateUser error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
