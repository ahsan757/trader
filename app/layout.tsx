import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "./context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NADEEM TRADER | Premium Management",
  description: "High-end project and inventory management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProjectProvider>
          <div className="min-h-screen flex flex-col">
            <header className="p-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent italic">
                  NADEEM TRADER
                </h1>
                <div className="text-xs text-white/40 font-mono uppercase tracking-widest">
                  Enterprise Inventory System
                </div>
              </div>
            </header>
            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
              {children}
            </main>
          </div>
        </ProjectProvider>
      </body>
    </html>
  );
}
