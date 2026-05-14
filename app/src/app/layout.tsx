import type { Metadata } from "next";
import { Bebas_Neue, Figtree, IBM_Plex_Mono, Syne } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/contexts/providers";
import { Shell } from "@/components/shell";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas"
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono"
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree"
});

export const metadata: Metadata = {
  title: "VARANEST",
  description: "Autonomous capability trials for Vara agents."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${syne.variable} ${plexMono.variable} ${figtree.variable}`}>
      <body className="font-figtree">
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}

