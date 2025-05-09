

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MainWrapper from "@/components/MainWrapper";
import { Toaster } from 'react-hot-toast';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
// import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Starlord LMS",
  description: "Cardano Blockchain Based LMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        <MainWrapper>
        <Header />
        {/* <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        /> */}
        <div className="h-16"></div>
          {children}
          <Footer />
        </MainWrapper>
      </body>
    </html>
  );
}
