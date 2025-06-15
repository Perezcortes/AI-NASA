import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { RootProvider } from "./RootProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-NASA | Explorando el universo",
  description: "Aplicación que combina IA con datos de la NASA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-black dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}>
        <RootProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </RootProvider>
      </body>
    </html>
  );
}
