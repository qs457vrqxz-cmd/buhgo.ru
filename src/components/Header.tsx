"use client";

import Link from "next/link";
import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  Menu,
  ChevronDown,
  User,
  FileText,
  Calculator,
  Building2,
  Users,
  MessageSquare,
  FileCheck,
  Briefcase,
  Code,
  LogOut,
  Settings,
  LayoutDashboard,
} from "lucide-react";

// Lazy load heavy dropdown components
const Sheet = dynamic(() => import("@/components/ui/sheet").then((mod) => mod.Sheet), {
  ssr: false,
});
const SheetContent = dynamic(() => import("@/components/ui/sheet").then((mod) => mod.SheetContent), {
  ssr: false,
});
const SheetTrigger = dynamic(() => import("@/components/ui/sheet").then((mod) => mod.SheetTrigger), {
  ssr: false,
});
const DropdownMenu = dynamic(() => import("@/components/ui/dropdown-menu").then((mod) => mod.DropdownMenu), {
  ssr: false,
});
const DropdownMenuContent = dynamic(() => import("@/components/ui/dropdown-menu").then((mod) => mod.DropdownMenuContent), {
  ssr: false,
});
const DropdownMenuItem = dynamic(() => import("@/components/ui/dropdown-menu").then((mod) => mod.DropdownMenuItem), {
  ssr: false,
});
const DropdownMenuSeparator = dynamic(() => import("@/components/ui/dropdown-menu").then((mod) => mod.DropdownMenuSeparator), {
  ssr: false,
});
const DropdownMenuTrigger = dynamic(() => import("@/components/ui/dropdown-menu").then((mod) => mod.DropdownMenuTrigger), {
  ssr: false,
});

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

const services = [
  { name: "Ведение бухгалтерского учёта", href: "/uslugi/vedenie-buhucheta", icon: FileText, price: "от 10 000 руб/мес" },
  { name: "Нулевая отчётность", href: "/uslugi/nulevaya-otchetnost", icon: FileCheck, price: "от 5 000 руб/мес" },
  { name: "Регистрация ИП/ООО", href: "/uslugi/registraciya", icon: Building2, price: "от 0 руб" },
  { name: "Ликвидация ИП/ООО", href: "/uslugi/likvidaciya", icon: Briefcase, price: "по запросу" },
  { name: "Банкротство бизнеса", href: "/uslugi/bankrotstvo", icon: Briefcase, price: "по запросу" },
  { name: "Открытие расчётного счёта", href: "/uslugi/raschetny-schet", icon: Calculator, price: "бесплатно" },
  { name: "Кадровый учёт", href: "/uslugi/kadrovyj-uchet", icon: Users, price: "по запросу" },
  { name: "Консультации", href: "/uslugi/konsultacii", icon: MessageSquare, price: "5 000 руб" },
  { name: "1С программирование", href: "/uslugi/1c", icon: Code, price: "по запросу" },
];

// Memoized top bar component
const TopBar = memo(function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground py-2">
      <div className="container mx-auto px-4 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="tel:+79639639666" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Phone className="h-4 w-4" />
            <span className="font-medium text-xs sm:text-sm">8 963 963 96 66</span>
          </a>
          <a href="mailto:info@buhgalter.tech" className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Mail className="h-4 w-4" />
            <span>info@buhgalter.tech</span>
          </a>
        </div>
        <div className="text-xs sm:text-sm opacity-90">
          Пн-Пт: 09:00 - 17:00
        </div>
      </div>
    </div>
  );
});

// Memoized logo component
const Logo = memo(function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={true}>
      <div className="flex items-center">
        <span className="text-xl sm:text-2xl font-bold text-primary">Buh</span>
        <span className="text-xl sm:text-2xl font-bold text-secondary">Go</span>
      </div>
    </Link>
  );
});

