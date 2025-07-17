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
  email: string;
  solvedChallenges: SolvedChallenge[];
  points: number;
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
  input: ChallengeTestCaseType[]
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

export interface ChallengeTestCaseType {
  name: string;
  type: "string" | "int" | "float" | "boolean";
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
export function generatePythonInputCode(inputs: { name: string; type: string }[]) {
  // If no inputs, no code needed
  if (!inputs.length) return "";

  // Create code that reads one input line and splits it
  // Then assign variables with proper type casting
  const varAssignments = inputs.map(({ name, type }, i) => {
    let cast = "";
    switch (type.toLowerCase()) {
      case "int":
        cast = "int";
        break;
      case "float":
        cast = "float";
        break;
      case "string":
      case "str":
        cast = ""; // strings don't need cast
        break;
      default:
        cast = ""; // fallback no cast
    }

    return cast
      ? `${name} = ${cast}(inputs[${i}])`
      : `${name} = inputs[${i}]`;
  });

  return `
inputs = input().split()
${varAssignments.join("\n")}
`.trim();
}

export function generateCInputCode(inputs: { name: string; type: string }[]) {
  if (!inputs.length) return "";

  // Create declarations for variables
  const declarations = inputs.map(({ name, type }) => {
    switch (type.toLowerCase()) {
      case "int":
        return `int ${name};`;
      case "float":
        return `float ${name};`;
      case "string":
      case "str":
        return `char ${name}[100];`; // assuming max length 100 for strings
      default:
        return `char ${name}[100];`;
    }
  });

  // Create scanf format string and args
  let formatString = "";
  let argsList = "";
  inputs.forEach(({ name, type }) => {
    switch (type.toLowerCase()) {
      case "int":
        formatString += "%d ";
        argsList += `&${name}, `;
        break;
      case "float":
        formatString += "%f ";
        argsList += `&${name}, `;
        break;
      case "string":
      case "str":
        formatString += "%s ";
        argsList += `${name}, `;
        break;
      default:
        formatString += "%s ";
        argsList += `${name}, `;
    }
  });

  // Remove trailing space in formatString and comma in argsList
  formatString = formatString.trim();
  argsList = argsList.replace(/, $/, "");

  return `
${declarations.join("\n")}

scanf("${formatString}", ${argsList});
`.trim();
}

export function generateJavaInputCode(inputs: { name: string; type: string }[]) {
  if (!inputs.length) return "";

  const varAssignments = inputs.map(({ name, type }, i) => {
    let parser = "";
    let javaType = "";
    switch (type.toLowerCase()) {
      case "int":
        parser = "Integer.parseInt";
        javaType = "int";
        break;
      case "float":
        parser = "Float.parseFloat";
        javaType = "float";
        break;
      case "string":
      case "str":
        parser = "";
        javaType = "String";
        break;
      default:
        parser = "";
        javaType = "String";
    }

    return parser
      ? `${javaType} ${name} = ${parser}(inputs[${i}]);`
      : `${javaType} ${name} = inputs[${i}];`;
  });

  return `
String[] inputs = inputLine.split(" ");
${varAssignments.join("\n")}
`.trim();
}
