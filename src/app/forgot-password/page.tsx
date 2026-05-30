"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  Send,
} from "lucide-react";
import {
  generateRecoveryCode,
  saveRecoveryCode,
  verifyRecoveryCode,
  createRecoveryEmail,
  createNewPasswordEmail,
  sendEmail,
  generatePassword,
  savePassword,
} from "@/lib/email";
import { getAccountants, getClients } from "@/lib/users";

type Step = "email" | "code" | "password" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [generatedCode, setGeneratedCode] = useState("");

  // Countdown for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Check if email exists in system (via Supabase API)
  const checkEmailExists = async (emailToCheck: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCheck }),
      });

      if (!response.ok) return false;

      const result = await response.json();
      return result.exists === true;
    } catch {
      // Fallback to local check
      const emailLower = emailToCheck.toLowerCase();
      if (emailLower === "admin@buhgalter.tech") return true;

      const accountants = getAccountants();
      if (accountants.some(a => a.email.toLowerCase() === emailLower)) return true;

      const clients = getClients();
      if (clients.some(c => c.email.toLowerCase() === emailLower)) return true;

      return false;
    }
  };

  // Step 1: Send recovery code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email
    if (!email || !email.includes("@")) {
      toast.error("Введите корректный email");
      setIsLoading(false);
      return;
    }

    // Check if email exists
    const emailExists = await checkEmailExists(email);
    if (!emailExists) {
      toast.error("Аккаунт с таким email не найден");
      setIsLoading(false);
      return;
    }

    // Generate and save code
    const recoveryCode = generateRecoveryCode();
    setGeneratedCode(recoveryCode);
    saveRecoveryCode(email, recoveryCode);

    // Create and send email
    const emailTemplate = createRecoveryEmail(email, recoveryCode);
    await sendEmail(emailTemplate);

    // In demo mode, show code in toast
    toast.success(
      <div className="space-y-1">
        <p>Код отправлен на {email}</p>
        <p className="text-xs text-muted-foreground">
          Демо-режим: ваш код <strong>{recoveryCode}</strong>
        </p>
      </div>,
      { duration: 10000 }
    );

    setCountdown(60);
    setStep("code");
    setIsLoading(false);
  };

  // Resend code
  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    const recoveryCode = generateRecoveryCode();
    setGeneratedCode(recoveryCode);
    saveRecoveryCode(email, recoveryCode);

    const emailTemplate = createRecoveryEmail(email, recoveryCode);
    await sendEmail(emailTemplate);

    toast.success(
      <div className="space-y-1">
        <p>Новый код отправлен</p>
        <p className="text-xs text-muted-foreground">
          Демо-режим: ваш код <strong>{recoveryCode}</strong>
        </p>
      </div>,
      { duration: 10000 }
    );

    setCountdown(60);
    setIsLoading(false);
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (code.length !== 6) {
      toast.error("Код должен содержать 6 цифр");
      setIsLoading(false);
      return;
    }

    // Verify code
    const isValid = verifyRecoveryCode(email, code);

    if (!isValid) {
      toast.error("Неверный или истёкший код");
      setIsLoading(false);
      return;
    }

    toast.success("Код подтверждён");
    setStep("password");
    setIsLoading(false);
  };

  // Step 3: Set new password
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords
    if (newPassword.length < 6) {
      toast.error("Пароль должен содержать минимум 6 символов");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      // Update password in Supabase
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error || 'Ошибка обновления пароля');
        setIsLoading(false);
        return;
      }

      // Also save locally for backward compatibility
      savePassword(email, newPassword);

      // Send confirmation email
      const emailTemplate = createNewPasswordEmail(email, newPassword);
      await sendEmail(emailTemplate);

      toast.success("Пароль успешно изменён!");
      setStep("success");
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error("Ошибка обновления пароля");
    }

    setIsLoading(false);
  };

  // Generate random password
  const handleGeneratePassword = () => {
    const password = generatePassword(10);
    setNewPassword(password);
    setConfirmPassword(password);
    setShowPassword(true);
    toast.success("Сгенерирован надёжный пароль");
  };

  return (
    <>
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          {step === "email" && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <KeyRound className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Восстановление пароля</CardTitle>
                <CardDescription>
                  Введите email, указанный при регистрации
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@mail.ru"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Получить код
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Вернуться ко входу
                  </Link>
                </div>
              </CardContent>
            </>
          )}

          {step === "code" && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Введите код</CardTitle>
                <CardDescription>
                  Мы отправили 6-значный код на {email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Код подтверждения</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="000000"
                      value={code}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setCode(value);
                      }}
                      className="text-center text-2xl tracking-[0.5em] font-mono"
                      maxLength={6}
                      required
                      autoFocus
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Проверка...
                      </>
                    ) : (
                      "Подтвердить"
                    )}
                  </Button>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Отправить повторно через {countdown} сек.
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-sm text-primary hover:underline"
                        disabled={isLoading}
                      >
                        Отправить код повторно
                      </button>
                    )}
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setStep("email");
                      setCode("");
                    }}
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Изменить email
                  </button>
                </div>
              </CardContent>
            </>
          )}

          {step === "password" && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Новый пароль</CardTitle>
                <CardDescription>
                  Придумайте надёжный пароль для аккаунта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="newPassword">Новый пароль</Label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="text-xs text-primary hover:underline"
                      >
                        Сгенерировать
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Минимум 6 символов"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Повторите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-destructive">Пароли не совпадают</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || newPassword.length < 6 || newPassword !== confirmPassword}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      "Сохранить пароль"
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {step === "success" && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Пароль изменён!</CardTitle>
                <CardDescription>
                  Теперь вы можете войти с новым паролем
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{email}</p>
                  </div>

                  <Button asChild className="w-full">
                    <Link href="/login">
                      Войти в личный кабинет
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </main>

      <Footer />
    </>
  );
}
