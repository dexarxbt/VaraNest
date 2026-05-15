import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/contexts/providers";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "VARANEST",
  description: "Autonomous capability trials for Vara agents."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
