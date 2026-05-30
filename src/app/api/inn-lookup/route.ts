import { NextRequest, NextResponse } from 'next/server';

// DaData API for company lookup by INN
// You can get a free token at https://dadata.ru/api/find-party/

const DADATA_API_URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party';
const DADATA_TOKEN = process.env.DADATA_API_TOKEN || '';

export interface CompanyInfo {
  name: string;
  fullName: string;
  inn: string;
  kpp: string;
  ogrn: string;
  type: 'LEGAL' | 'INDIVIDUAL'; // ООО or ИП
  address: string;
  management?: {
    name: string;
    post: string;
  };
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inn } = body;

    if (!inn) {
      return NextResponse.json(
        { error: 'ИНН не указан' },
        { status: 400 }
      );
    }

    // Clean INN - remove non-digits
    const cleanInn = inn.replace(/\D/g, '');

    // Validate INN length
    if (cleanInn.length !== 10 && cleanInn.length !== 12) {
      return NextResponse.json(
        { error: 'ИНН должен содержать 10 или 12 цифр' },
        { status: 400 }
      );
    }

    // If no DaData token, return mock data for development
    if (!DADATA_TOKEN) {
      // Mock response for development
      const isIP = cleanInn.length === 12;
      return NextResponse.json({
        success: true,
        company: {
          name: isIP ? `ИП ${cleanInn.slice(0, 4)}` : `ООО «Компания ${cleanInn.slice(0, 4)}»`,
          fullName: isIP
            ? `Индивидуальный предприниматель`
            : `Общество с ограниченной ответственностью «Компания ${cleanInn.slice(0, 4)}»`,
          inn: cleanInn,
          kpp: isIP ? '' : '770101001',
          ogrn: isIP ? '3' + cleanInn.slice(0, 14) : '1' + cleanInn.slice(0, 12),
          type: isIP ? 'INDIVIDUAL' : 'LEGAL',
          address: 'г. Москва',
          status: 'ACTIVE',
        } as CompanyInfo,
        message: 'Данные получены (демо-режим)',
      });
    }

    // Call DaData API
    const response = await fetch(DADATA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${DADATA_TOKEN}`,
      },
      body: JSON.stringify({
        query: cleanInn,
        count: 1,
      }),
    });

    if (!response.ok) {
      console.error('DaData API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Ошибка при запросе к сервису проверки ИНН' },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data.suggestions || data.suggestions.length === 0) {
      return NextResponse.json(
        { error: 'Компания с таким ИНН не найдена' },
        { status: 404 }
      );
    }

    const suggestion = data.suggestions[0];
    const companyData = suggestion.data;

    const company: CompanyInfo = {
      name: suggestion.value,
      fullName: companyData.name?.full_with_opf || suggestion.value,
      inn: companyData.inn,
      kpp: companyData.kpp || '',
      ogrn: companyData.ogrn,
      type: companyData.type === 'INDIVIDUAL' ? 'INDIVIDUAL' : 'LEGAL',
      address: companyData.address?.value || '',
      management: companyData.management ? {
        name: companyData.management.name,
        post: companyData.management.post,
      } : undefined,
      status: companyData.state?.status || 'ACTIVE',
    };

    return NextResponse.json({
      success: true,
      company,
    });

  } catch (error) {
    console.error('INN lookup error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
