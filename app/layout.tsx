import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { FirestoreProvider } from "@/hooks/useFirestore";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from "next/font/google";
import { ReCaptchaProvider } from "next-recaptcha-v3";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "400"], // Adjust weights as needed
});

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
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ReCaptchaProvider>
            <ToastProvider>
              <FirestoreProvider>
                <AuthProvider>{children}</AuthProvider>
              </FirestoreProvider>
              <Toaster />
            </ToastProvider>
          </ReCaptchaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
