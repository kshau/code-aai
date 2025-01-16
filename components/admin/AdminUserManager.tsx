"use client";

import { useEffect, useState } from "react";
import {
  User,
  UserSignupRequestData,
  UserSignupRequestDataDocument,
} from "@/lib/utils";
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

export function AdminUserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [deleteReason, setDeleteReason] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { getDocuments } = useFirestore();

  useEffect(() => {
    const getUsers = async () => {
      const users = await getDocuments<User>("users");
      setUsers(users);
    };

    getUsers();
  }, [user]);

  // Function to handle user deletion
  const deleteUser = async (userData: User, reason: string) => {
    try {
      const userToken = await user?.getIdToken();

      await fetch("/api/admin/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userToken,
          userUid: userData.uid,
          reason,
        }),
      });
      setUsers((prev) => prev.filter((u) => u.uid !== userData.uid));

      toast({
        title: "User deleted",
        description: `Successfully deleted user: ${userData.username}`,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
      });
    }
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteReason("");
  };

  const handleDeleteConfirm = () => {
    if (selectedUserId && deleteReason.trim()) {
      const userData = users.find((user) => user.uid === selectedUserId);
      if (userData) {
        deleteUser(userData, deleteReason);
      }
      setSelectedUserId(null);
      setDeleteReason("");
    }
  };

  return (
    <Card className="w-full h-96">
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] overflow-auto">
        {users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 bg-background">
                  UID
                </TableHead>
                <TableHead className="sticky top-0 bg-background">
                  Name
                </TableHead>
                <TableHead className="sticky top-0 bg-background">
                  Points
                </TableHead>
                <TableHead className="sticky top-0 bg-background">
                  Parent Email
                </TableHead>
                <TableHead className="sticky top-0 bg-background">
                  Grade Level
                </TableHead>
                <TableHead className="sticky top-0 bg-background">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((userData: User, index: number) => (
                <TableRow key={index}>
                  <TableCell>{userData.uid || "N/A"}</TableCell>
                  <TableCell>{userData.username || "N/A"}</TableCell>
                  <TableCell>{userData.points || "N/A"}</TableCell>
                  <TableCell>{userData.parentEmail || "N/A"}</TableCell>
                  <TableCell>{userData.gradeLevel || "N/A"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteClick(userData.uid)}
                        >
                          Delete
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Delete User
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Please provide a reason for deleting this user.
                            </p>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="delete-reason">Reason</Label>
                            <Input
                              id="delete-reason"
                              value={deleteReason}
                              onChange={(e) => setDeleteReason(e.target.value)}
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
              ))}
            </TableBody>
          </Table>
        ) : (
          <span>No users</span>
        )}
      </CardContent>
    </Card>
  );
}
