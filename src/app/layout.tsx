import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Background } from "@/components/layout/background";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/components/auth/auth-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Ghost Customer AI — Simulate hundreds of customers before they're real",
  description:
    "The AI that becomes your customer before your customer becomes your problem. Spin up hundreds of AI customers to find conversion blockers, churn risks, and revenue leaks before launch.",
  keywords: ["AI", "customer simulation", "multi-agent", "conversion", "churn", "revenue"],
  openGraph: {
    title: "Ghost Customer AI",
    description: "Watch hundreds of AI customers test your business before real ones do.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans">
        <Background />
        <AuthProvider>
          <Navbar />
          <main className="relative z-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
