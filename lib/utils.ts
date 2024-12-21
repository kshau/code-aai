import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface UserSignupRequestData {
    id?:string;
    name: string, 
    gradeLevel: number | null, 
    email: string, 
    codingExperience: "beginner" | "intermediate" | "advanced"
}
