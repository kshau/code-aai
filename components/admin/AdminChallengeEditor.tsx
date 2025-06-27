"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import { useToast } from "@/hooks/use-toast";
import { Challenge } from "@/lib/utils";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { LoaderCircle, PlusIcon, SparklesIcon, XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function AdminChallengeEditor({
  challengeTemplate,
}: {
  challengeTemplate: string;
}) {
  const [editorValue, setEditorValue] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setEditorValue(value);
    }
  };

  const handleCreate = async () => {
    try {
      const parsedData = JSON.parse(editorValue);
      parsedData["id"] = parsedData["name"].toLowerCase().replaceAll(" ", "-");

      const challengeData: Challenge = parsedData as Challenge;
      const userToken = await user?.getIdToken();

      const res = await axios.post(
        "/api/admin/createChallenge",
        {
          userToken,
          challengeData,
        },
        { withCredentials: true }
      );

      if (res.request.ok) {
        toast({
          title: "Success",
          description: "Challenge has been made!",
          variant: "default",
        });
      }
    } catch {
      toast({
        title: "Failure",
        description: "Failed to create challenge!",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setEditorValue(challengeTemplate);
  }, [challengeTemplate]);

  return (
    <Card className="p-4 ">
      <Editor
        defaultLanguage="json"
        value={editorValue}
        onChange={handleEditorChange}
        width="60rem"
        height="35rem"
      />
      <div className="mt-2 space-x-2">
        <AdminChallengeEditorGenerateDialog setEditorValue={setEditorValue} />
        <Button onClick={handleCreate} className="text-white">
          <PlusIcon />
          Create
        </Button>
        <Button
          onClick={() => {
            setEditorValue(challengeTemplate);
          }}
          variant="destructive"
        >
          <XIcon />
          Reset
        </Button>
      </div>

    </Card>
  );
}

interface AdminChallengeEditorGenerateDialogProps {
  setEditorValue: React.Dispatch<React.SetStateAction<string>>;
}

function AdminChallengeEditorGenerateDialog({ setEditorValue }: AdminChallengeEditorGenerateDialogProps) {

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [numTestCases, setNumTestCases] = useState<number>(5);
  const [generationLoading, setGenerationLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setGenerationLoading(true);

    try {
      const userToken = await user?.getIdToken();

      const res = await axios.post(
        "/api/admin/generateChallenge",
        {
          userToken,
          prompt,
          numTestCases
        },
        { withCredentials: true }
      );

      const { challengeData } = res.data;

      setEditorValue(JSON.stringify(challengeData, null, 2));
      setDialogOpen(false);
      setGenerationLoading(false);

      toast({
        title: "Success",
        description: "Challenge generation was successful!",
        variant: "default",
      });
    } catch {

      toast({
        title: "Failure",
        description: "Failed to generate challenge!",
        variant: "destructive",
      });

    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger onClick={() => setDialogOpen(true)}>
        <Button variant="outline">
          <SparklesIcon />
          Generate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Generate a Challenge
          </DialogTitle>
          <DialogDescription>
            Use Gemini 1.5 to generate your own challenge using artificial intelligence.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea onChange={e => { setPrompt(e.target.value) }} maxLength={256} />
          </div>
          <div className="space-y-2">
            <Label>Number of test cases</Label>
            <Input type="number" className="w-24" value={numTestCases} onChange={e => { setNumTestCases(parseInt(e.target.value)) }} max={20} min={5} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose onClick={() => setDialogOpen(false)}>
            <Button variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleGenerate} disabled={!prompt || !numTestCases || generationLoading}>
            {generationLoading && (
              <LoaderCircle className="animate-spin" />
            )}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}