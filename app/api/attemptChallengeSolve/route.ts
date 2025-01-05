import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const {RAPIDAPI_API_KEY} = process.env;

interface attemptChallengeData {
	editorContent: string;
	challengeId: string;
}

export async function POST(request: NextRequest) {

	const { editorContent, challengeId }: attemptChallengeData = await request.json();

	try {

		const res = await axios.post(
			"https://onecompiler-apis.p.rapidapi.com/api/v1/run",
			{
				language: "python",
				files: [
					{
						name: "index.py",
						content: editorContent,
					},
				],
			},
			{
				headers: {
					"x-rapidapi-key": RAPIDAPI_API_KEY,
					"x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
					"Content-Type": "application/json",
				},
			}
		);

		const { stdout, stderr } = res.data;

		console.log(stderr)

		return NextResponse.json(
			{
				codeOutput: stdout || stderr,
				producedError: stderr != null,
				failedTestCase: {
					inputs: [
						{
							name: "number", 
							type: "int", 
							value: 17
						}, 
						{
							name: "length", 
							type: "int", 
							value: 2
						}, 
					], 
					expectedOutput: "20", 
					recievedOutput: "25"
				}
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
	}
}
