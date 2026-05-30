"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPage() {
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
              <span className="text-muted-foreground">Политика конфиденциальности</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold mb-8">
                Политика конфиденциальности
              </h1>

              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-6">
                  Дата последнего обновления: 1 апреля 2026 года
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">1. Общие положения</h2>
                <p className="text-muted-foreground mb-4">
                  Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок
                  обработки и защиты персональных данных пользователей сайта BuhGo
                  (далее — «Сайт»), принадлежащего компании BuhGo (далее — «Компания»).
                </p>
                <p className="text-muted-foreground mb-4">
                  Используя Сайт и предоставляя свои персональные данные, вы выражаете согласие
                  с условиями настоящей Политики.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">2. Какие данные мы собираем</h2>
                <p className="text-muted-foreground mb-4">
                  Мы можем собирать следующие персональные данные:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                  <li>Имя и фамилия</li>
                  <li>Контактный телефон</li>
                  <li>Адрес электронной почты</li>
                  <li>Название компании (ИП/ООО)</li>
                  <li>ИНН организации</li>
                  <li>Данные о посещении сайта (IP-адрес, cookies, данные браузера)</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">3. Цели обработки данных</h2>
                <p className="text-muted-foreground mb-4">
                  Персональные данные обрабатываются в следующих целях:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                  <li>Оказание бухгалтерских услуг</li>
                  <li>Связь с пользователем для консультации</li>
                  <li>Направление информационных материалов</li>
                  <li>Улучшение качества обслуживания</li>
                  <li>Аналитика использования сайта</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">4. Защита данных</h2>
                <p className="text-muted-foreground mb-4">
                  Мы принимаем все необходимые организационные и технические меры для защиты
                  персональных данных от несанкционированного доступа, изменения, раскрытия
                  или уничтожения.
                </p>
                <p className="text-muted-foreground mb-4">
                  Доступ к персональным данным имеют только уполномоченные сотрудники,
                  которые обязаны соблюдать конфиденциальность.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">5. Передача данных третьим лицам</h2>
                <p className="text-muted-foreground mb-4">
                  Мы не передаём персональные данные третьим лицам, за исключением случаев:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                  <li>Получено ваше согласие на передачу</li>
                  <li>Передача необходима для оказания услуг (банки-партнёры, сервисы отчётности)</li>
                  <li>Передача требуется по законодательству РФ</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">6. Файлы cookie</h2>
                <p className="text-muted-foreground mb-4">
                  Сайт использует файлы cookie для улучшения пользовательского опыта и сбора
                  аналитических данных. Вы можете отключить cookies в настройках браузера,
                  однако это может повлиять на функциональность сайта.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">7. Ваши права</h2>
                <p className="text-muted-foreground mb-4">
                  Вы имеете право:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                  <li>Получить информацию о ваших персональных данных</li>
                  <li>Потребовать исправления неточных данных</li>
                  <li>Потребовать удаления ваших данных</li>
                  <li>Отозвать согласие на обработку данных</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  Для реализации своих прав свяжитесь с нами по email:{" "}
                  <a href="mailto:info@buhgalter.tech" className="text-primary hover:underline">
                    info@buhgalter.tech
                  </a>
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">8. Изменения в Политике</h2>
                <p className="text-muted-foreground mb-4">
                  Мы оставляем за собой право вносить изменения в настоящую Политику.
                  Актуальная версия всегда доступна на данной странице.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">9. Контактная информация</h2>
                <p className="text-muted-foreground mb-4">
                  По вопросам, связанным с обработкой персональных данных, обращайтесь:
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
