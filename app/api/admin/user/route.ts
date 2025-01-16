import { initAdmin } from "@/lib/firebase-admin/config";
import { CreateError, isAdmin, sendEmail } from "@/lib/adminUtils";
import { auth, firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { ErrorTypes } from "@/lib/adminUtils";
import { User } from "@/lib/utils";

export async function DELETE(request: NextRequest) {
  await initAdmin();
  const Firestore = firestore();
  const Auth = auth();

  try {
    const body = await request.json();
    const { userToken, userUid, reason } = body;

    const isAdminUser = await isAdmin(userToken);
    if (!isAdminUser) {
      return CreateError(ErrorTypes.UNAUTHORIZED);
    }

    const doc = Firestore.collection("users").doc(userUid);
    const dataDoc = await doc.get();
    const userData = dataDoc.data() as User;

    await sendEmail(
      userData.parentEmail,
      "Code AAI Account Deleteion!",
      `
            Dear Parent or Guardian,<br/><br/>
    
            We are sorry to inform you that your account with username ${userData.username} has been deleted on CodeAAI. This is due to the following reason:<br/><br/>
            ${reason}
            <br/>
            <br/>
            Feel free to sign up again after resolving the issue above. 
            <br/>
            Best regards, <br/>
            The Code AAI Team
          `
    );

    doc.delete();
    Auth.deleteUser(userUid);

    return NextResponse.json({
      success: true,
      message: `User ${userUid} deleted.`,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({
      success: false,
      message: `Could not delete User`,
    });
  }
}
