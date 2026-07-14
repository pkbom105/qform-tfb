import React from "react";
import Footer from "@/components/frontpage/Footer";

export default function FrontpageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
