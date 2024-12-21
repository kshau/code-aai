import { NextRequest, NextResponse } from "next/server";

export async function POST(request : NextRequest) {
    
    const { editorContent, challengeId } = await request.json();

    return NextResponse.json({ 

        codeOutput: "Hello world!", 
        producedError: false

    }, { status: 200 });

}