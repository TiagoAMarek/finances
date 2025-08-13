"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Menu,
  Home,
  CreditCard,
  Receipt,
  TrendingUp,
  Banknote,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const navLinks = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home
    },
    {
      name: 'Contas Bancárias',
      href: '/accounts',
      icon: Banknote
    },
    {
      name: 'Cartões de Crédito',
      href: '/credit_cards',
      icon: CreditCard
    },
    {
      name: 'Lançamentos',
      href: '/transactions',
      icon: Receipt
    },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-14 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Banknote className="h-6 w-6 text-primary" />
          <span>Finanças Pessoais</span>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-auto p-4">
        <nav className="space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <Separator />

      {/* User Section */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-sm">
            <div className="font-medium">Usuário</div>
            <div className="text-xs text-muted-foreground">
              Gerenciar conta
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="mt-2 w-full justify-start gap-3 text-sm font-medium"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-background md:block md:w-64">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Banknote className="h-6 w-6 text-primary" />
            <span>Finanças</span>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
