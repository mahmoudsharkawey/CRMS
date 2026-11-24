import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { NavProvider } from "@/components/layout/nav-context";

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
        <NavProvider>
          <Header />
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
          <div className="pr-0 lg:pr-64 transition-all duration-300">
            <main className="pt-16 min-h-screen px-3 sm:px-6 py-4 sm:py-8">
              <Suspense fallback={null}>
                {children}
              </Suspense>
            </main>
          </div>
        </NavProvider>
      </body>
    </html>
  );
}


