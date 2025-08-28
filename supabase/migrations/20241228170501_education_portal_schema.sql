-- Location: supabase/migrations/20241228170501_education_portal_schema.sql
-- Schema Analysis: Creating complete education portal schema from scratch  
-- Integration Type: Full authentication-enabled educational management system
-- Dependencies: auth.users (existing)

-- 1. CREATE TYPES AND ENUMS
CREATE TYPE public.user_role AS ENUM ('student', 'teacher', 'hod', 'admin');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE public.mark_status AS ENUM ('passed', 'failed', 'pending');
CREATE TYPE public.semester_type AS ENUM ('1', '2', '3', '4', '5', '6', '7', '8');

-- 2. CORE TABLES
-- User profiles table (links to auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role NOT NULL,
    prn TEXT, -- For students (Permanent Registration Number)
    employee_id TEXT, -- For teachers/staff
    department TEXT DEFAULT 'ECE',
    phone TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Academic years and classes
CREATE TABLE public.academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_name TEXT NOT NULL, -- e.g., "2024-25"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_name TEXT NOT NULL, -- e.g., "TE ECE A", "BE ECE B"
    semester public.semester_type NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    class_teacher_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Student enrollments  
CREATE TABLE public.student_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, class_id, academic_year_id)
);

-- Subjects 
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 3,
    semester public.semester_type NOT NULL,
    department TEXT DEFAULT 'ECE',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_code, semester)
);

-- Subject assignments (teachers to subjects/classes)
CREATE TABLE public.subject_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, subject_id, class_id, academic_year_id)
);

-- Attendance tracking
CREATE TABLE public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status public.attendance_status NOT NULL,
    marked_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, attendance_date)
);

-- Marks/grades management
CREATE TABLE public.exam_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_name TEXT NOT NULL, -- e.g., "Unit Test 1", "Mid Semester", "End Semester"
    max_marks INTEGER NOT NULL DEFAULT 100,
    weightage DECIMAL(5,2) NOT NULL DEFAULT 100.00, -- percentage weightage
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.marks_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    exam_type_id UUID REFERENCES public.exam_types(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS ((marks_obtained / max_marks) * 100) STORED,
    grade TEXT,
    status public.mark_status DEFAULT 'pending',
    marked_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    exam_date DATE,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, exam_type_id)
);

-- Notifications system
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'general', -- 'attendance', 'marks', 'announcement', 'general'
    is_read BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMPTZ
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_prn ON public.user_profiles(prn) WHERE prn IS NOT NULL;
CREATE INDEX idx_user_profiles_employee_id ON public.user_profiles(employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX idx_student_enrollments_student_id ON public.student_enrollments(student_id);
CREATE INDEX idx_student_enrollments_class_id ON public.student_enrollments(class_id);
CREATE INDEX idx_subject_assignments_teacher_id ON public.subject_assignments(teacher_id);
CREATE INDEX idx_attendance_records_student_id ON public.attendance_records(student_id);
CREATE INDEX idx_attendance_records_date ON public.attendance_records(attendance_date);
CREATE INDEX idx_marks_records_student_id ON public.marks_records(student_id);
CREATE INDEX idx_marks_records_subject_id ON public.marks_records(subject_id);
CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_unread ON public.notifications(recipient_id, is_read) WHERE is_read = false;

-- 4. HELPER FUNCTIONS (MUST BE CREATED BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.is_admin_or_hod()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'hod')
)
$$;

CREATE OR REPLACE FUNCTION public.is_teacher_of_student(student_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.subject_assignments sa
    JOIN public.student_enrollments se ON sa.class_id = se.class_id
    WHERE sa.teacher_id = auth.uid()
    AND se.student_id = student_uuid
    AND se.is_active = true
)
$$;

-- 5. ROW LEVEL SECURITY SETUP
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES

-- Pattern 1: Core user table (user_profiles)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow users to view other profiles (for teachers to see students, etc.)
CREATE POLICY "users_can_view_active_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (is_active = true);

-- Academic years - public read, admin manage
CREATE POLICY "public_can_view_academic_years"
ON public.academic_years
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admins_manage_academic_years"
ON public.academic_years
FOR ALL
TO authenticated
USING (public.is_admin_or_hod())
WITH CHECK (public.is_admin_or_hod());

