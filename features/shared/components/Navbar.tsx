"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Contas", href: "/accounts" },
    { name: "Cartões", href: "/credit_cards" },
    { name: "Transações", href: "/transactions" },
    { name: "Resumo Mensal", href: "/monthly_overview" },
  ];

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="text-2xl font-bold" href="/dashboard">
          Finanças Pessoais
        </Link>
        <div className="flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === link.href ? "bg-gray-900" : "hover:bg-gray-700"}`}
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
          <button
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
