import { NextResponse } from "next/server";

export enum ErrorTypes {
  INVALID_ARGUMENTS,
  UNAUTHORIZED,
  CHALLENGE_NOT_FOUND,
  SOLVED_ALREADY,
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
    case ErrorTypes.SOLVED_ALREADY:
      return NextResponse.json(
        { solvedAlready: true, message: "You already solved this challenge!" },
        { status: 200 }
      );
  }
}
