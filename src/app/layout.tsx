"use client";

import Header from "@/components/Header";
import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  }

  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <Toaster position="top-center" toastOptions={{ duration: 2500 }} />

        <Header />

        <main className="flex-1 py-6">{children}</main>
      </body>
    </html>
  );
}
