import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
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
    const { email, password, name, role, phone, position, companyName } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, name, role' },
        { status: 400 }
      );
    }

    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name,
        role,
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // 2. Create/update profile (trigger should handle this, but let's ensure)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        email,
        name,
        phone: phone || null,
        role,
        is_active: true,
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // Don't fail - trigger might have created it
    }

    // 3. Create role-specific record
    if (role === 'accountant') {
      const { error: accError } = await supabaseAdmin
        .from('accountants')
        .insert({
          profile_id: userId,
          position: position || null,
          can_view_clients: true,
          can_edit_clients: false,
          can_view_documents: true,
          can_upload_documents: true,
          can_send_messages: true,
          can_view_reports: true,
          can_create_reports: false,
        });

      if (accError) {
        console.error('Accountant error:', accError);
      }
    } else if (role === 'client') {
      const { error: clientError } = await supabaseAdmin
        .from('clients')
        .insert({
          profile_id: userId,
          company_name: companyName || name,
        });

      if (clientError) {
        console.error('Client error:', clientError);
      }
    }

    return NextResponse.json({
      success: true,
      userId,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
