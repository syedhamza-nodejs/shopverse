import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SettingsLoader from "@/components/SettingsLoader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: {
    default: "ShopVerse — Luxury Shopping, Delivered",
    template: "%s | ShopVerse",
  },
  description:
    "ShopVerse — a premium multi-category online store. Curated electronics, fashion, home, beauty and more with worldwide delivery.",
  keywords: ["luxury shopping", "ecommerce", "premium store", "online shopping", "Pakistan"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <SettingsLoader />
        <AnnouncementBar />
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
