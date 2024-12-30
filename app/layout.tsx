import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { FirestoreProvider } from "@/lib/firebase/useFirestore";
import { useEffect } from "react";
import { loader } from "@monaco-editor/react";
import { AuthProvider } from "@/lib/firebase/useAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeAAI",
  description: "Have fun coding with competition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FirestoreProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </FirestoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
