"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar/Navbar";
import { Editor } from "@monaco-editor/react";
import { AdminSignupRequestApproval } from "@/components/admin/AdminSignupRequestApproval";
import { AdminChallengeEditor } from "@/components/admin/AdminChallengeEditor";

export default function Admin() {
  return (
    <Navbar className="flex justify-center items-center">
      <Tabs
        defaultValue="signup-reuqests"
        className="flex flex-col items-center"
      >
        <TabsList className="w-fit">
          <TabsTrigger value="signup-reuqests">Signup Requests</TabsTrigger>
          <TabsTrigger value="create-challenge">Create Challenge</TabsTrigger>
        </TabsList>
        <div className="h-96 w-[55vw]">
          <TabsContent value="signup-reuqests">
            <AdminSignupRequestApproval />
          </TabsContent>
          <TabsContent value="create-challenge">
            <AdminChallengeEditor />
          </TabsContent>
          <TabsContent value="edit-user">
            <Editor height="30rem" defaultLanguage="json" />
          </TabsContent>
          <TabsContent value="edit-challenge">
            <Editor height="30rem" defaultLanguage="json" />
          </TabsContent>
        </div>
      </Tabs>
    </Navbar>
  );
}
