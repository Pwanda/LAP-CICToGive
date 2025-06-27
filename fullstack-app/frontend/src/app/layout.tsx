import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CIC to Give",
  description: "A platform for giving items away for free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