export const Header = memo(function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Вы вышли из системы");
    router.push("/");
  }, [router]);

  const getDashboardLink = useMemo(() => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "accountant":
        return "/accountant";
      default:
        return "/dashboard";
    }
  }, [user]);

  const getRoleLabel = useMemo(() => {
    if (!user) return "";
    switch (user.role) {
      case "admin":
        return "Администратор";
      case "accountant":
        return "Бухгалтер";
      case "client":
        return "Клиент";
      default:
        return "Пользователь";
    }
  }, [user]);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <TopBar />

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors" prefetch={true}>
              Главная
            </Link>

            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                  Услуги <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  {services.map((service) => (
                    <DropdownMenuItem key={service.href} asChild>
                      <Link href={service.href} className="flex items-center justify-between w-full p-3" prefetch={false}>
                        <div className="flex items-center gap-3">
                          <service.icon className="h-5 w-5 text-primary" />
                          <span>{service.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{service.price}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors" prefetch={false}>
              Обо мне
            </Link>
            {/* Блог временно скрыт
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors" prefetch={false}>
              Блог
            </Link>
            */}
            <Link href="/integrations" className="text-sm font-medium hover:text-primary transition-colors" prefetch={false}>
              Партнёры
            </Link>
            <Link href="/contacts" className="text-sm font-medium hover:text-primary transition-colors" prefetch={false}>
              Контакты
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Личный кабинет временно скрыт
            {mounted && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{getRoleLabel}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink} className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Личный кабинет
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Админ-панель
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login" prefetch={false}>
                  <User className="h-4 w-4 mr-2" />
                  Войти
                </Link>
              </Button>
            )}
            */}
            <Button asChild className="bg-secondary hover:bg-secondary/90">
              <Link href="/contacts#form" prefetch={false}>Оставить заявку</Link>
            </Button>
          </div>

          {/* Mobile menu */}
          {mounted && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Открыть меню">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <div className="flex flex-col gap-6 mt-6">
                  {/* Блок пользователя временно скрыт
                  {user && (
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{getRoleLabel}</p>
                      </div>
                    </div>
                  )}
                  */}

                  <Link href="/" onClick={closeMenu} className="text-lg font-medium hover:text-primary">
                    Главная
                  </Link>

                  <div className="space-y-3">
                    <p className="text-lg font-medium">Услуги</p>
                    <div className="pl-4 space-y-2">
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={closeMenu}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                        >
                          <service.icon className="h-4 w-4" />
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link href="/about" onClick={closeMenu} className="text-lg font-medium hover:text-primary">
                    Обо мне
                  </Link>
                  {/* Блог временно скрыт
                  <Link href="/blog" onClick={closeMenu} className="text-lg font-medium hover:text-primary">
                    Блог
                  </Link>
                  */}
                  <Link href="/integrations" onClick={closeMenu} className="text-lg font-medium hover:text-primary">
                    Партнёры
                  </Link>
                  <Link href="/contacts" onClick={closeMenu} className="text-lg font-medium hover:text-primary">
                    Контакты
                  </Link>

                  <div className="border-t pt-6 space-y-3">
                    {/* Личный кабинет временно скрыт
                    {user ? (
                      <>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={getDashboardLink} onClick={closeMenu}>
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Личный кабинет
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-destructive"
                          onClick={() => {
                            handleLogout();
                            closeMenu();
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Выйти
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" onClick={closeMenu}>
                          <User className="h-4 w-4 mr-2" />
                          Войти
                        </Link>
                      </Button>
                    )}
                    */}
                    <Button className="w-full bg-secondary hover:bg-secondary/90" asChild>
                      <Link href="/contacts#form" onClick={closeMenu}>
                        Оставить заявку
                      </Link>
                    </Button>
                  </div>

                  <div className="border-t pt-6 space-y-2 text-sm text-muted-foreground">
                    <a href="tel:+79639639666" className="flex items-center gap-2 hover:text-primary">
                      <Phone className="h-4 w-4" />
                      8 963 963 96 66
                    </a>
                    <a href="mailto:info@buhgalter.tech" className="flex items-center gap-2 hover:text-primary">
                      <Mail className="h-4 w-4" />
                      info@buhgalter.tech
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
});
