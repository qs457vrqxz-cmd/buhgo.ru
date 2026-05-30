import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject' },
        { status: 400 }
      );
    }

    // In development without API key, just log
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 [DEV] Email would be sent:');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('---');
      return NextResponse.json({
        success: true,
        message: 'Email logged (dev mode)',
        id: 'dev-' + Date.now()
      });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'BuhGo <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id
    });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
