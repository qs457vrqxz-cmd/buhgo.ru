"use client";

import { useState, useMemo, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Calculator as CalculatorIcon,
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Phone,
} from "lucide-react";

type BusinessType = "ip" | "ooo";
type TaxSystem = "usn" | "usn_nds" | "osn" | "patent";
type TurnoverLevel = "zero" | "with_turnover";
type EmployeeLevel = "none" | "with_employees";

interface PriceConfig {
  base: number;
  withTurnover: number;
  withEmployees: number;
}

// Pricing matrix based on business type and tax system
const pricingMatrix: Record<BusinessType, Record<string, PriceConfig>> = {
  ip: {
    usn: {
      base: 5000,
      withTurnover: 10000,
      withEmployees: 15000,
    },
    patent: {
      base: 5000,
      withTurnover: 10000,
      withEmployees: 15000,
    },
    usn_nds: {
      base: 5000,
      withTurnover: 15000,
      withEmployees: 20000,
    },
  },
  ooo: {
    usn: {
      base: 10000,
      withTurnover: 15000,
      withEmployees: 25000,
    },
    usn_nds: {
      base: 10000,
      withTurnover: 20000,
      withEmployees: 25000,
    },
    osn: {
      base: 10000,
      withTurnover: 20000,
      withEmployees: 25000,
    },
  },
};

// What's included in the price
const includedFeatures = [
  "Ведение бухгалтерского учёта",
  "Сдача отчётности в ФНС, СФР, РОССТАТ",
  "Консультации по налогам",
  "Расчёт налогов и взносов",
  "Формирование платёжных поручений",
  "Подготовка первичных документов",
];

const additionalFeatures = [
  "Кадровый учёт (при наличии сотрудников)",
  "Расчёт заработной платы",
  "Сдача отчётности за сотрудников",
];

