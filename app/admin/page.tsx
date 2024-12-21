'use client'

import React, { useEffect, useState } from 'react'
import { UserSignupRequestData } from '@/lib/utils'
import { useFirestore } from '@/lib/firebase/useFirestore'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export default function Admin() {
    const [userSignupRequests, setUserSignupRequests] = useState<UserSignupRequestData[]>([]);
    const { getDocuments, deleteDocument } = useFirestore();

    useEffect(() => {
        const fetchSignupRequests = async () => {
            try {
                const data = await getDocuments<UserSignupRequestData>("signup-requests");
                setUserSignupRequests(data);
            } catch (error) {
                console.error("Error fetching user signup requests:", error);
            }
        };

        fetchSignupRequests();
    }, [getDocuments]);

    const createUser = async(username:string)=>{
        await createUserWithEmailAndPassword(auth, `${username}@codeaai.org`, `defaultpasswoord123`);
    }


    return (
        <Card className="w-fit m-4">
            <CardHeader>
                <CardTitle>User Signup Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Grade Level</TableHead>
                            <TableHead>Coding Experience</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userSignupRequests.map((value: UserSignupRequestData, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{value.name || 'N/A'}</TableCell>
                                <TableCell>{value.email || 'N/A'}</TableCell>
                                <TableCell>{value.gradeLevel || 'N/A'}</TableCell>
                                <TableCell>{value.codingExperience || 'N/A'}</TableCell>
                                <TableCell>
                                    <Button onClick={()=>{createUser(value.name)}}>Accept</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

