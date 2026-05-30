import { NextRequest, NextResponse } from 'next/server';

// Временно отключена авторизация
// TODO: Включить когда будет готов личный кабинет

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Авторизация временно недоступна',
    exists: false
  });
}
