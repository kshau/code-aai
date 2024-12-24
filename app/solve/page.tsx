"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"
import Editor, { loader } from '@monaco-editor/react';
import { PlayIcon, RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios"
import { useSearchParams } from 'next/navigation';
import { loadCustomDarkEditorTheme } from "@/lib/utils";

export default function Solve() {

	const searchParams = useSearchParams();
	const challengeId = searchParams.get("c");

	const [editorContent, setEditorContent] = useState("");
	const [codeOutput, setCodeOutput] = useState<string | null>(null);

	const attemptChallengeSolve = async () => {

		const res = await axios.post("/api/attemptChallengeSolve", {
			editorContent,
			challengeId
		}, { withCredentials: true });

		setCodeOutput(res.data.codeOutput);

	}

	const resetEditorContent = () => {
		setEditorContent("");
		setCodeOutput(null);
	}

	useEffect(() => {
		loadCustomDarkEditorTheme();
	}, [])

	return (

		<div className="w-screen flex justify-center">

			<div className="flex flex-col gap-y-4">

				<Card className="p-6 flex flex-wrap">

					<Editor
						height="70vh"
						width="30vw"
						defaultLanguage="python"
						theme="custom-dark"
						value={editorContent}
						onChange={value => { setEditorContent(value || "") }}
					/>

					<div className="pl-6 w-[15vw]">
						<pre>
							{codeOutput || <span className="italic text-gray-400">Output will appear here</span>}
						</pre>
					</div>

				</Card>

				<div className="flex flex-row justify-center gap-2">

					<Button className="w-fit self-center" onClick={attemptChallengeSolve}>
						<PlayIcon />
						Run
					</Button>

					<Button className="w-fit self-center" variant="secondary" onClick={resetEditorContent}>
						<RefreshCwIcon />
						Reset
					</Button>

				</div>

			</div>


		</div>

	)

}