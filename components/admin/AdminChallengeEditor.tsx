"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import { useToast } from "@/hooks/use-toast";
import { Challenge } from "@/lib/utils";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

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
          description: "Challenge has been made",
          variant: "default",
        });
      }
    } catch {
      toast({
        title: "Failed to create challenge",
        description: "Failed to create challenge",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setEditorValue(challengeTemplate);
  }, [challengeTemplate]);

  return (
    <Card className="p-4">
      <Editor
        height="23rem"
        defaultLanguage="json"
        value={editorValue}
        onChange={handleEditorChange}
      />
      <Button onClick={handleCreate}>Create</Button>
      <Button
        onClick={() => {
          setEditorValue(challengeTemplate);
        }}
        className="ml-2"
      >
        Reset
      </Button>
    </Card>
  );
}
