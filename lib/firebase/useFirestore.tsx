'use client';
import React, { createContext, useContext } from 'react';
import { firestore } from '@/lib/firebase/config';
import { collection, getDocs, addDoc, QuerySnapshot, DocumentData, WithFieldValue, doc, deleteDoc } from 'firebase/firestore';

interface FirestoreContextType {
  getDocuments: <T>(collectionName: string) => Promise<T[]>;
  deleteDocument: <T>(collectionName: string, documentId:string) => Promise<void>;
  createDocument: <T extends DocumentData>(collectionName: string, data: WithFieldValue<T>) => Promise<void>;
}

export const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

export function FirestoreProvider({ children }: { children: React.ReactNode }) {
  const getDocuments = async <T,>(collectionName: string): Promise<T[]> => {
    try {
      const querySnapshot: QuerySnapshot = await getDocs(collection(firestore, collectionName));
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      return documents;
    } catch (error) {
      console.error(`Error fetching documents from collection '${collectionName}':`, error);
      throw error;
    }
  };

  const createDocument = async <T extends DocumentData>(collectionName: string, data: WithFieldValue<T>): Promise<void> => {
    try {
      await addDoc(collection(firestore, collectionName), data);
    } catch (error) {
      console.error(`Error creating document in collection '${collectionName}':`, error);
      throw error;
    }
  };

  const deleteDocument = async(collectionName: string, documentId:string): Promise<void> => {
    try {
      const docRef = doc(firestore, collectionName, documentId); 
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error creating document in collection '${collectionName}':`, error);
      throw error;
    }
  };

  return (
    <FirestoreContext.Provider value={{ getDocuments, createDocument, deleteDocument }}>
      {children}
    </FirestoreContext.Provider>
  );
}

export function useFirestore() {
  const context = useContext(FirestoreContext);

  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirestoreProvider');
  }

  return context;
}
