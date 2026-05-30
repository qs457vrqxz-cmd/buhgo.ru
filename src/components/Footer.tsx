"use client";

import Link from "next/link";
import { memo } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const services = [
  { name: "Ведение бухгалтерского учёта", href: "/uslugi/vedenie-buhucheta" },
  { name: "Нулевая отчётность", href: "/uslugi/nulevaya-otchetnost" },
  { name: "Регистрация ИП/ООО", href: "/uslugi/registraciya" },
  { name: "Ликвидация ИП/ООО", href: "/uslugi/likvidaciya" },
  { name: "Открытие расчётного счёта", href: "/uslugi/raschetny-schet" },
  { name: "Кадровый учёт", href: "/uslugi/kadrovyj-uchet" },
  { name: "Консультации", href: "/uslugi/konsultacii" },
  { name: "1С программирование", href: "/uslugi/1c" },
  { name: "Банкротство бизнеса", href: "/uslugi/bankrotstvo" },
];

const partners = [
  { name: "Сбер Банк", href: "/integrations#sber" },
  { name: "Точка Банк", href: "/integrations#tochka" },
  { name: "Альфа Банк", href: "/integrations#alfa-bank" },
  { name: "Т-Банк", href: "/integrations#tbank" },
  { name: "СБИС", href: "/integrations#sbis" },
  { name: "Контур", href: "/integrations#kontur" },
  { name: "Такском", href: "/integrations#taxcom" },
  { name: "1С", href: "/integrations#1c" },
];

const companyLinks = [
  { name: "Обо мне", href: "/about" },
  // { name: "Блог", href: "/blog" }, // Временно скрыт
  { name: "Контакты", href: "/contacts" },
  { name: "Калькулятор", href: "/calculator" },
];

// Memoize the VK icon to avoid re-renders
const VKIcon = memo(function VKIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.147-1.744-1.147-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.743c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.716-.576.716z"/>
    </svg>
  );
});

// Memoize the Telegram icon to avoid re-renders
const TelegramIcon = memo(function TelegramIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
});

export const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1f2e] text-white mt-auto">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Company info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center" prefetch={false}>
              <span className="text-xl sm:text-2xl font-bold text-white">Buh</span>
              <span className="text-xl sm:text-2xl font-bold text-secondary">Go</span>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm">
              Профессиональное бухгалтерское сопровождение для вашего бизнеса.
              Работаем с ИП и ООО любых форм собственности.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://vk.com/buhgalter.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors"
                aria-label="ВКонтакте"
              >
                <VKIcon />
              </a>
              <a
                href="https://t.me/buhgaltertech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors"
                aria-label="Telegram"
              >
                <TelegramIcon />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Услуги</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                    prefetch={false}
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Партнёры</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {partners.map((partner) => (
                <li key={partner.href}>
                  <Link
                    href={partner.href}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                    prefetch={false}
                  >
                    {partner.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links (Blog, About, etc.) */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Компания</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                    prefetch={false}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Контакты</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="tel:+79639639666" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-xs sm:text-sm">8 963 963 96 66</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@buhgalter.tech" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-xs sm:text-sm">info@buhgalter.tech</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm">Москва</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm">Пн-Пт: 09:00 - 17:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2022 - {currentYear} BuhGo. Все права защищены.
          </p>
          <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors" prefetch={false}>
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors" prefetch={false}>
              Пользовательское соглашение
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});
