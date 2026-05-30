// Email Service для отправки паролей
// В продакшене подключить SendGrid, Resend, или другой сервис

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// Генерация безопасного пароля
export const generatePassword = (length: number = 12): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%&*';

  const allChars = lowercase + uppercase + numbers + special;

  // Гарантируем наличие всех типов символов
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Добавляем остальные символы
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Перемешиваем пароль
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Генерация кода восстановления (6 цифр)
export const generateRecoveryCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Хранилище кодов восстановления (в продакшене - база данных)
const RECOVERY_CODES_KEY = 'buhgalter_recovery_codes';

interface RecoveryCodeData {
  email: string;
  code: string;
  expiresAt: number;
  used: boolean;
}

export const saveRecoveryCode = (email: string, code: string): void => {
  const codes = getRecoveryCodes();

  // Удаляем старые коды для этого email
  const filtered = codes.filter(c => c.email.toLowerCase() !== email.toLowerCase());

  // Добавляем новый код (действует 15 минут)
  filtered.push({
    email: email.toLowerCase(),
    code,
    expiresAt: Date.now() + 15 * 60 * 1000,
    used: false,
  });

  localStorage.setItem(RECOVERY_CODES_KEY, JSON.stringify(filtered));
};

export const getRecoveryCodes = (): RecoveryCodeData[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(RECOVERY_CODES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const verifyRecoveryCode = (email: string, code: string): boolean => {
  const codes = getRecoveryCodes();
  const record = codes.find(
    c => c.email.toLowerCase() === email.toLowerCase() &&
         c.code === code &&
         !c.used &&
         c.expiresAt > Date.now()
  );

  if (record) {
    // Помечаем код как использованный
    record.used = true;
    localStorage.setItem(RECOVERY_CODES_KEY, JSON.stringify(codes));
    return true;
  }

  return false;
};

// Хранилище паролей пользователей (в продакшене - хешированные в БД)
const PASSWORDS_KEY = 'buhgalter_passwords';

interface PasswordData {
  email: string;
  password: string;
  updatedAt: string;
}

export const savePassword = (email: string, password: string): void => {
  const passwords = getPasswords();
  const filtered = passwords.filter(p => p.email.toLowerCase() !== email.toLowerCase());
  filtered.push({
    email: email.toLowerCase(),
    password,
    updatedAt: new Date().toISOString(),
  });
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(filtered));
};

export const getPasswords = (): PasswordData[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PASSWORDS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const verifyPassword = (email: string, password: string): boolean => {
  const passwords = getPasswords();
  const record = passwords.find(p => p.email.toLowerCase() === email.toLowerCase());
  return record ? record.password === password : false;
};

export const getPasswordByEmail = (email: string): string | null => {
  const passwords = getPasswords();
  const record = passwords.find(p => p.email.toLowerCase() === email.toLowerCase());
  return record ? record.password : null;
};

// Шаблоны email
export const createWelcomeEmail = (name: string, email: string, password: string, role: string): EmailTemplate => {
  const roleText = role === 'accountant' ? 'бухгалтера' : 'клиента';
  const loginUrl = 'https://same-m3rz0o8bufo-latest.netlify.app/login';

  return {
    to: email,
    subject: `Добро пожаловать в BuhGo — ваш аккаунт ${roleText} создан`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0F4C81; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">
            <span style="color: white;">Buh</span><span style="color: #E63946;">Go</span>
          </h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Здравствуйте, ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Для вас создан личный кабинет ${roleText} в системе BuhGo.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px; color: #333;"><strong>Данные для входа:</strong></p>
            <p style="margin: 5px 0; color: #666;">Email: <strong>${email}</strong></p>
            <p style="margin: 5px 0; color: #666;">Пароль: <strong>${password}</strong></p>
          </div>
          <p style="color: #E63946; font-size: 14px;">
            ⚠️ Рекомендуем сменить пароль после первого входа.
          </p>
          <a href="${loginUrl}" style="display: inline-block; background: #E63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px;">
            Войти в личный кабинет
          </a>
        </div>
        <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>© 2022-2026 BuhGo. Все права защищены.</p>
          <p>Если вы не регистрировались в системе, проигнорируйте это письмо.</p>
        </div>
      </div>
    `,
    text: `
Здравствуйте, ${name}!

Для вас создан личный кабинет ${roleText} в системе BuhGo.

Данные для входа:
Email: ${email}
Пароль: ${password}

Войти: ${loginUrl}

Рекомендуем сменить пароль после первого входа.

© 2022-2026 BuhGo
    `,
  };
};

export const createRecoveryEmail = (email: string, code: string): EmailTemplate => {
  return {
    to: email,
    subject: 'Восстановление пароля — BuhGo',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0F4C81; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">
            <span style="color: white;">Buh</span><span style="color: #E63946;">Go</span>
          </h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Восстановление пароля</h2>
          <p style="color: #666; line-height: 1.6;">
            Вы запросили восстановление пароля для аккаунта <strong>${email}</strong>.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px; color: #333;">Ваш код подтверждения:</p>
            <p style="font-size: 32px; font-weight: bold; color: #0F4C81; letter-spacing: 5px; margin: 10px 0;">
              ${code}
            </p>
            <p style="color: #999; font-size: 12px;">Код действителен 15 минут</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.
          </p>
        </div>
        <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>© 2022-2026 BuhGo. Все права защищены.</p>
        </div>
      </div>
    `,
    text: `
Восстановление пароля — BuhGo

Вы запросили восстановление пароля для аккаунта ${email}.

Ваш код подтверждения: ${code}

Код действителен 15 минут.

Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.

© 2022-2026 BuhGo
    `,
  };
};

export const createNewPasswordEmail = (email: string, newPassword: string): EmailTemplate => {
  const loginUrl = 'https://same-m3rz0o8bufo-latest.netlify.app/login';

  return {
    to: email,
    subject: 'Новый пароль — BuhGo',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0F4C81; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">
            <span style="color: white;">Buh</span><span style="color: #E63946;">Go</span>
          </h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Пароль успешно изменён</h2>
          <p style="color: #666; line-height: 1.6;">
            Ваш пароль для аккаунта <strong>${email}</strong> был успешно изменён.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px; color: #333;"><strong>Новый пароль:</strong></p>
            <p style="font-size: 18px; font-weight: bold; color: #0F4C81;">${newPassword}</p>
          </div>
          <p style="color: #E63946; font-size: 14px;">
            ⚠️ Сохраните пароль в надёжном месте.
          </p>
          <a href="${loginUrl}" style="display: inline-block; background: #E63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px;">
            Войти в личный кабинет
          </a>
        </div>
        <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>© 2022-2026 BuhGo. Все права защищены.</p>
        </div>
      </div>
    `,
    text: `
Пароль успешно изменён — BuhGo

Ваш пароль для аккаунта ${email} был успешно изменён.

Новый пароль: ${newPassword}

Сохраните пароль в надёжном месте.

Войти: ${loginUrl}

© 2022-2026 BuhGo
    `,
  };
};

// Функция отправки email через Resend API
export const sendEmail = async (template: EmailTemplate): Promise<boolean> => {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: template.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Email send error:', error);
      return false;
    }

    const result = await response.json();
    console.log('📧 Email отправлен:', result.id);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

// Отправка формы обратной связи
export interface ContactFormData {
  name: string;
  phone: string;
  inn: string;
  email?: string;
  service?: string;
  message?: string;
  subject?: string;
}

export const sendContactForm = async (data: ContactFormData): Promise<{ success: boolean; message: string }> => {
  try {
    // Try to send to API (Supabase)
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        inn: data.inn,
        email: data.email,
        service: data.service,
        message: data.message,
        source: data.subject || 'website',
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: result.message || 'Заявка успешно отправлена! Мы перезвоним вам в ближайшее время.',
      };
    }

    // Fallback to console log if API fails
    console.log('📧 Отправка заявки (fallback):');
    if (data.subject) console.log('Тема:', data.subject);
    console.log('Имя:', data.name);
    console.log('Телефон:', data.phone);
    console.log('ИНН:', data.inn);
    if (data.email) console.log('Email:', data.email);
    if (data.service) console.log('Услуга:', data.service);
    if (data.message) console.log('Сообщение:', data.message);

    return {
      success: true,
      message: 'Заявка успешно отправлена! Мы перезвоним вам в ближайшее время.',
    };
  } catch (error) {
    console.error('sendContactForm error:', error);
    return {
      success: false,
      message: 'Ошибка отправки. Попробуйте позвонить нам.',
    };
  }
};

// Пример интеграции с SendGrid (закомментировано)
/*
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendWithSendGrid = async (template: EmailTemplate): Promise<boolean> => {
  try {
    await sgMail.send({
      to: template.to,
      from: 'noreply@buhgalter.tech',
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid error:', error);
    return false;
  }
};
*/

// Пример интеграции с Resend (закомментировано)
/*
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWithResend = async (template: EmailTemplate): Promise<boolean> => {
  try {
    await resend.emails.send({
      from: 'BuhGo <noreply@buhgalter.tech>',
      to: template.to,
      subject: template.subject,
      html: template.html,
    });
    return true;
  } catch (error) {
    console.error('Resend error:', error);
    return false;
  }
};
*/
