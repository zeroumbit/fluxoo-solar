import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fluxoo Solar — Plataforma de Gestão Fotovoltaica",
  description: "Sistema integrado para integradores, engenheiros e revendedores de energia solar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50/50">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
