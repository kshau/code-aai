import { NextRequest, NextResponse } from "next/server";

export async function POST(request : NextRequest) {
	
	const { challengeId } = await request.json();

	return NextResponse.json({ 
		instruction: "Print \"Hello world!\" to the screen!", 
	}, { status: 200 });

}