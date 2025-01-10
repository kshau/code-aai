"use client";

import { useEffect, useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserSignupRequestDataDocument extends UserSignupRequestData {
  id: string;
}

export function AdminSignupRequestApproval() {
  const [userSignupRequestsData, setUserSignupRequestsData] = useState<
    UserSignupRequestDataDocument[]
  >([]);
  const [deleteReason, setDeleteReason] = useState<string>("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const { getDocuments, deleteDocument } = useFirestore();
  const { toast } = useToast();
  const { user } = useAuth();

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
    userSignupRequestData: UserSignupRequestDataDocument,
    reason: string
  ) => {
    const userToken = await user?.getIdToken();
    try {
      const response = await fetch("/api/admin/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userToken,
          requestId: userSignupRequestData.id,
          reason,
        }),
      });

      if (response.ok) {
        await deleteDocument("signup-requests", userSignupRequestData.id);
        setUserSignupRequestsData((prevData) =>
          prevData.filter((request) => request.id !== userSignupRequestData.id)
        );
        toast({
          title: "Success",
          description: "User request deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete user request");
      }
    } catch (error) {
      console.error("Error deleting user request: ", error);
      toast({
        title: "Error",
        description: "Failed to delete user request.",
        variant: "destructive",
      });
    }
  };

  const createUser = async (
    userSignupRequestData: UserSignupRequestDataDocument
  ) => {
    const userToken = await user?.getIdToken();
    try {
      const response = await fetch("/api/admin/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userToken,
          requestId: userSignupRequestData.id,
        }),
      });

      if (response.ok) {
        await deleteDocument("signup-requests", userSignupRequestData.id);
        setUserSignupRequestsData((prevData) =>
          prevData.filter((request) => request.id !== userSignupRequestData.id)
        );
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

  const handleDeleteClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setDeleteReason("");
  };

  const handleDeleteConfirm = () => {
    if (selectedRequestId && deleteReason.trim()) {
      const requestData = userSignupRequestsData.find(
        (request) => request.id === selectedRequestId
      );
      if (requestData) {
        deleteRequest(requestData, deleteReason);
      }
      setSelectedRequestId(null);
      setDeleteReason("");
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            onClick={() =>
                              handleDeleteClick(userSignupRequestData.id)
                            }
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                Delete Request
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Please provide a reason for deleting this
                                request.
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="delete-reason">Reason</Label>
                              <Input
                                id="delete-reason"
                                value={deleteReason}
                                onChange={(e) =>
                                  setDeleteReason(e.target.value)
                                }
                                placeholder="Enter reason for deletion"
                              />
                            </div>
                            <Button
                              onClick={handleDeleteConfirm}
                              disabled={!deleteReason.trim()}
                            >
                              Confirm Delete
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        ) : (
          <span>No requests</span>
        )}
      </CardContent>
    </Card>
  );
}
