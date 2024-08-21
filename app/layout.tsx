import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ModeToggle } from "@/components/ui/mode-toggle";
import ProfileDropDown from "@/components/profile-drop-down";

// Ensure you have a utility function `cn` like this or correctly imported.
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
