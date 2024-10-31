BEGIN;

-- Table: privileges (user roles and permissions)
CREATE TABLE IF NOT EXISTS public.privileges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- Table: users (students, instructors, and admins)
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    birthday DATE,  -- Adiciona a coluna para armazenar data de aniversário
    privilege_id INTEGER REFERENCES public.privileges(id) ON DELETE NO ACTION
);

-- Table: status (for tracking the status of a course, e.g., draft, published)
CREATE TABLE IF NOT EXISTS public.status (
    id SERIAL PRIMARY KEY,
    name JSONB NOT NULL
);

-- Table: courses (multilingual support for course content)
CREATE TABLE IF NOT EXISTS public.courses (
    id SERIAL PRIMARY KEY,
    title JSONB NOT NULL,
    subtitle JSONB NOT NULL,
    description JSONB NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    status_id INTEGER NOT NULL REFERENCES public.status(id),
    teacher_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL
);

-- Table: classes (individual lessons within courses)
CREATE TABLE IF NOT EXISTS public.classes (
    id SERIAL PRIMARY KEY,
    title JSONB NOT NULL,
    subtitle JSONB NOT NULL,
    description JSONB NOT NULL,
    video_path TEXT,
    course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: media_files (handling images, documents, or video metadata)
CREATE TABLE IF NOT EXISTS public.media_files (
    id SERIAL PRIMARY KEY,
    file_type VARCHAR(10) CHECK (file_type IN ('pdf', 'image', 'video')),
    file_path TEXT NOT NULL,
    course_id INTEGER REFERENCES public.courses(id),
    class_id INTEGER REFERENCES public.classes(id),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Table: enrollments (track student enrollments in courses)
CREATE TABLE IF NOT EXISTS public.enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
    is_paid BOOLEAN DEFAULT FALSE,
    enrolled_at TIMESTAMP DEFAULT NOW()
);

-- Table: progress (track progress of students within a course)
CREATE TABLE IF NOT EXISTS public.progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES public.classes(id) ON DELETE CASCADE,
    progress_percentage DECIMAL(5, 2),
    last_accessed TIMESTAMP
);

-- Table: payments (tracking course purchases and payments)
CREATE TABLE IF NOT EXISTS public.payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed')),
    payment_gateway_response JSON,
    payment_date TIMESTAMP DEFAULT NOW()
);

-- Indexing for better performance (indexes on frequently queried fields)
CREATE INDEX idx_user_email ON public.users(email);
CREATE INDEX idx_courses_title ON public.courses((title->>'en'));
CREATE INDEX idx_enrollments_user_course ON public.enrollments(user_id, course_id);
CREATE INDEX idx_progress_user_course ON public.progress(user_id, course_id);

COMMIT;
