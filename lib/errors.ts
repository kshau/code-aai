import { NextResponse } from "next/server";

export enum ErrorTypes {
  INVALID_ARGUMENTS,
  UNAUTHORIZED,
  CHALLENGE_NOT_FOUND,
}

export function CreateError(error: ErrorTypes) {
  console.log(`Error: ${error.toString}`);
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
  }
}
