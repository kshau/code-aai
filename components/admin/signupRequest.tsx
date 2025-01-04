"use client";

import React, { useEffect, useState } from "react";
import { UserSignupRequestData } from "@/lib/utils";
import { useFirestore } from "@/lib/firebase/useFirestore";
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

interface UserSignupRequestDataDocument extends Partial<UserSignupRequestData> {
  id: string;
}
export function SignupRequests() {
  const [userSignupRequestsData, setUserSignupRequestsData] = useState<
    UserSignupRequestDataDocument[]
  >([]);
  const { getDocuments, deleteDocument } = useFirestore();

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
    }
  };

  useEffect(() => {
    fetchSignupRequests();
  }, [getDocuments]);

  const createUser = async (
    name: string,
    parentEmail: string,
    requestDocumentId: string
  ) => {
    let username = name.replaceAll(" ", ".");
    const response = await fetch("/api/admin/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, parentEmail }),
    });

    if (response.status == 200) {
      await deleteDocument("signup-requests", requestDocumentId);

      const updatedRequests = userSignupRequestsData.filter(
        (request) => request.id !== requestDocumentId
      );
      setUserSignupRequestsData(updatedRequests);
    }
  };

  return (
    <Card className="w-full h-96 flex justify-center items-center">
      <CardContent>
        {userSignupRequestsData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document ID</TableHead>{" "}
                {/* Add header for Document ID */}
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Grade Level</TableHead>
                <TableHead>Coding Experience</TableHead>
                <TableHead>Action</TableHead>
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
                    <TableCell>{userSignupRequestData.name || "N/A"}</TableCell>
                    <TableCell>
                      {userSignupRequestData.email || "N/A"}
                    </TableCell>
                    <TableCell>
                      {userSignupRequestData.gradeLevel || "N/A"}
                    </TableCell>
                    <TableCell>
                      {userSignupRequestData.codingExperience || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          createUser(
                            userSignupRequestData.name!,
                            userSignupRequestData.email!,
                            userSignupRequestData.id
                          )
                        }
                      >
                        Accept
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
