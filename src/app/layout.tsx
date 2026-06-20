import type { Metadata, Viewport } from "next";
import { Stalinist_One, Oswald, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const stalinistOne = Stalinist_One({
  variable: "--font-stalinist",
  weight: "400",
  subsets: ["cyrillic", "latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FUN CREATION — Тениски, Принт он Демонд и 3D Печат",
  description:
    "FUN CREATION е онлайн магазин в рокендрол дух: тениски с Възрожденци, царе и художници, персонализиран принт он демонд (чаши, шапки, ключодържатели) и 3D печат на поръчка.",
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bg"
      className={`${stalinistOne.variable} ${oswald.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-grit min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
