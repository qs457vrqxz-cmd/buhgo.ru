"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function TermsPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-primary hover:underline">
                Главная
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">Пользовательское соглашение</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold mb-8">
                Пользовательское соглашение
              </h1>

              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-6">
                  Дата последнего обновления: 1 апреля 2026 года
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">1. Общие положения</h2>
                <p className="text-muted-foreground mb-4">
                  Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует
                  отношения между владельцем сайта BuhGo (далее — «Администрация»)
                  и пользователем сети Интернет (далее — «Пользователь»).
                </p>
                <p className="text-muted-foreground mb-4">
                  Использование сайта означает полное и безоговорочное принятие Пользователем
                  условий настоящего Соглашения.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">2. Предмет соглашения</h2>
                <p className="text-muted-foreground mb-4">
                  Администрация предоставляет Пользователю доступ к информационным материалам
                  и услугам сайта, включая:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                  <li>Информацию о бухгалтерских услугах</li>
                  <li>Возможность оставить заявку на консультацию</li>
                  <li>Доступ к личному кабинету (для клиентов)</li>
                  <li>Калькулятор стоимости услуг</li>
                  <li>Статьи и полезные материалы</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">3. Права и обязанности сторон</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">3.1. Администрация обязуется:</h3>
                <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                  <li>Обеспечивать работоспособность сайта</li>
                  <li>Защищать персональные данные Пользователей</li>
                  <li>Предоставлять достоверную информацию об услугах</li>
                  <li>Рассматривать обращения Пользователей в разумные сроки</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">3.2. Пользователь обязуется:</h3>
                <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                  <li>Предоставлять достоверные данные при заполнении форм</li>
                  <li>Не использовать сайт в противоправных целях</li>
                  <li>Не нарушать работу сайта</li>
                  <li>Соблюдать авторские права на материалы сайта</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">4. Услуги и оплата</h2>
                <p className="text-muted-foreground mb-4">
                  Стоимость бухгалтерских услуг определяется индивидуально на основе:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                  <li>Организационно-правовой формы (ИП/ООО)</li>
                  <li>Системы налогообложения</li>
                  <li>Объёма документооборота</li>
                  <li>Количества сотрудников</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  Окончательная стоимость согласовывается после консультации и фиксируется
                  в договоре об оказании услуг.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">5. Ответственность сторон</h2>
                <p className="text-muted-foreground mb-4">
                  Администрация не несёт ответственности за:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                  <li>Временную недоступность сайта по техническим причинам</li>
                  <li>Убытки, вызванные действиями третьих лиц</li>
                  <li>Качество интернет-соединения Пользователя</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">6. Интеллектуальная собственность</h2>
                <p className="text-muted-foreground mb-4">
                  Все материалы сайта (тексты, изображения, логотипы, дизайн) являются
                  интеллектуальной собственностью Администрации и защищены законодательством РФ.
                </p>
                <p className="text-muted-foreground mb-4">
                  Копирование, распространение и иное использование материалов без письменного
                  согласия Администрации запрещено.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">7. Конфиденциальность</h2>
                <p className="text-muted-foreground mb-4">
                  Обработка персональных данных Пользователей осуществляется в соответствии с{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Политикой конфиденциальности
                  </Link>
                  .
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">8. Разрешение споров</h2>
                <p className="text-muted-foreground mb-4">
                  Все споры разрешаются путём переговоров. При невозможности достичь согласия
                  спор передаётся на рассмотрение в суд по месту нахождения Администрации
                  в соответствии с законодательством Российской Федерации.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">9. Изменение условий</h2>
                <p className="text-muted-foreground mb-4">
                  Администрация вправе вносить изменения в настоящее Соглашение без
                  предварительного уведомления. Актуальная версия всегда доступна на данной странице.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">10. Контактная информация</h2>
                <p className="text-muted-foreground mb-4">
                  По всем вопросам обращайтесь:
                </p>
                <ul className="list-none text-muted-foreground mb-4 space-y-2">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:info@buhgalter.tech" className="text-primary hover:underline">
                      info@buhgalter.tech
                    </a>
                  </li>
                  <li>
                    <strong>Телефон:</strong>{" "}
                    <a href="tel:+79639639666" className="text-primary hover:underline">
                      8 963 963 96 66
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
