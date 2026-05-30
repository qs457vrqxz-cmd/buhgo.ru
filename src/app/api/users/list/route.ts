import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'accountant', 'client', or null for all

    // Get profiles with optional role filter
    let query = supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    const { data: profiles, error: profilesError } = await query;

    if (profilesError) {
      console.error('Profiles error:', profilesError);
      return NextResponse.json({ error: profilesError.message }, { status: 400 });
    }

    // If requesting accountants, also get accountant details
    if (role === 'accountant') {
      const { data: accountants, error: accError } = await supabaseAdmin
        .from('accountants')
        .select('*');

      if (accError) {
        console.error('Accountants error:', accError);
      }

      // Merge profile data with accountant data
      const merged = profiles?.map(profile => {
        const accData = accountants?.find(a => a.profile_id === profile.id);
        return {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          phone: profile.phone,
          role: profile.role,
          isActive: profile.is_active,
          createdAt: profile.created_at,
          position: accData?.position || '',
          permissions: {
            canViewClients: accData?.can_view_clients ?? true,
            canEditClients: accData?.can_edit_clients ?? false,
            canViewDocuments: accData?.can_view_documents ?? true,
            canUploadDocuments: accData?.can_upload_documents ?? true,
            canSendMessages: accData?.can_send_messages ?? true,
            canViewReports: accData?.can_view_reports ?? true,
            canCreateReports: accData?.can_create_reports ?? false,
          },
          assignedClients: [], // TODO: load from clients table
        };
      });

      return NextResponse.json({ users: merged || [] });
    }

    // If requesting clients, also get client details
    if (role === 'client') {
      const { data: clients, error: clientError } = await supabaseAdmin
        .from('clients')
        .select('*');

      if (clientError) {
        console.error('Clients error:', clientError);
      }

      // Merge profile data with client data
      const merged = profiles?.map(profile => {
        const clientData = clients?.find(c => c.profile_id === profile.id);
        return {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          phone: profile.phone,
          role: profile.role,
          isActive: profile.is_active,
          createdAt: profile.created_at,
          companyName: clientData?.company_name || '',
          inn: clientData?.inn || '',
          ogrn: clientData?.ogrn || '',
          legalAddress: clientData?.legal_address || '',
          actualAddress: clientData?.actual_address || '',
          contactPerson: clientData?.contact_person || '',
          assignedAccountant: clientData?.assigned_accountant_id || '',
          tariff: clientData?.tariff || '',
          contractDate: clientData?.contract_date || '',
          notes: clientData?.notes || '',
        };
      });

      return NextResponse.json({ users: merged || [] });
    }

    // Return all profiles
    return NextResponse.json({ users: profiles || [] });

  } catch (error) {
    console.error('List users error:', error);
    return NextResponse.json(
      { error: 'Failed to list users' },
      { status: 500 }
    );
  }
}
