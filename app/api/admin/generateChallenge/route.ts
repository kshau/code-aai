import { removeJSONCodeBlockMarkers } from "@/lib/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const {GOOGLE_GEMINI_API_KEY} = process.env;

async function geminiGenerateContent(prompt: string) {

    const res = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        {
            'contents': [
                {
                    'parts': [{'text': prompt}]
                }
            ]
        },
        {
            params: {
                'key': GOOGLE_GEMINI_API_KEY
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    const {candidates} = res.data;

    return candidates[0].content.parts[0].text;

}

export async function POST(request: NextRequest) {

    try {
        const { prompt, numTestCases } = await request.json();

        const geminiRes = await geminiGenerateContent(`
            
            I have a website where users can create and play Python programming challenges.
            When a user creates a challenge, they create all the test cases for the challenge and write them in JSON format.
    
            Example of a JSON template for a challenge:
            ${JSON.stringify({
                "name": "Addition",
                "description": "Add two numbers together.",
                "difficulty": "easy",
                "solved": false,
                "points": 100,
                "testCases": [
                    {
                        "inputs": [
                        { "name": "arg1", "type": "int", "value": 10 },
                        { "name": "arg2", "type": "int", "value": 20 }
                        ],
                        "expectedOutput": "30"
                    },
                    {
                        "inputs": [
                        { "name": "arg1", "type": "int", "value": 40 },
                        { "name": "arg2", "type": "int", "value": 50 }
                        ],
                        "expectedOutput": "90"
                    }
                ]
            })}

            You are limited to using datatypes string, int, float, and boolean.
    
            Create a challenge with ${numTestCases} test cases in JSON format such as the one above using the prompt below:
            ${prompt}
            
        `);
    
        const challengeData = JSON.parse(removeJSONCodeBlockMarkers(geminiRes));
    
        return NextResponse.json({ challengeData }, { status: 200 });
    }

    catch (err: any) {
        console.error(err);
        return NextResponse.json(
          {
            error: err.message,
          },
          { status: 500 }
        );
    }

}