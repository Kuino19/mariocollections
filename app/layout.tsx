import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Mario Collections",
  description: "Sale & Rental of Native, Formal & Themed Wear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
