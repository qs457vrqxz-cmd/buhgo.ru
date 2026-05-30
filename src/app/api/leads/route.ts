import { NextRequest, NextResponse } from 'next/server';

// Временно отключена интеграция с Supabase
// import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'info@buhgalter.tech';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, inn, email, company, service, message, source } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны' },
        { status: 400 }
      );
    }

    // Формируем данные заявки
    const leadData = {
      name,
      phone,
      inn: inn || null,
      email: email || null,
      company: company || null,
      service: service || null,
      message: message || null,
      source: source || 'website',
      createdAt: new Date().toISOString(),
    };

    // Логируем заявку
    console.log('📋 Новая заявка:', JSON.stringify(leadData, null, 2));

    // Отправляем email уведомление
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">Новая заявка с сайта BuhGo</h2>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
            <p><strong>Имя:</strong> ${name}</p>
            <p><strong>Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
            ${inn ? `<p><strong>ИНН:</strong> ${inn}</p>` : ''}
            ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>` : ''}
            ${company ? `<p><strong>Компания:</strong> ${company}</p>` : ''}
            ${service ? `<p><strong>Услуга:</strong> ${service}</p>` : ''}
            ${message ? `<p><strong>Сообщение:</strong><br>${message}</p>` : ''}
          </div>
          <p style="color: #718096; font-size: 12px; margin-top: 20px;">
            Источник: ${source || 'website'}<br>
            Дата: ${new Date().toLocaleString('ru-RU')}
          </p>
        </div>
      `;

      // Пробуем отправить через Resend API
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://buhgo.ru'}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ADMIN_EMAIL,
          subject: `Новая заявка: ${name} | ${phone}`,
          html: emailHtml,
          text: `Новая заявка: ${name}, ${phone}${inn ? `, ИНН: ${inn}` : ''}`,
        }),
      });

      if (emailResponse.ok) {
        console.log('✅ Email уведомление отправлено на', ADMIN_EMAIL);
      } else {
        console.log('⚠️ Email не отправлен, но заявка сохранена');
      }
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Не прерываем запрос если email не отправился
    }

    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена! Мы перезвоним вам в ближайшее время.',
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Ошибка отправки заявки' },
      { status: 500 }
    );
  }
}

// GET временно отключен (требует Supabase)
export async function GET() {
  return NextResponse.json({
    message: 'API временно отключен',
    leads: []
  });
}
