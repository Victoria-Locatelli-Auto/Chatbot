import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Scania Revisões",
  description: "Agendamento de revisões com programa de pontos e brindes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}