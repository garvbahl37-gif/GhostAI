import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Background } from "@/components/layout/background";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Ghost Customer AI — Simulate hundreds of customers before they're real",
  description:
    "The AI that becomes your customer before your customer becomes your problem. Spin up hundreds of AI customers to find conversion blockers, churn risks, and revenue leaks before launch.",
  keywords: ["AI", "customer simulation", "multi-agent", "conversion", "churn", "revenue"],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Ghost Customer AI",
    description: "Watch hundreds of AI customers test your business before real ones do.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0f172a",
          colorBackground: "#ffffff",
          borderRadius: "0.9rem",
          fontFamily: "var(--font-body), 'Helvetica Neue', Arial, sans-serif",
        },
        elements: {
          card: "shadow-[0_30px_120px_-40px_rgba(30,20,70,0.18)] border border-slate-200",
          formButtonPrimary:
            "bg-slate-900 hover:bg-black text-white normal-case shadow-none",
          footerActionLink: "text-slate-900 hover:text-black",
        },
      }}
    >
      <html lang="en" className={`${inter.variable} ${mono.variable}`}>
        <head>
          {/* HelveticaNow Display — used by the Mainframe-style hero */}
          <link
            rel="stylesheet"
            href="https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium"
          />
          <link
            rel="stylesheet"
            href="https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg"
          />
        </head>
        <body className="min-h-screen">
          <Background />
          <Navbar />
          <main className="relative z-10">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
