-- =====================================================
-- BuhGo Database Schema for Supabase
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM Types
-- =====================================================

CREATE TYPE user_role AS ENUM ('admin', 'accountant', 'client');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected', 'requires_attention');
CREATE TYPE document_type AS ENUM ('act', 'invoice', 'report', 'contract', 'other');
CREATE TYPE message_type AS ENUM ('text', 'file', 'system');

-- =====================================================
-- Users Table (extends Supabase auth.users)
-- =====================================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'client',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Accountants Table
-- =====================================================

CREATE TABLE public.accountants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    position TEXT,
    can_view_clients BOOLEAN DEFAULT true,
    can_edit_clients BOOLEAN DEFAULT false,
    can_view_documents BOOLEAN DEFAULT true,
    can_upload_documents BOOLEAN DEFAULT true,
    can_send_messages BOOLEAN DEFAULT true,
    can_view_reports BOOLEAN DEFAULT true,
    can_create_reports BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Clients Table
-- =====================================================

CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    inn TEXT,
    ogrn TEXT,
    legal_address TEXT,
    actual_address TEXT,
    contact_person TEXT,
    assigned_accountant_id UUID REFERENCES public.accountants(id) ON DELETE SET NULL,
    tariff TEXT,
    contract_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Leads (Contact Form Submissions)
-- =====================================================

CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company TEXT,
    service TEXT,
    message TEXT,
    source TEXT DEFAULT 'website',
    status lead_status DEFAULT 'new',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    metadata JSONB,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Documents
-- =====================================================

CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    document_type document_type DEFAULT 'other',
    status document_status DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Messages (Chat)
-- =====================================================

CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    accountant_id UUID REFERENCES public.accountants(id) ON DELETE SET NULL,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_type message_type DEFAULT 'text',
    content TEXT,
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Password Reset Codes
-- =====================================================

CREATE TABLE public.password_reset_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Blog Posts
-- =====================================================

CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    category TEXT,
    tags TEXT[],
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Services (Editable by Admin)
-- =====================================================

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price TEXT,
    price_note TEXT,
    icon TEXT,
    url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Partners
-- =====================================================

CREATE TABLE public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    brand_color TEXT,
    bonus TEXT,
    features TEXT[],
    our_services TEXT[],
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Testimonials
-- =====================================================

CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company TEXT,
    position TEXT,
    avatar_url TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    date TEXT,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Notifications
-- =====================================================

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT,
    type TEXT DEFAULT 'system',
    url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Push Subscriptions
-- =====================================================

CREATE TABLE public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    keys JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_documents_client_id ON public.documents(client_id);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies
-- =====================================================

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Public read for services, partners, testimonials, blog
CREATE POLICY "Anyone can view active services" ON public.services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active partners" ON public.partners
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view published testimonials" ON public.testimonials
    FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT USING (is_published = true);

-- Admins can do anything
CREATE POLICY "Admins full access to services" ON public.services
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins full access to partners" ON public.partners
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins full access to testimonials" ON public.testimonials
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins full access to blog" ON public.blog_posts
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins full access to leads" ON public.leads
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Anyone can insert leads (contact form)
CREATE POLICY "Anyone can submit leads" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Documents: Clients see their own, accountants see assigned clients
CREATE POLICY "Clients view own documents" ON public.documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients c
            JOIN public.profiles p ON c.profile_id = p.id
            WHERE c.id = documents.client_id AND p.id = auth.uid()
        )
    );

-- Messages: Participants can view conversation messages
CREATE POLICY "Conversation participants view messages" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            JOIN public.clients cl ON c.client_id = cl.id
            JOIN public.profiles p ON cl.profile_id = p.id
            WHERE c.id = messages.conversation_id AND p.id = auth.uid()
        )
    );

-- Notifications: Users see their own
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- Functions
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Seed Data (Optional - run separately)
-- =====================================================

-- Insert default admin (run after creating auth user)
-- INSERT INTO public.profiles (id, email, name, role)
-- VALUES ('YOUR_AUTH_USER_ID', 'admin@buhgalter.tech', 'Администратор', 'admin');
