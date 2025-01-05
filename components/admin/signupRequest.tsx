"use client";

import React, { useEffect, useState } from "react";
import { UserSignupRequestData } from "@/lib/utils";
import { useFirestore } from "@/hooks/useFirestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UserSignupRequestDataDocument extends UserSignupRequestData {
  id: string;
}

export function SignupRequests() {
  const [userSignupRequestsData, setUserSignupRequestsData] = useState<
    UserSignupRequestDataDocument[]
  >([]);
  const { getDocuments, deleteDocument } = useFirestore();
  const { toast } = useToast();

  const fetchSignupRequests = async () => {
    try {
      const data = await getDocuments<UserSignupRequestDataDocument>(
        "signup-requests"
      );
      const documentsWithIds = data.map((doc) => ({
        ...doc,
        id: doc.id || "N/A",
      }));
      setUserSignupRequestsData(documentsWithIds);
    } catch (error) {
      console.error("Error fetching user signup requests: ", error);
      toast({
        title: "Error",
        description: "Failed to fetch signup requests.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSignupRequests();
  }, [getDocuments]);

  const deleteRequest = async (
    userSignupRequestData: UserSignupRequestDataDocument
  ) => {
    try {
      await deleteDocument("signup-requests", userSignupRequestData.id);

      const updatedRequests = userSignupRequestsData.filter(
        (request) => request.id !== userSignupRequestData.id
      );
      setUserSignupRequestsData(updatedRequests);

      toast({
        title: "Success",
        description: "Request deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting request: ", error);
      toast({
        title: "Error",
        description: "Failed to delete request.",
        variant: "destructive",
      });
    }
  };

  const createUser = async (
    userSignupRequestData: UserSignupRequestDataDocument
  ) => {
    let username = userSignupRequestData.username.replaceAll(" ", ".");

    try {
      const response = await fetch("/api/admin/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          parentEmail: userSignupRequestData.parentEmail,
          gradeLevel: userSignupRequestData.gradeLevel,
          codingExperience: userSignupRequestData.codingExperience,
        }),
      });

      if (response.ok) {
        await deleteRequest(userSignupRequestData);
        toast({
          title: "Success",
          description: "User created successfully.",
        });
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user: ", error);
      toast({
        title: "Error",
        description: "Failed to create user.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full h-96">
      <CardHeader>
        <CardTitle>Signup Requests</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] overflow-auto">
        {userSignupRequestsData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 bg-background">
                  Document ID
                </TableHead>
                <TableHead className="sticky top-0 bg-background">
                  Name
                </TableHead>
                <TableHead className="sticky top-0 bg-background">
                  Parent Email
                </TableHead>
                <TableHead className="sticky top-0 bg-background">
                  Grade Level
                </TableHead>
                <TableHead className="sticky top-0 bg-background">
                  Coding Experience
                </TableHead>
                <TableHead className="sticky top-0 bg-background">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userSignupRequestsData.map(
                (
                  userSignupRequestData: UserSignupRequestDataDocument,
                  index: number
                ) => (
                  <TableRow key={index}>
                    <TableCell>{userSignupRequestData.id || "N/A"}</TableCell>
                    <TableCell>
                      {userSignupRequestData.username || "N/A"}
                    </TableCell>
                    <TableCell>
                      {userSignupRequestData.parentEmail || "N/A"}
                    </TableCell>
                    <TableCell>
                      {userSignupRequestData.gradeLevel || "N/A"}
                    </TableCell>
                    <TableCell>
                      {userSignupRequestData.codingExperience || "N/A"}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button onClick={() => createUser(userSignupRequestData)}>
                        Accept
                      </Button>
                      <Button
                        onClick={() => deleteRequest(userSignupRequestData)}
                        variant={"destructive"}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        ) : (
          <p>No requests</p>
        )}
      </CardContent>
    </Card>
  );
}
