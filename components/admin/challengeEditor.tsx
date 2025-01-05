"use client";

import React, { useState } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import { useToast } from "@/hooks/use-toast";

const defaultJson = `{
  "name": "Example Challenge",
  "description": "This is an example challenge description.",
  "arguments": {"arg1":"Int", "arg2":"Int"},
  "difficulty": "Medium",
  "points": 100,
  "testCases": [
    {
      "args": {"arg1":10, "arg2":20},
      "output": "30"
    },
    {
      "args": {"arg1":40, "arg2":50},
      "output": "90"
    }
  ]
}`;

export function ChallengeEditor() {
  const { queryDocuments, createDocument } = useFirestore();
  const [editorValue, setEditorValue] = useState(defaultJson);
  const { toast } = useToast();

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setEditorValue(value);
    }
  };

  const handleCreate = async () => {
    try {
      const parsedData = JSON.parse(editorValue);
      const name = parsedData["name"] || "untiled";

      const challenges = await queryDocuments("challenges", "name", name);
      if (challenges.length > 0) {
        toast({
          title: "Failed to create challenge",
          description: "Challenge name exists already",
          variant: "destructive",
        });
        return;
      }

      createDocument("challenges", parsedData);
      toast({
        title: "Success",
        description: "Challenge has been made",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Failed to create challenge",
        description: error.message || "Failed to create challenge",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <Editor
        height="23rem"
        defaultLanguage="json"
        value={editorValue}
        onChange={handleEditorChange} // Capture changes in the editor
      />
      <Button onClick={handleCreate}>Create</Button>
      <Button
        onClick={() => {
          setEditorValue(defaultJson);
        }}
        className="ml-2"
      >
        Reset
      </Button>
    </Card>
  );
}
