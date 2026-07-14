import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const notoSansThai = Noto_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Toffy Boutique - ผู้ผลิตยูนิฟอร์มครบวงจร",
  description:
    "ทอฟฟี่ บูติก ผู้ผลิตและจำหน่ายเสื้อโปโล เสื้อยืด ยูนิฟอร์มครบวงจร ด้วยประสบการณ์มากกว่า 10 ปี งานคุณภาพ ราคาโรงงาน ส่งทั่วประเทศ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
