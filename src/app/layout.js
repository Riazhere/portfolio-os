import "./globals.css";
import { Space_Mono, Inter } from "next/font/google";
import CustomCursor from "../components/CustomCursor";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Riaz Ijaz - Computer Scientist & Software Engineer",
  description: "Deep learning and full-stack developer. Projects, stack and contact.",
  themeColor: "#020807",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} ${inter.variable} bg-os-bg text-os-textMain font-mono antialiased selection:bg-os-accent selection:text-os-bg`}>
        <div className="bg-noise" />
        <CustomCursor />
        <main className="px-6 md:px-14 lg:px-20 xl:px-28 max-w-7xl mx-auto relative">{children}</main>
      </body>
    </html>
  );
}