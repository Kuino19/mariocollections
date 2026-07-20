import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    template: '%s | Mario Collections',
    default: 'Mario Collections | Premium Native & Formal Wear in the UK',
  },
  description: "Sale & Rental of Premium Nigerian Native, Formal & Themed Wear. Serving the UK with authentic Aso-Ebi, Agbada, and Isi-Agu styles.",
  keywords: ["Nigerian Traditional Wear", "Aso-Ebi UK", "Agbada", "Isi-Agu", "African Fashion UK", "Party Wear Rentals"],
  openGraph: {
    title: 'Mario Collections | Premium Native & Formal Wear in the UK',
    description: 'Sale & Rental of Premium Nigerian Native, Formal & Themed Wear. Discover authentic styles.',
    url: 'https://mariocollections.com', // update this to your actual domain if different
    siteName: 'Mario Collections',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mario Collections',
    description: 'Premium Nigerian Native, Formal & Themed Wear in the UK.',
  },
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