export const Calculator = memo(function Calculator() {
  const [businessType, setBusinessType] = useState<BusinessType>("ip");
  const [taxSystem, setTaxSystem] = useState<TaxSystem>("usn");
  const [hasTurnover, setHasTurnover] = useState<TurnoverLevel>("zero");
  const [hasEmployees, setHasEmployees] = useState<EmployeeLevel>("none");
  const [employeeCount, setEmployeeCount] = useState(1);

  // Get available tax systems based on business type
  const availableTaxSystems = useMemo(() => {
    if (businessType === "ip") {
      return [
        { value: "usn", label: "УСН" },
        { value: "patent", label: "Патент" },
        { value: "usn_nds", label: "УСН + НДС" },
      ];
    }
    return [
      { value: "usn", label: "УСН" },
      { value: "usn_nds", label: "УСН + НДС" },
      { value: "osn", label: "ОСН" },
    ];
  }, [businessType]);

  // Reset tax system when business type changes
  const handleBusinessTypeChange = (value: BusinessType) => {
    setBusinessType(value);
    if (value === "ooo" && (taxSystem === "patent")) {
      setTaxSystem("usn");
    }
  };

  // Calculate price based on selections
  const calculatedPrice = useMemo(() => {
    const taxKey = taxSystem === "patent" ? "usn" : taxSystem;
    const config = pricingMatrix[businessType][taxKey];

    if (!config) {
      return pricingMatrix[businessType]["usn"];
    }

    if (hasEmployees === "with_employees") {
      return config.withEmployees;
    }
    if (hasTurnover === "with_turnover") {
      return config.withTurnover;
    }
    return config.base;
  }, [businessType, taxSystem, hasTurnover, hasEmployees]);

  // Get description based on current selection
  const getDescription = () => {
    const typeLabel = businessType === "ip" ? "ИП" : "ООО";
    let taxLabel = "";

    switch (taxSystem) {
      case "usn":
        taxLabel = "УСН";
        break;
      case "patent":
        taxLabel = "Патент";
        break;
      case "usn_nds":
        taxLabel = "УСН + НДС";
        break;
      case "osn":
        taxLabel = "ОСН";
        break;
    }

    let details = "";
    if (hasEmployees === "with_employees") {
      details = `, ${employeeCount} сотрудник${employeeCount > 1 ? (employeeCount > 4 ? "ов" : "а") : ""}`;
    } else if (hasTurnover === "with_turnover") {
      details = ", с оборотом";
    } else {
      details = ", нулевая отчётность";
    }

    return `${typeLabel} на ${taxLabel}${details}`;
  };

  return (
    <Card className="border-2 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <CalculatorIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Калькулятор стоимости</CardTitle>
            <CardDescription>Рассчитайте стоимость бухгалтерского обслуживания</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Business Type */}
        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Форма бизнеса
          </Label>
          <RadioGroup
            value={businessType}
            onValueChange={(v: string) => handleBusinessTypeChange(v as BusinessType)}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="ip"
              className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                businessType === "ip"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value="ip" id="ip" className="sr-only" />
              <span className="font-medium">ИП</span>
            </Label>
            <Label
              htmlFor="ooo"
              className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                businessType === "ooo"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value="ooo" id="ooo" className="sr-only" />
              <span className="font-medium">ООО</span>
            </Label>
          </RadioGroup>
        </div>

        {/* Tax System */}
        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Система налогообложения
          </Label>
          <RadioGroup
            value={taxSystem}
            onValueChange={(v: string) => setTaxSystem(v as TaxSystem)}
            className="grid grid-cols-3 gap-3"
          >
            {availableTaxSystems.map((tax) => (
              <Label
                key={tax.value}
                htmlFor={tax.value}
                className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                  taxSystem === tax.value
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value={tax.value} id={tax.value} className="sr-only" />
                <span className="font-medium text-sm">{tax.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Turnover */}
        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Наличие оборота
          </Label>
          <RadioGroup
            value={hasTurnover}
            onValueChange={(v: string) => {
              setHasTurnover(v as TurnoverLevel);
              if (v === "zero") {
                setHasEmployees("none");
              }
            }}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="zero"
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                hasTurnover === "zero"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value="zero" id="zero" className="sr-only" />
              <span className="font-medium">Нулевой оборот</span>
              <span className="text-xs text-muted-foreground">Нет деятельности</span>
            </Label>
            <Label
              htmlFor="with_turnover"
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                hasTurnover === "with_turnover"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value="with_turnover" id="with_turnover" className="sr-only" />
              <span className="font-medium">Есть оборот</span>
              <span className="text-xs text-muted-foreground">Активная деятельность</span>
            </Label>
          </RadioGroup>
        </div>

        {/* Employees */}
        {hasTurnover === "with_turnover" && (
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Сотрудники
            </Label>
            <RadioGroup
              value={hasEmployees}
              onValueChange={(v: string) => setHasEmployees(v as EmployeeLevel)}
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="none"
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  hasEmployees === "none"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="none" id="none" className="sr-only" />
                <span className="font-medium">Без сотрудников</span>
                <span className="text-xs text-muted-foreground">Только собственник</span>
              </Label>
              <Label
                htmlFor="with_employees"
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  hasEmployees === "with_employees"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="with_employees" id="with_employees" className="sr-only" />
                <span className="font-medium">Есть сотрудники</span>
                <span className="text-xs text-muted-foreground">1-3 человека</span>
              </Label>
            </RadioGroup>

            {/* Employee count slider */}
            {hasEmployees === "with_employees" && (
              <div className="pt-4 px-2">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Количество сотрудников</span>
                  <Badge variant="outline">{employeeCount}</Badge>
                </div>
                <Slider
                  value={[employeeCount]}
                  onValueChange={(v: number[]) => setEmployeeCount(v[0])}
                  min={1}
                  max={3}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mt-6">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-1">{getDescription()}</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-primary">
                {calculatedPrice.toLocaleString("ru-RU")}
              </span>
              <span className="text-lg text-muted-foreground">руб/мес</span>
            </div>
          </div>

          {/* Included features */}
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-center">Что входит в стоимость:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {hasEmployees === "with_employees" && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-2 border-t mt-2">
                {additionalFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-secondary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 bg-secondary hover:bg-secondary/90">
              <Link href="/contacts#form">
                Оставить заявку
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a href="tel:+79639639666">
                <Phone className="mr-2 h-4 w-4" />
                Позвонить
              </a>
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          * Окончательная стоимость рассчитывается индивидуально после консультации
        </p>
      </CardContent>
    </Card>
  );
});