-- Classes - public read, admin manage
CREATE POLICY "public_can_view_classes"
ON public.classes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admins_manage_classes"
ON public.classes
FOR ALL
TO authenticated
USING (public.is_admin_or_hod())
WITH CHECK (public.is_admin_or_hod());

-- Student enrollments - students see their own, teachers see their students, admins see all
CREATE POLICY "students_view_own_enrollments"
ON public.student_enrollments
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "teachers_view_student_enrollments"
ON public.student_enrollments
FOR SELECT
TO authenticated
USING (public.is_teacher_of_student(student_id));

CREATE POLICY "admins_manage_enrollments"
ON public.student_enrollments
FOR ALL
TO authenticated
USING (public.is_admin_or_hod())
WITH CHECK (public.is_admin_or_hod());

-- Subjects - public read, admin manage
CREATE POLICY "public_can_view_subjects"
ON public.subjects
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "admins_manage_subjects"
ON public.subjects
FOR ALL
TO authenticated
USING (public.is_admin_or_hod())
WITH CHECK (public.is_admin_or_hod());

-- Subject assignments - teachers see their assignments, admins see all
CREATE POLICY "teachers_view_own_assignments"
ON public.subject_assignments
FOR SELECT
TO authenticated
USING (teacher_id = auth.uid());

CREATE POLICY "admins_manage_assignments"
ON public.subject_assignments
FOR ALL
TO authenticated
USING (public.is_admin_or_hod())
WITH CHECK (public.is_admin_or_hod());

-- Attendance records - students see their own, teachers manage their students, admins see all
CREATE POLICY "students_view_own_attendance"
ON public.attendance_records
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "teachers_manage_student_attendance"
ON public.attendance_records
FOR ALL
TO authenticated
USING (public.is_teacher_of_student(student_id))
WITH CHECK (public.is_teacher_of_student(student_id));

CREATE POLICY "admins_view_all_attendance"
ON public.attendance_records
FOR SELECT
TO authenticated
USING (public.is_admin_or_hod());

-- Exam types - public read, admin manage
CREATE POLICY "public_can_view_exam_types"
ON public.exam_types
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "admins_manage_exam_types"
ON public.exam_types
FOR ALL
TO authenticated
USING (public.is_admin_or_hod())
WITH CHECK (public.is_admin_or_hod());

-- Marks records - similar to attendance
CREATE POLICY "students_view_own_marks"
ON public.marks_records
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "teachers_manage_student_marks"
ON public.marks_records
FOR ALL
TO authenticated
USING (public.is_teacher_of_student(student_id))
WITH CHECK (public.is_teacher_of_student(student_id));

CREATE POLICY "admins_view_all_marks"
ON public.marks_records
FOR SELECT
TO authenticated
USING (public.is_admin_or_hod());

-- Notifications - users manage their own
CREATE POLICY "users_manage_own_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (recipient_id = auth.uid())
WITH CHECK (recipient_id = auth.uid());

-- Allow teachers and admins to create notifications
CREATE POLICY "staff_can_create_notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role IN ('teacher', 'hod', 'admin')
    )
);

-- 7. TRIGGERS FOR AUTO-PROFILE CREATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    user_role public.user_role;
    prn_number TEXT;
    emp_id TEXT;
