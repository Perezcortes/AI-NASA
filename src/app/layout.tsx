import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

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
    <html lang="es">
      <body className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}