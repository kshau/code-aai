import { loader } from "@monaco-editor/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export interface User {
	uid: string;
	username: string;
	gradeLevel: number;
	parentEmail: string;
	solves:number;
	points:number;
	codingExperience: "beginner" | "intermediate" | "advanced";
}


export interface UserSignupRequestData {
	name: string;
	gradeLevel: number;
	email: string;
	codingExperience: "beginner" | "intermediate" | "advanced";
}


export interface Challenge {
	id: string | null;
	title: string;
	description: string;
	difficulty: "easy" | "medium" | "hard";
	testCases: ChallengeTestCase[];
	solved:boolean;
	points:number;
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

export interface LeaderboardUser {
	name: string;
	solves: number;
	points: number;
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

export function toOrdinal(num:number) {
	const s = ["th", "st", "nd", "rd"];
	const v = num % 100;
	return num + (s[(v - 20) % 10] || s[v] || s[0]);
}