BEGIN
    user_email := NEW.email;
    user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    
    -- Determine role and identifiers based on email pattern
    IF user_email LIKE '%@student.csmss.edu.in' THEN
        user_role := 'student';
        -- Extract PRN from email (assuming format like 23025331844001@student.csmss.edu.in)
        prn_number := split_part(user_email, '@', 1);
    ELSIF user_email LIKE '%@csmss.edu.in' THEN
        -- Faculty email - default to teacher, can be updated later
        user_role := 'teacher';
        emp_id := 'T' || LPAD((SELECT COUNT(*) + 1 FROM public.user_profiles WHERE role IN ('teacher', 'hod'))::TEXT, 4, '0');
    ELSE
        -- Other emails - default to student
        user_role := 'student';
        prn_number := 'TMP' || EXTRACT(EPOCH FROM NOW())::TEXT;
    END IF;

    -- Override role if specified in metadata
    IF NEW.raw_user_meta_data ? 'role' THEN
        user_role := (NEW.raw_user_meta_data->>'role')::public.user_role;
    END IF;

    INSERT INTO public.user_profiles (
        id, email, full_name, role, prn, employee_id
    ) VALUES (
        NEW.id, user_email, user_name, user_role, prn_number, emp_id
    );

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 8. SAMPLE DATA FOR DEVELOPMENT
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    hod_uuid UUID := gen_random_uuid();
    teacher1_uuid UUID := gen_random_uuid();
    teacher2_uuid UUID := gen_random_uuid();
    student1_uuid UUID := gen_random_uuid();
    student2_uuid UUID := gen_random_uuid();
    student3_uuid UUID := gen_random_uuid();
    
    academic_year_uuid UUID := gen_random_uuid();
    class_te_uuid UUID := gen_random_uuid();
    class_be_uuid UUID := gen_random_uuid();
    
    subject_dsa_uuid UUID := gen_random_uuid();
    subject_dbms_uuid UUID := gen_random_uuid();
    subject_cn_uuid UUID := gen_random_uuid();
    
    exam_ut1_uuid UUID := gen_random_uuid();
    exam_midsem_uuid UUID := gen_random_uuid();
    exam_endsem_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        -- Admin user
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@csmss.edu.in', crypt('Pass@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        -- HOD user
        (hod_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'hod.ece@csmss.edu.in', crypt('Pass@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Kavita Sharma", "role": "hod"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        -- Teacher users
        (teacher1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'rajesh.mehta@csmss.edu.in', crypt('Pass@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Rajesh Mehta", "role": "teacher"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (teacher2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sunita.joshi@csmss.edu.in', crypt('Pass@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Prof. Sunita Joshi", "role": "teacher"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        -- Student users
        (student1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         '23025331844001@student.csmss.edu.in', crypt('Pass@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Aarav Sharma", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         '23025331844002@student.csmss.edu.in', crypt('Pass@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Priya Patel", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student3_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         '23025331844003@student.csmss.edu.in', crypt('Pass@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Rohit Kumar", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create academic year
    INSERT INTO public.academic_years (id, year_name, start_date, end_date, is_active) VALUES
        (academic_year_uuid, '2024-25', '2024-06-01', '2025-05-31', true);

    -- Create classes
    INSERT INTO public.classes (id, class_name, semester, academic_year_id, class_teacher_id) VALUES
        (class_te_uuid, 'TE ECE A', '5', academic_year_uuid, teacher1_uuid),
        (class_be_uuid, 'BE ECE A', '7', academic_year_uuid, teacher2_uuid);

    -- Create subjects
    INSERT INTO public.subjects (id, subject_code, subject_name, credits, semester) VALUES
        (subject_dsa_uuid, 'ECE501', 'Data Structures and Algorithms', 4, '5'),
        (subject_dbms_uuid, 'ECE502', 'Database Management Systems', 3, '5'),
        (subject_cn_uuid, 'ECE701', 'Computer Networks', 4, '7');

    -- Create exam types
    INSERT INTO public.exam_types (id, exam_name, max_marks, weightage) VALUES
        (exam_ut1_uuid, 'Unit Test 1', 25, 10.00),
        (exam_midsem_uuid, 'Mid Semester', 50, 30.00),
        (exam_endsem_uuid, 'End Semester', 100, 60.00);

    -- Enroll students
    INSERT INTO public.student_enrollments (student_id, class_id, academic_year_id) VALUES
        (student1_uuid, class_te_uuid, academic_year_uuid),
        (student2_uuid, class_te_uuid, academic_year_uuid),
        (student3_uuid, class_be_uuid, academic_year_uuid);

    -- Assign subjects to teachers
    INSERT INTO public.subject_assignments (teacher_id, subject_id, class_id, academic_year_id) VALUES
        (teacher1_uuid, subject_dsa_uuid, class_te_uuid, academic_year_uuid),
        (teacher1_uuid, subject_dbms_uuid, class_te_uuid, academic_year_uuid),
        (teacher2_uuid, subject_cn_uuid, class_be_uuid, academic_year_uuid);

    -- Sample attendance records
    INSERT INTO public.attendance_records (student_id, subject_id, class_id, attendance_date, status, marked_by) VALUES
        (student1_uuid, subject_dsa_uuid, class_te_uuid, CURRENT_DATE - INTERVAL '7 days', 'present', teacher1_uuid),
        (student1_uuid, subject_dsa_uuid, class_te_uuid, CURRENT_DATE - INTERVAL '6 days', 'present', teacher1_uuid),
        (student1_uuid, subject_dsa_uuid, class_te_uuid, CURRENT_DATE - INTERVAL '5 days', 'absent', teacher1_uuid),
        (student2_uuid, subject_dsa_uuid, class_te_uuid, CURRENT_DATE - INTERVAL '7 days', 'present', teacher1_uuid),
        (student2_uuid, subject_dsa_uuid, class_te_uuid, CURRENT_DATE - INTERVAL '6 days', 'late', teacher1_uuid),
        (student2_uuid, subject_dsa_uuid, class_te_uuid, CURRENT_DATE - INTERVAL '5 days', 'present', teacher1_uuid);

    -- Sample marks records
    INSERT INTO public.marks_records (student_id, subject_id, exam_type_id, class_id, marks_obtained, max_marks, grade, status, marked_by, exam_date) VALUES
        (student1_uuid, subject_dsa_uuid, exam_ut1_uuid, class_te_uuid, 22, 25, 'A', 'passed', teacher1_uuid, CURRENT_DATE - INTERVAL '10 days'),
        (student1_uuid, subject_dbms_uuid, exam_ut1_uuid, class_te_uuid, 20, 25, 'B+', 'passed', teacher1_uuid, CURRENT_DATE - INTERVAL '8 days'),
        (student2_uuid, subject_dsa_uuid, exam_ut1_uuid, class_te_uuid, 18, 25, 'B', 'passed', teacher1_uuid, CURRENT_DATE - INTERVAL '10 days'),
        (student2_uuid, subject_dbms_uuid, exam_ut1_uuid, class_te_uuid, 23, 25, 'A', 'passed', teacher1_uuid, CURRENT_DATE - INTERVAL '8 days');

    -- Sample notifications
    INSERT INTO public.notifications (recipient_id, title, message, notification_type, created_by) VALUES
        (student1_uuid, 'Assignment Due', 'Your DSA assignment is due tomorrow', 'general', teacher1_uuid),
        (student2_uuid, 'Excellent Performance', 'Great work on your recent test scores!', 'marks', teacher1_uuid),
        (student1_uuid, 'Attendance Alert', 'You have missed 2 classes this month', 'attendance', teacher1_uuid);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 9. HELPER FUNCTIONS FOR ANALYTICS
CREATE OR REPLACE FUNCTION public.get_student_attendance_percentage(student_uuid UUID, subject_uuid UUID DEFAULT NULL)
RETURNS DECIMAL(5,2)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT CASE 
    WHEN COUNT(*) = 0 THEN 0.00
    ELSE ROUND(
        (COUNT(*) FILTER (WHERE status = 'present') * 100.0 / COUNT(*))::DECIMAL(5,2),
        2
    )
END
FROM public.attendance_records ar
WHERE ar.student_id = student_uuid
AND (subject_uuid IS NULL OR ar.subject_id = subject_uuid)
AND ar.attendance_date >= CURRENT_DATE - INTERVAL '30 days';
$$;

CREATE OR REPLACE FUNCTION public.get_class_average_marks(class_uuid UUID, subject_uuid UUID, exam_type_uuid UUID)
RETURNS DECIMAL(5,2)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT COALESCE(AVG(percentage), 0.00)::DECIMAL(5,2)
FROM public.marks_records mr
WHERE mr.class_id = class_uuid
AND mr.subject_id = subject_uuid
AND mr.exam_type_id = exam_type_uuid;
$$;

-- Add comments for documentation
COMMENT ON TABLE public.user_profiles IS 'Central user profiles table linking to Supabase auth';
COMMENT ON TABLE public.attendance_records IS 'Daily attendance tracking for students';
COMMENT ON TABLE public.marks_records IS 'Academic performance and examination results';
COMMENT ON TABLE public.notifications IS 'In-app notification system for students and teachers';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Education portal schema created successfully!';
    RAISE NOTICE '📚 Created tables: user_profiles, classes, subjects, attendance_records, marks_records, notifications';
    RAISE NOTICE '👥 Sample users created with role-based access control';
    RAISE NOTICE '🔐 Row Level Security enabled for all tables';
    RAISE NOTICE '🚀 Ready for application integration!';
END $$;