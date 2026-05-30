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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updates, role } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Update profile if there are profile fields
    const profileFields: Record<string, string | boolean | null> = {};
    if (updates.name !== undefined) profileFields.name = updates.name;
    if (updates.phone !== undefined) profileFields.phone = updates.phone;
    if (updates.isActive !== undefined) profileFields.is_active = updates.isActive;

    if (Object.keys(profileFields).length > 0) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update(profileFields)
        .eq('id', userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }
    }

    // Update role-specific table
    if (role === 'client') {
      const clientFields: Record<string, string | boolean | null> = {};
      if (updates.companyName !== undefined) clientFields.company_name = updates.companyName;
      if (updates.inn !== undefined) clientFields.inn = updates.inn;
      if (updates.ogrn !== undefined) clientFields.ogrn = updates.ogrn;
      if (updates.legalAddress !== undefined) clientFields.legal_address = updates.legalAddress;
      if (updates.actualAddress !== undefined) clientFields.actual_address = updates.actualAddress;
      if (updates.contactPerson !== undefined) clientFields.contact_person = updates.contactPerson;
      if (updates.tariff !== undefined) clientFields.tariff = updates.tariff;
      if (updates.contractDate !== undefined) clientFields.contract_date = updates.contractDate || null;
      if (updates.notes !== undefined) clientFields.notes = updates.notes;
      if (updates.assignedAccountant !== undefined) {
        // Handle "none" value
        clientFields.assigned_accountant_id = updates.assignedAccountant === 'none' || updates.assignedAccountant === ''
          ? null
          : updates.assignedAccountant;
      }

      if (Object.keys(clientFields).length > 0) {
        const { error: clientError } = await supabaseAdmin
          .from('clients')
          .update(clientFields)
          .eq('profile_id', userId);

        if (clientError) {
          console.error('Client update error:', clientError);
          return NextResponse.json(
            { error: clientError.message },
            { status: 400 }
          );
        }
      }
    } else if (role === 'accountant') {
      const accFields: Record<string, string | boolean | null> = {};
      if (updates.position !== undefined) accFields.position = updates.position;
      if (updates.permissions !== undefined) {
        accFields.can_view_clients = updates.permissions.canViewClients;
        accFields.can_edit_clients = updates.permissions.canEditClients;
        accFields.can_view_documents = updates.permissions.canViewDocuments;
        accFields.can_upload_documents = updates.permissions.canUploadDocuments;
        accFields.can_send_messages = updates.permissions.canSendMessages;
        accFields.can_view_reports = updates.permissions.canViewReports;
        accFields.can_create_reports = updates.permissions.canCreateReports;
      }

      if (Object.keys(accFields).length > 0) {
        const { error: accError } = await supabaseAdmin
          .from('accountants')
          .update(accFields)
          .eq('profile_id', userId);

        if (accError) {
          console.error('Accountant update error:', accError);
          return NextResponse.json(
            { error: accError.message },
            { status: 400 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
