import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: { default: "Meu Controle", template: "%s | Meu Controle" },
  description: "Receitas, despesas e saldo do mês em um só lugar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><AppShell>{children}</AppShell></body></html>;
}
