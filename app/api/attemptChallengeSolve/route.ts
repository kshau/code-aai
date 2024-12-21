import { NextRequest, NextResponse } from "next/server";

interface attemptChallengeData {
  editorContent: string;
  challengeId: string;
}

export async function POST(request: NextRequest) {
  const { editorContent, challengeId }: attemptChallengeData = await request.json();

  const url = 'https://onecompiler-apis.p.rapidapi.com/api/v1/run';
  const options = {
    method: 'POST',
    headers: {
     'x-rapidapi-key': '',
      'x-rapidapi-host': 'onecompiler-apis.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language: 'python',
      files: [
        {
          name: 'index.py',
          content: editorContent, 
        },
      ],
    }),
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      codeOutput: data.stdout || 'No output received',
      producedError: data.stderr || false,
    }, { status: 200 });

  } catch (error:any) {
    console.error("Error executing the code:", error);

    return NextResponse.json({
      codeOutput: '',
      producedError: true,
      errorMessage: error.message,
    }, { status: 500 });
  }
}
