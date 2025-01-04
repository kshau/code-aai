"use client";

import React, { useState } from "react";
import { useFirestore } from "@/lib/firebase/useFirestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";

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
  const { createDocument } = useFirestore();
  const [editorValue, setEditorValue] = useState(defaultJson);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setEditorValue(value);
    }
  };

  const handleCreate = () => {
    try {
      const parsedData = JSON.parse(editorValue);
      createDocument("challenges", parsedData);
    } catch (error) {
      console.error("Invalid JSON:", error);
      alert("The JSON is not valid. Please fix it before saving.");
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
    </Card>
  );
}
