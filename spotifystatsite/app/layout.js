//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

//const geistSans = Geist({
 // variable: "--font-geist-sans",
 // subsets: ["latin"],
//});

//const geistMono = Geist_Mono({
  //variable: "--font-geist-mono",
 // subsets: ["latin"],
//});

export const metadata = {
  title: "Spotify Stats Dashboard",
  description: "View your Spotify listening statistics - most played songs, artists, and genres",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black">
        <main>{children}</main>
      </body>
    </html>
  );
}
