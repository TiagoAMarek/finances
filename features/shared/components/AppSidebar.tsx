"use client";

import {
  Activity,
  Banknote,
  CreditCard,
  Home,
  LogOut,
  PieChart,
  Receipt,
  Settings,
  Tag,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Avatar,
  AvatarFallback,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/features/shared/components/ui";

const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Contas Bancárias",
    href: "/accounts",
    icon: Banknote,
  },
  {
    name: "Cartões de Crédito",
    href: "/credit_cards",
    icon: CreditCard,
  },
  {
    name: "Categorias",
    href: "/categories",
    icon: Tag,
  },
  {
    name: "Lançamentos",
    href: "/transactions",
    icon: Receipt,
  },
];

const reportLinks = [
  {
    name: "Análise de Gastos",
    href: "/reports/expense-analysis",
    icon: PieChart,
  },
  {
    name: "Performance Mensal",
    href: "/reports/performance",
    icon: Activity,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Banknote className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Finanças Pessoais
                  </span>
                  <span className="truncate text-xs">Gerenciamento</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <SidebarMenuItem key={link.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={link.name}
                    >
                      <Link href={link.href}>
                        <Icon className="size-4" />
                        <span>{link.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Relatórios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <SidebarMenuItem key={link.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={link.name}
                    >
                      <Link href={link.href}>
                        <Icon className="size-4" />
                        <span>{link.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Configurações">
              <Link href="/settings">
                <Settings className="size-4" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Usuário</span>
                  <span className="truncate text-xs">user@example.com</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sair" onClick={handleLogout}>
              <LogOut className="size-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
