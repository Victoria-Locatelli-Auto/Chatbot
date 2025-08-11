"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LogIn, Truck, Calendar, Store, Gift, Home } from "lucide-react";
import { useEffect, useState } from "react";

function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: any }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 ${
        active ? "text-brand" : "text-gray-700"
      }`}
    >
      <Icon size={18} /> {label}
    </Link>
  );
}

export function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUserName(data?.user?.name ?? null))
      .catch(() => setUserName(null));
  }, []);

  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-1 text-brand">
          <Truck />
          <span className="text-lg font-semibold">Scania Revisões</span>
        </div>
        <nav className="flex items-center gap-1">
          <NavLink href="/" label="Início" icon={Home} />
          <NavLink href="/agendamentos" label="Agendamentos" icon={Calendar} />
          <NavLink href="/caminhoes" label="Caminhões" icon={Truck} />
          <NavLink href="/concessionarias" label="Concessionárias" icon={Store} />
          <NavLink href="/brindes" label="Brindes" icon={Gift} />
        </nav>
        <div className="flex items-center gap-3">
          {userName ? (
            <>
              <span className="text-sm text-gray-600">Olá, {userName}</span>
              <form action="/api/logout" method="post">
                <button className="btn" type="submit" title="Sair">
                  <LogOut size={16} />
                </button>
              </form>
            </>
          ) : (
            <Link className="btn" href="/login" title="Entrar">
              <LogIn size={16} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}