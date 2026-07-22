import type { Metadata } from "next";
import { PT_Mono, Questrial } from "next/font/google";

import { Providers } from "@/shared/components/providers";

import "./global.css";

const questrial = Questrial({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-questrial",
});

const ptMono = PT_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pt-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Financial App",
    template: "%s | Financial App",
  },
  description: "Controle de orçamento e gastos anuais",
  icons: {
    icon: { url: "/icon.png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${questrial.variable} ${ptMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
