import axios from "axios";
import { auth, firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

const {RAPIDAPI_API_KEY} = process.env;

interface attemptChallengeData {
	editorContent: string;
	challengeId: string;
	userToken: string;
}

export async function POST(request: NextRequest) {
	const Auth = auth();
	const Firestore = firestore();
	const { editorContent, userToken, challengeId }: attemptChallengeData = await request.json();

    const user = await Auth.verifyIdToken(userToken);
    if(!user || !user.email){
      return NextResponse.json(Errors.UNAUTHORIZED);
    }

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
	} catch (err:any) {
		console.error(err);


		return NextResponse.json(
			{
				error:err.message
			},
			{ status: 500 }
		);

	}
}
