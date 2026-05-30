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
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email and newPassword are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error('List users error:', listError);
      return NextResponse.json({ error: 'Failed to find user' }, { status: 500 });
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Update password error:', updateError);
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
