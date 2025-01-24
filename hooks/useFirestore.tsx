"use client";
import React, { createContext, useContext } from "react";
import { firestore } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  query,
  where,
  QuerySnapshot,
  DocumentData,
  WithFieldValue,
  UpdateData,
} from "firebase/firestore";
import { User } from "@/lib/utils";

interface FirestoreContextType {
  getDocuments: <T>(collectionName: string) => Promise<T[]>;
  getDocument: <T>(
    collectionName: string,
    documentId: string
  ) => Promise<T | undefined>;
  queryDocuments: <T>(
    collectionName: string,
    field: string,
    value: any
  ) => Promise<T[]>;
  deleteDocument: (collectionName: string, documentId: string) => Promise<void>;
  createDocument: <T extends DocumentData>(
    collectionName: string,
    data: WithFieldValue<T>
  ) => Promise<void>;
  editDocument: <T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: UpdateData<T>
  ) => Promise<void>;
  getUserData: (uid: string) => Promise<User>;
  editUserData: (uid: string, data: any) => Promise<void>;
}

export const FirestoreContext = createContext<FirestoreContextType | undefined>(
  undefined
);

export function FirestoreProvider({ children }: { children: React.ReactNode }) {
  const getDocuments = async <T,>(collectionName: string): Promise<T[]> => {
    try {
      const querySnapshot: QuerySnapshot = await getDocs(
        collection(firestore, collectionName)
      );
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      return documents;
    } catch (error) {
      console.error(
        `Error fetching documents from collection '${collectionName}':`,
        error
      );
      throw error;
    }
  };

  const getUserData = async (uid: string): Promise<User> => {
    try {
      const userDocRef = doc(firestore, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return { ...userDocSnap.data() } as User;
      } else {
        throw new Error(`User document with UID '${uid}' not found.`);
      }
    } catch (error) {
      console.error(`Error fetching user data for UID '${uid}':`, error);
      throw error;
    }
  };

  const getDocument = async <T,>(
    collectionName: string,
    documentId: string
  ): Promise<T | undefined> => {
    try {
      const docRef = doc(firestore, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        console.error(
          `Document with ID ${documentId} not found in collection '${collectionName}'`
        );
        return undefined;
      }
    } catch (error) {
      console.error(
        `Error fetching document with ID '${documentId}' from collection '${collectionName}':`,
        error
      );
      throw error;
    }
  };

  const queryDocuments = async <T,>(
    collectionName: string,
    field: string,
    value: any
  ): Promise<T[]> => {
    try {
      const q = query(
        collection(firestore, collectionName),
        where(field, "==", value)
      );
      const querySnapshot: QuerySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      return documents;
    } catch (error) {
      console.error(
        `Error querying documents in collection '${collectionName}':`,
        error
      );
      throw error;
    }
  };

  const createDocument = async <T extends DocumentData>(
    collectionName: string,
    data: WithFieldValue<T>
  ): Promise<void> => {
    try {
      await addDoc(collection(firestore, collectionName), data);
    } catch (error) {
      console.error(
        `Error creating document in collection '${collectionName}':`,
        error
      );
      throw error;
    }
  };

  const editDocument = async <T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: UpdateData<T>
  ): Promise<void> => {
    try {
      const docRef = doc(firestore, collectionName, documentId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(
        `Error updating document in collection '${collectionName}':`,
        error
      );
      throw error;
    }
  };

  const editUserData = async (
    uid: string,
    data: any
  ): Promise<void> => {
    try {
      const userDocRef = doc(firestore, "users", uid);
      await updateDoc(userDocRef, data);

    } catch (error) {
      console.error(`Error updating user data for UID '${uid}':`, error);
      throw error;
    }
  };

  const deleteDocument = async (
    collectionName: string,
    documentId: string
  ): Promise<void> => {
    try {
      const docRef = doc(firestore, collectionName, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(
        `Error deleting document from collection '${collectionName}':`,
        error
      );
      throw error;
    }
  };

  return (
    <FirestoreContext.Provider
      value={{
        getDocuments,
        getDocument,
        queryDocuments,
        createDocument,
        editDocument,
        deleteDocument,
        getUserData,
        editUserData,
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}

export function useFirestore() {
  const context = useContext(FirestoreContext);

  if (context === undefined) {
    throw new Error("useFirestore must be used within a FirestoreProvider");
  }

  return context;
}
