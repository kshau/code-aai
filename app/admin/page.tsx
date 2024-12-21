"use client";

import React, { useEffect, useState } from "react";
import { UserSignupRequestData } from "@/lib/utils";
import { useFirestore } from "@/lib/firebase/useFirestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface UserSignupRequestDataDocument extends Partial<UserSignupRequestData> {
    id: string; // Add the document ID field
}

export default function Admin() {
    const [userSignupRequestsData, setUserSignupRequestsData] = useState<UserSignupRequestDataDocument[]>([]);
    const { getDocuments, deleteDocument } = useFirestore();

    const fetchSignupRequests = async () => {
        try {
            const data = await getDocuments<UserSignupRequestDataDocument>("signup-requests");
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

    const createUser = async (name: string, requestDocumentId: string) => {
        name = name.replaceAll(" ", ".");
        await createUserWithEmailAndPassword(auth, `${name}@codeaai.org`, `defaultpasswoord123`);
        await deleteDocument("signup-requests", requestDocumentId);
        const updatedRequests = userSignupRequestsData.filter(request => request.id !== requestDocumentId);
        setUserSignupRequestsData(updatedRequests);
    };

    return (
        <Card className="w-fit m-4">
            <CardHeader>
                <CardTitle>User Signup Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document ID</TableHead> {/* Add header for Document ID */}
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Grade Level</TableHead>
                            <TableHead>Coding Experience</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userSignupRequestsData.map((userSignupRequestData: UserSignupRequestDataDocument, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{userSignupRequestData.id || "N/A"}</TableCell>
                                <TableCell>{userSignupRequestData.name || "N/A"}</TableCell>
                                <TableCell>{userSignupRequestData.email || "N/A"}</TableCell>
                                <TableCell>{userSignupRequestData.gradeLevel || "N/A"}</TableCell>
                                <TableCell>{userSignupRequestData.codingExperience || "N/A"}</TableCell>
                                <TableCell>
                                    <Button onClick={() => createUser(userSignupRequestData.name!, userSignupRequestData.id)}>Accept</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
