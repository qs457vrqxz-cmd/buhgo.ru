"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState("");

  // Check for inactivity logout message and clear old session
  useEffect(() => {
    // Clear old session data to ensure fresh login
    localStorage.removeItem("user");

    const reason = searchParams.get("reason");
    if (reason === "inactivity") {
      toast.info("Вы были автоматически выведены из системы из-за неактивности", {
        duration: 5000,
      });
    }
    if (reason === "clear") {
      toast.success("Сессия очищена. Войдите снова.");
    }
  }, [searchParams]);

  // Load saved email if "remember me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedRememberMe = localStorage.getItem("rememberMe");
    if (savedRememberMe === "true" && savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Auth error:", error);
        toast.error("Неверный email или пароль");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Get user profile with role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
        }

        const userRole = profile?.role || "client";
        const userName = profile?.name || data.user.email?.split("@")[0] || "Пользователь";

        // Save to localStorage for compatibility
        localStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: userName,
          role: userRole,
        }));

        // Handle "Remember Me"
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedEmail");
        }

        // Set redirect target for UI
        let targetUrl = "/dashboard";
        let targetName = "личный кабинет";
        if (userRole === "admin") {
          targetUrl = "/admin";
          targetName = "панель администратора";
        } else if (userRole === "accountant") {
          targetUrl = "/accountant";
          targetName = "кабинет бухгалтера";
        }

        setRedirectTarget(targetName);
        setIsRedirecting(true);
        setIsLoading(false);

        toast.success(`Добро пожаловать, ${userName.split(" ")[0]}!`);

        // Redirect with delay to show the redirecting state
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 1000);
        return;
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Ошибка входа. Попробуйте ещё раз.");
    }

    setIsLoading(false);
  };

  // Show redirecting screen
  if (isRedirecting) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Вход выполнен успешно!</h3>
                  <p className="text-muted-foreground">
                    Перенаправление в {redirectTarget}...
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full animate-pulse" style={{ width: '100%', animation: 'loading 1s ease-in-out' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
        <style jsx>{`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Вход в личный кабинет</CardTitle>
            <CardDescription>
              Введите данные для входа в систему
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Забыли пароль?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Введите пароль"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  disabled={isLoading}
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer select-none">
                  Запомнить меня
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Вход...
                  </>
                ) : (
                  "Войти"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Нет аккаунта? </span>
              <Link href="/register" className="text-primary hover:underline font-medium">
                Зарегистрироваться
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </>
  );
}
