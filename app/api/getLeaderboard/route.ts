import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

	try {

		return NextResponse.json({
			leaderboard: [
				{
					name: "Shaurya Kumar", 
					solves: 25, 
					points: 69420
				}, 
				{
					name: "Keshav Shah", 
					solves: 23, 
					points: 68420
				}
			]
		}, { status: 200 });

	} catch (err) {
		console.error(err);
	}

}