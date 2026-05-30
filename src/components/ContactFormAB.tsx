"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Send, Clock, CheckCircle2, Phone, Building2, User, Loader2, Search } from "lucide-react";
import { getFormConfig, trackEvent, getVariant, type FormVariantConfig } from "@/lib/ab-testing";
// Netlify Forms используется вместо CRM и email
// import { createLead } from "@/lib/crm";
// import { sendContactForm } from "@/lib/email";

interface ContactFormABProps {
  source?: string;
  className?: string;
  onSuccess?: () => void;
}

export const ContactFormAB = memo(function ContactFormAB({
  source = "Главная страница",
  className,
  onSuccess,
}: ContactFormABProps) {
  const [config, setConfig] = useState<FormVariantConfig | null>(null);
  const [variant, setVariant] = useState<string>("A");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    orgType: "" as "" | "ip" | "ooo",
    inn: "",
    companyName: "",
    email: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [companyFound, setCompanyFound] = useState(false);

  useEffect(() => {
    // Get A/B variant on client side
    const formConfig = getFormConfig();
    const variantId = getVariant("contactForm");
    setConfig(formConfig);
    setVariant(variantId);

    // Track impression
    trackEvent("contactForm", "impression");
  }, []);

  // Lookup company by INN
  const lookupCompany = useCallback(async (inn: string) => {
    const cleanInn = inn.replace(/\D/g, '');
    if (cleanInn.length !== 10 && cleanInn.length !== 12) return;

    setIsLookingUp(true);
    try {
      const response = await fetch('/api/inn-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inn: cleanInn }),
      });
      const data = await response.json();

      if (response.ok && data.success && data.company) {
        setCompanyFound(true);
        setFormData(prev => ({
          ...prev,
          companyName: data.company.name,
          orgType: data.company.type === 'INDIVIDUAL' ? 'ip' : 'ooo',
        }));
        toast.success(`Найдено: ${data.company.name}`);
      } else if (response.status === 404) {
        setCompanyFound(false);
        toast.error('Компания не найдена');
      }
    } catch (error) {
      console.error('Lookup error:', error);
    } finally {
      setIsLookingUp(false);
    }
  }, []);

  const handleInnChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, inn: cleanValue }));
    if (cleanValue.length < 10) {
      setCompanyFound(false);
      setFormData(prev => ({ ...prev, companyName: '' }));
    }
  };

  const handleInnBlur = () => {
    if (formData.inn.length === 10 || formData.inn.length === 12) {
      lookupCompany(formData.inn);
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.inn.trim() || !formData.orgType) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const innDigits = formData.inn.replace(/\D/g, '');
    if (formData.orgType === 'ip' && innDigits.length !== 12) {
      toast.error("ИНН ИП должен содержать 12 цифр");
      return;
    }
    if (formData.orgType === 'ooo' && innDigits.length !== 10) {
      toast.error("ИНН ООО должен содержать 10 цифр");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for Netlify Forms
      const netlifyFormData = new URLSearchParams();
      netlifyFormData.append("form-name", "contact");
      netlifyFormData.append("name", formData.name);
      netlifyFormData.append("phone", formData.phone);
      netlifyFormData.append("orgType", formData.orgType === 'ip' ? 'ИП' : 'ООО');
      netlifyFormData.append("inn", formData.inn);
      netlifyFormData.append("companyName", formData.companyName || '');
      netlifyFormData.append("email", formData.email || '');
      netlifyFormData.append("service", formData.service || '');
      netlifyFormData.append("message", formData.message || '');
      netlifyFormData.append("source", source);

      // Submit to Netlify Forms
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: netlifyFormData.toString(),
      });

      if (!response.ok) {
        throw new Error("Netlify form submission failed");
      }

      // Track conversion
      trackEvent("contactForm", "conversion", { service: formData.service });

      setIsSuccess(true);
      toast.success("Заявка отправлена! Мы перезвоним в течение 15 минут.");
      setFormData({ name: "", phone: "", orgType: "", inn: "", companyName: "", email: "", service: "", message: "" });
      setCompanyFound(false);
      onSuccess?.();

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Ошибка отправки. Попробуйте ещё раз или позвоните нам.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, source, onSuccess]);

  // Loading state
  if (!config) {
    return (
      <Card className={cn("border-2", className)}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded" />
            <div className="h-12 w-full bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <Card className={cn("border-2 border-green-200 bg-green-50", className)}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Заявка отправлена!</h3>
          <p className="text-green-700 mb-4">
            Наш специалист свяжется с вами в течение 15 минут.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Phone className="h-5 w-5" />
            <a href="tel:+79639639666" className="font-medium hover:underline">
              8 963 963 96 66
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Variant B - Compact form with urgency
  if (config.layout === "compact" && variant === "B") {
    return (
      <Card className={cn("border-2 border-green-200", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-green-700 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {config.title}
          </CardTitle>
          <CardDescription>{config.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ваше имя *</Label>
              <Input
                id="name"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 999-99-99"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="h-12 text-lg"
              />
            </div>
            {/* Organization Type Selector */}
            <div className="space-y-2">
              <Label>Тип организации *</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, orgType: 'ip', inn: '', companyName: '' })}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all h-12",
                    formData.orgType === 'ip' ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-primary/50"
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">ИП</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, orgType: 'ooo', inn: '', companyName: '' })}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all h-12",
                    formData.orgType === 'ooo' ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-primary/50"
                  )}
                >
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">ООО</span>
                </button>
              </div>
            </div>

            {formData.orgType && (
              <div className="space-y-2">
                <Label htmlFor="inn">
                  ИНН * <span className="text-xs text-muted-foreground">({formData.orgType === 'ip' ? '12 цифр' : '10 цифр'})</span>
                </Label>
                <div className="relative">
                  <Input
                    id="inn"
                    placeholder={formData.orgType === 'ip' ? '123456789012' : '1234567890'}
                    value={formData.inn}
                    onChange={(e) => handleInnChange(e.target.value)}
                    onBlur={handleInnBlur}
                    maxLength={formData.orgType === 'ip' ? 12 : 10}
                    required
                    className="h-12 pr-10"
                  />
                  {isLookingUp && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                  {!isLookingUp && companyFound && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />}
                  {!isLookingUp && !companyFound && formData.inn.length >= 10 && (
                    <button type="button" onClick={() => lookupCompany(formData.inn)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                      <Search className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {companyFound && formData.companyName && (
                  <p className="text-xs text-green-600 bg-green-50 p-2 rounded">✓ {formData.companyName}</p>
                )}
              </div>
            )}

            {config.urgencyText && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {config.urgencyText}
              </div>
            )}

            <Button
              type="submit"
              className={cn("w-full h-14 text-lg", config.buttonColor)}
              disabled={isSubmitting || !formData.orgType}
            >
              {isSubmitting ? (
                "Отправка..."
              ) : (
                <>
                  <Phone className="mr-2 h-5 w-5" />
                  {config.buttonText}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Variant C - Minimal form
  if (config.layout === "compact" && variant === "C") {
    return (
      <Card className={cn("border-2", className)}>
        <CardHeader>
          <CardTitle className="text-xl">{config.title}</CardTitle>
          <CardDescription>{config.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  placeholder="Иван"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 999 999 99 99"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Organization Type Selector */}
            <div className="space-y-2">
              <Label>Тип организации *</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, orgType: 'ip', inn: '', companyName: '' })}
                  className={cn(
                    "flex items-center justify-center gap-2 p-2 rounded-lg border-2 transition-all",
                    formData.orgType === 'ip' ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-primary/50"
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">ИП</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, orgType: 'ooo', inn: '', companyName: '' })}
                  className={cn(
                    "flex items-center justify-center gap-2 p-2 rounded-lg border-2 transition-all",
                    formData.orgType === 'ooo' ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-primary/50"
                  )}
                >
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">ООО</span>
                </button>
              </div>
            </div>

            {formData.orgType && (
              <div className="space-y-2">
                <Label htmlFor="inn">ИНН * <span className="text-xs text-muted-foreground">({formData.orgType === 'ip' ? '12 цифр' : '10 цифр'})</span></Label>
                <div className="relative">
                  <Input
                    id="inn"
                    placeholder={formData.orgType === 'ip' ? '123456789012' : '1234567890'}
                    value={formData.inn}
                    onChange={(e) => handleInnChange(e.target.value)}
                    onBlur={handleInnBlur}
                    maxLength={formData.orgType === 'ip' ? 12 : 10}
                    required
                    className="pr-10"
                  />
                  {isLookingUp && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                  {!isLookingUp && companyFound && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />}
                </div>
                {companyFound && formData.companyName && (
                  <p className="text-xs text-green-600 bg-green-50 p-2 rounded">✓ {formData.companyName}</p>
                )}
              </div>
            )}

            {config.showMessage && (
              <div className="space-y-2">
                <Label htmlFor="message">Вопрос (необязательно)</Label>
                <Textarea
                  id="message"
                  placeholder="Опишите вашу ситуацию..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={2}
                />
              </div>
            )}

            <Button
              type="submit"
              className={cn("w-full h-12", config.buttonColor)}
              disabled={isSubmitting || !formData.orgType}
            >
              {isSubmitting ? "Отправка..." : config.buttonText}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Нажимая кнопку, вы соглашаетесь с{" "}
              <Link href="/privacy" className="underline hover:text-primary">
                политикой конфиденциальности
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Variant A - Default full form
  return (
    <Card className={cn("border-2", className)}>
      <CardHeader>
        <CardTitle className="text-xl">{config.title}</CardTitle>
        <CardDescription>{config.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ваше имя *</Label>
            <Input
              id="name"
              placeholder="Иван Иванов"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 999-99-99"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          {/* Organization Type Selector */}
          <div className="space-y-2">
            <Label>Тип организации *</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, orgType: 'ip', inn: '', companyName: '' })}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all",
                  formData.orgType === 'ip' ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-primary/50"
                )}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">ИП</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, orgType: 'ooo', inn: '', companyName: '' })}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all",
                  formData.orgType === 'ooo' ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-primary/50"
                )}
              >
                <Building2 className="h-5 w-5" />
                <span className="font-medium">ООО</span>
              </button>
            </div>
          </div>

          {formData.orgType && (
            <div className="space-y-2">
              <Label htmlFor="inn">
                ИНН * <span className="text-xs text-muted-foreground">({formData.orgType === 'ip' ? '12 цифр' : '10 цифр'})</span>
              </Label>
              <div className="relative">
                <Input
                  id="inn"
                  placeholder={formData.orgType === 'ip' ? '123456789012' : '1234567890'}
                  value={formData.inn}
                  onChange={(e) => handleInnChange(e.target.value)}
                  onBlur={handleInnBlur}
                  maxLength={formData.orgType === 'ip' ? 12 : 10}
                  required
                  className="pr-10"
                />
                {isLookingUp && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                {!isLookingUp && companyFound && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />}
                {!isLookingUp && !companyFound && formData.inn.length >= 10 && (
                  <button type="button" onClick={() => lookupCompany(formData.inn)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                    <Search className="h-4 w-4" />
                  </button>
                )}
              </div>
              {companyFound && formData.companyName && (
                <p className="text-xs text-green-600 bg-green-50 p-2 rounded">✓ {formData.companyName}</p>
              )}
            </div>
          )}

          {config.showEmail && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.ru"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          )}

          {config.showService && (
            <div className="space-y-2">
              <Label htmlFor="service">Интересующая услуга</Label>
              <select
                id="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Выберите услугу</option>
                <option value="accounting">Ведение бухгалтерского учёта</option>
                <option value="zero">Нулевая отчётность</option>
                <option value="registration">Регистрация ИП/ООО</option>
                <option value="liquidation">Ликвидация ИП/ООО</option>
                <option value="account">Открытие расчётного счёта</option>
                <option value="hr">Кадровый учёт</option>
                <option value="1c">1С программирование</option>
                <option value="consultation">Консультация</option>
                <option value="other">Другое</option>
              </select>
            </div>
          )}

          {config.showMessage && (
            <div className="space-y-2">
              <Label htmlFor="message">Сообщение</Label>
              <Textarea
                id="message"
                placeholder="Опишите вашу ситуацию или задайте вопрос"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
              />
            </div>
          )}

          <Button
            type="submit"
            className={cn("w-full", config.buttonColor)}
            size="lg"
            disabled={isSubmitting || !formData.orgType}
          >
            {isSubmitting ? (
              "Отправка..."
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                {config.buttonText}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Нажимая кнопку, вы соглашаетесь с{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              политикой конфиденциальности
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
});
