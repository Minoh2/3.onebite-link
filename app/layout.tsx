import type { Metadata } from "next";
import { FolderProvider } from "../components/FolderProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "한입 링크",
  description: "북마크 링크를 폴더별로 관리하는 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[var(--background)] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[var(--text)]">
        <FolderProvider>{children}</FolderProvider>
      </body>
    </html>
  );
}
