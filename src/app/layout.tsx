import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Av. Emrecan Sayret | Hukuk Bürosu",
  description: "Av. Emrecan Sayret Hukuk Bürosu resmi web sitesi",
  verification: {
    google: "Y6xlbebs1Rgrg54dkCvaT4mL4Gst3Nry0BLb89yPHBo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased min-h-screen font-inter">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
