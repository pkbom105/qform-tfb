import React from "react";
import Navbar from "@/components/frontpage/Navbar";
import Footer from "@/components/frontpage/Footer";

export default function FrontpageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}