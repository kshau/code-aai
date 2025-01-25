import { loader } from "@monaco-editor/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type UserCodingExperience = "beginner" | "intermediate" | "advanced";

export interface User {
  uid: string;
  avatar: string;
  username: string;
  gradeLevel: number;
  parentEmail: string;
  solvedChallenges: SolvedChallenge[];
  points: number;
  codingExperience: UserCodingExperience;
}

export interface SolvedChallenge {
  id: string;
  timestamp: string;
  points: number;
}

export interface UserSignupRequestData {
  username: string;
  gradeLevel: number;
  parentEmail: string;
  codingExperience: UserCodingExperience;
}

export type ChallengeDifficulty = "easy" | "medium" | "hard";

export interface Challenge {
  id: string;
  name: string;
  description: string;
  difficulty: ChallengeDifficulty;
  points: number;
}

export interface ChallengeTestCases {
  testCases: ChallengeTestCase[];
}

export interface ChallengeTestCase {
  inputs: ChallengeTestCaseInput[];
  expectedOutput: string;
}

export interface ChallengeTestCaseInput {
  name: string;
  type: "string" | "int" | "float" | "boolean";
  value: any;
}

export function formatChallengeTestCaseInputName(inputName: string) {
  let newInputName = inputName.replace(/[^a-zA-Z0-9_]/g, "_");

  // Ensure the first character is not a number
  if (/^\d/.test(newInputName)) {
    newInputName = "_" + newInputName;
  }

  return newInputName.toLowerCase();
}

export function capitalizeFirstLetter(str: string) {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

export function loadCustomDarkEditorTheme() {
  loader.init().then((monaco) => {
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#020817",
      },
    });
  });
}

export function toOrdinal(num: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function isSameDay(timestamp1: number, timestamp2: string) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export interface UserSignupRequestDataDocument extends UserSignupRequestData {
  id: string;
}

export function removeJSONCodeBlockMarkers(str: string) {
  // Trim the string to remove any leading/trailing whitespace or newlines
  const trimmed = str.trim();
  
  // Check and remove markers if present
  if (trimmed.startsWith("```json") && trimmed.endsWith("```")) {
    return trimmed.slice(7, -3).trim();
  }
  return str;
}

export type SupportedProgrammingLanguage = "python" | "java" | "c";