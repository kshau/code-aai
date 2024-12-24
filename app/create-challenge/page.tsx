"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { capitalizeFirstLetter, Challenge, formatChallengeTestCaseInputName, loadCustomDarkEditorTheme } from "@/lib/utils";
import { Editor } from "@monaco-editor/react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export default function CreateChallenge() {

	const [challengeData, setChallengeData] = useState<Challenge>({
		id: null,
		title: "Untitled Challenge",
		description: "",
		difficulty: "easy",
		testCases: [
			{
				inputs: [
					{
						name: "input_1",
						type: "int",
						value: 0
					},
					{
						name: "input_2",
						type: "int",
						value: 0
					},
				],
				expectedOutput: ""
			}
		]
	})

	const [testCasesEditMode, setTestCasesEditMode] = useState<"table" | "raw">("table");

	useEffect(() => {
		loadCustomDarkEditorTheme();
	}, [])

	return (

		<div className="w-screen flex justify-center">

			<div className="flex flex-col gap-4">

				<Card>

					<CardHeader>

						<CardTitle>
							Information
						</CardTitle>

					</CardHeader>

					<CardContent className="mt-2 flex flex-col gap-y-4">

						<div className="space-y-2">
							<Label>
								Title
							</Label>
							<Input value={challengeData.title} onChange={e => {
								setChallengeData({
									...challengeData,
									title: e.target.value
								})
							}} />
						</div>

						<div className="space-y-2">
							<Label>
								Description
							</Label>
							<Textarea value={challengeData.description} onChange={e => {
								setChallengeData({
									...challengeData,
									description: e.target.value
								})
							}} />
						</div>

						<div className="space-y-2">
							<Label>
								Difficulty
							</Label>
							<Select onValueChange={(value: "easy" | "medium" | "hard") => {
								setChallengeData({
									...challengeData,
									difficulty: value
								})
							}}>
								<SelectTrigger className="w-28">
									<SelectValue placeholder={capitalizeFirstLetter(challengeData.difficulty)} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="easy">Easy</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="hard">Hard</SelectItem>
								</SelectContent>
							</Select>
						</div>

					</CardContent>

				</Card>

				<Card className="w-[45rem]">

					<CardHeader className="flex flex-row">

						<CardTitle>
							Test cases
						</CardTitle>

						<Tabs defaultValue="table" className="ml-auto relative bottom-3" onValueChange={(value: "table" | "raw") => { setTestCasesEditMode(value) }}>
							<TabsList >
								<TabsTrigger value="table">
									Table
								</TabsTrigger>
								<TabsTrigger value="raw">
									Raw
								</TabsTrigger>
							</TabsList>
						</Tabs>

					</CardHeader>

					<CardContent className="mt-2">

						{testCasesEditMode == "table" ? (
							<ScrollArea className="pb-4">

								<Table className="w-fit">

									<TableHeader>
										<TableRow>
											{challengeData.testCases[0].inputs.map((input, index) => (
												<TableHead key={index}>
													<div className="flex flex-row gap-2 py-4">

														<div className="space-y-2">

															<Input className="w-28" value={input.name} onChange={(e) => {
																setChallengeData({
																	...challengeData,
																	testCases: challengeData.testCases.map(testCase => ({
																		...testCase,
																		inputs: testCase.inputs.map((input, inputIndex) => inputIndex == index ? { ...input, name: formatChallengeTestCaseInputName(e.target.value) } : input)
																	}))
																})
															}} />

															<Select onValueChange={(value) => {
																setChallengeData({
																	...challengeData,
																	testCases: challengeData.testCases.map(testCase => ({
																		...testCase,
																		inputs: testCase.inputs.map((input, inputIndex) => inputIndex == index ? { ...input, type: value || "int" } : input)
																	}))
																})
															}}>
																<SelectTrigger className="w-20">
																	<SelectValue placeholder={input.type} />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="str">str</SelectItem>
																	<SelectItem value="int">int</SelectItem>
																	<SelectItem value="float">float</SelectItem>
																	<SelectItem value="bool">bool</SelectItem>
																</SelectContent>
															</Select>

														</div>

														<Button variant="ghost" onClick={() => {
															setChallengeData({
																...challengeData,
																testCases: challengeData.testCases.map((testCase) => ({
																	...testCase,
																	inputs: testCase.inputs.filter((_, inputIndex) => inputIndex != index)
																}))
															})
														}} disabled={challengeData.testCases[0].inputs.length <= 1}>
															<Trash2Icon />
														</Button>

													</div>
												</TableHead>
											))}

											<TableHead className="text-center">
												Output
											</TableHead>

										</TableRow>
									</TableHeader>
									<TableBody>

										{challengeData.testCases.map((testCase, testCaseIndex) => (
											<TableRow key={testCaseIndex}>

												{testCase.inputs.map((input, inputIndex) => {

													const inputType = challengeData.testCases[testCaseIndex].inputs[inputIndex].type;

													if (inputType == "bool") {
														return (
															<TableCell key={inputIndex}>
																<Select onChange={(value: boolean) => {
																	setChallengeData({
																		...challengeData,
																		testCases: challengeData.testCases.map((testCase) => ({ ...testCase, inputs: testCase.inputs.map((input, inputIndex_) => inputIndex == inputIndex_ ? { ...input, value: value ? true : false } : input) }))
																	})
																}}>
																	<SelectTrigger className="w-20">
																		<SelectValue placeholder={input.value ? "True" : "False"} />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="true">True</SelectItem>
																		<SelectItem value="false">False</SelectItem>
																	</SelectContent>
																</Select>
															</TableCell>
														)
													}

													else {
														return (
															<TableCell key={inputIndex}>
																<Input value={input.value} className="w-20" type={(inputType == "int" || inputType == "float") ? "number" : "text"} onChange={(e) => {
																	setChallengeData({
																		...challengeData,
																		testCases: challengeData.testCases.map((testCase, testCaseIndex_) => ({
																			...testCase, inputs: testCase.inputs.map((input, inputIndex_) => inputIndex == inputIndex_ && testCaseIndex == testCaseIndex_ ? { ...input, value: e.target.value } : input)
																		}))
																	})
																}} />
															</TableCell>
														)
													}


												})}

												<TableCell>
													<Input value={testCase.expectedOutput} className="w-20" onChange={(e) => {
														setChallengeData({
															...challengeData,
															testCases: challengeData.testCases.map((testCase, testCaseIndex) => ({
																...testCase,
																expectedOutput: (testCaseIndex == testCaseIndex) ? e.target.value : testCase.expectedOutput
															}))
														})
													}} />
												</TableCell>

												<TableCell>
													<Button variant="ghost" onClick={() => {
														setChallengeData({
															...challengeData,
															testCases: challengeData.testCases.filter((_, testCaseIndex) => testCaseIndex != testCaseIndex)
														})
													}} disabled={challengeData.testCases.length <= 1}>
														<Trash2Icon />
													</Button>
												</TableCell>

											</TableRow>
										))}

									</TableBody>

								</Table>

								<ScrollBar orientation="horizontal" />

							</ScrollArea>
						) : (
							<Editor
								height="30rem"
								defaultLanguage="python"
								theme="custom-dark"
								value={JSON.stringify(challengeData.testCases, null, 4)}
								onChange={value => {
									try {
										setChallengeData({
											...challengeData,
											testCases: JSON.parse(value || "")
										})
									}
									catch (err) {
										console.error(err);
									}
								}}
							/>
						)}

						<div className="flex flex-row gap-x-2 mt-6 justify-end">

							<Button size="sm" onClick={() => {
								setChallengeData({
									...challengeData,
									testCases: [
										...challengeData.testCases,
										{
											inputs: [
												...challengeData.testCases[0].inputs
											],
											expectedOutput: ""
										}
									]
								})
							}}>
								<PlusIcon />
								Test case
							</Button>

							<Button size="sm" variant="secondary" onClick={() => {
								setChallengeData({
									...challengeData,
									testCases: challengeData.testCases.map((testCase) => ({
										inputs: [
											...testCase.inputs,
											{
												name: `input_${testCase.inputs.length + 1}`,
												type: "int",
												value: 0
											}
										],
										expectedOutput: ""
									}))
								})
							}}>
								<PlusIcon />
								Input
							</Button>

						</div>

					</CardContent>

				</Card>

			</div>

		</div>

	)

}