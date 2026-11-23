import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "إدارة شؤون المجندين - إدارة قوات أمن جنوب سيناء",
  description: "المنظومة الإلكترونية لإدارة شؤون المجندين والسجلات الطبية والإدارية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-[#0b1c30] antialiased">
        <Header />
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
        <div className="pr-64">
          <main className="pt-16 min-h-screen px-6 py-8">
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </main>
        </div>
      </body>
    </html>
  );
}


