import { NextRequest, NextResponse } from 'next/server';

// Временно отключена регистрация
// TODO: Включить когда будет готов личный кабинет

export async function POST(request: NextRequest) {
  return NextResponse.json({
    error: 'Регистрация временно недоступна',
  }, { status: 503 });
}
