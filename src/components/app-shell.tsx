"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, LayoutDashboard, ShieldCheck, Wallet } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/movimentacoes", label: "Movimentações", Icon: ArrowLeftRight },
];

export function AppShell({ children, demo = false }: { children: React.ReactNode; demo?: boolean }) {
  const pathname = usePathname();
  return <div className="app-shell">
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
    <aside className="sidebar">
      <Link className="brand" href="/" aria-label="Meu Controle, início">
        <span className="brand-icon"><Wallet size={21} strokeWidth={2.1} /></span>
        <span>Meu Controle<span className="brand-dot">.</span><small>Finanças pessoais</small></span>
      </Link>
      <nav aria-label="Navegação principal">
        <p className="nav-heading">ESPAÇO PESSOAL</p>
        {links.map(({ href, label, Icon }) =>
          <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
            <Icon size={19} strokeWidth={1.8} />{label}
          </Link>,
        )}
      </nav>
      <div className="sidebar-footer">
        <span className="footer-icon"><ShieldCheck size={17} /></span>
        <div><strong>{demo ? "Modo demonstração" : "Modo local"}</strong><small>{demo ? "Dados de exemplo neste navegador" : "Seus dados neste dispositivo"}</small></div>
      </div>
    </aside>
    <main id="conteudo" className="main-content" tabIndex={-1}>{children}</main>
  </div>;
}
