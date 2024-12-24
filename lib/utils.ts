import { loader } from "@monaco-editor/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export interface UserSignupRequestData {
	id?: string;
	name: string;
	gradeLevel: number | null;
	email: string;
	codingExperience: "beginner" | "intermediate" | "advanced";
}

export interface Challenge {
	id: string | null;
	title: string;
	description: string;
	difficulty: "easy" | "medium" | "hard";
	testCases: ChallengeTestCase[];
}

export interface ChallengeTestCase {
	inputs: ChallengeTestCaseInput[];
	expectedOutput: string;
}

export interface ChallengeTestCaseInput {
	name: string;
	type: "str" | "int" | "float" | "bool";
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

	loader.init().then(monaco => {

		monaco.editor.defineTheme("custom-dark", {
		  base: "vs-dark",
		  inherit: true,
		  rules: [],
		  colors: {
			"editor.background": "#1c1917",
		  },
		});
	  
	})

}