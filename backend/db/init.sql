-- Disable foreign key checks during initialization
SET session_replication_role = 'replica';

-- Clear existing tables if they exist
DROP TABLE IF EXISTS 
    payments,
    progress,
    enrollments,
    media_files,
    classes,
    courses,
    categories,
    status,
    users,
    privileges CASCADE;

-- Create and populate privileges table
CREATE TABLE privileges (
    id SERIAL PRIMARY KEY,
    name JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO privileges (name) VALUES 
    ('{"en": "admin", "pt": "Administrador"}'),
    ('{"en": "teacher", "pt": "Professor"}'),
    ('{"en": "student", "pt": "Estudante"}');

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    birthday DATE,
    privilege_id INTEGER NOT NULL REFERENCES privileges(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create and populate status table
CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    name JSONB NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO status (name) VALUES 
    ('{"en": "active", "pt": "Ativo"}'),
    ('{"en": "inactive", "pt": "Inativo"}'),
    ('{"en": "draft", "pt": "Rascunho"}'),
    ('{"en": "published", "pt": "Publicado"}'),
    ('{"en": "archived", "pt": "Arquivado"}');

-- Create and populate categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name JSONB NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name) VALUES 
    ('{"en": "Programming", "pt": "Programação"}'),
    ('{"en": "Design", "pt": "Design"}'),
    ('{"en": "Business", "pt": "Negócios"}'),
    ('{"en": "Marketing", "pt": "Marketing"}'),
    ('{"en": "Languages", "pt": "Idiomas"}');

-- Create courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title JSONB NOT NULL,
    subtitle JSONB NOT NULL,
    description JSONB NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    status_id INTEGER NOT NULL REFERENCES status(id),
    teacher_id INTEGER NOT NULL REFERENCES users(id),
    category_id INTEGER NOT NULL REFERENCES categories(id)
);

-- Create classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    title JSONB NOT NULL,
    subtitle JSONB NOT NULL,
    description JSONB NOT NULL,
    video_path TEXT,
    course_id INTEGER NOT NULL REFERENCES courses(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    order_index INTEGER NOT NULL DEFAULT 0
);

-- Create media_files table
CREATE TABLE media_files (
    id SERIAL PRIMARY KEY,
    file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document')),
    file_path TEXT NOT NULL,
    course_id INTEGER REFERENCES courses(id),
    class_id INTEGER REFERENCES classes(id),
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),
    is_paid BOOLEAN DEFAULT FALSE,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    UNIQUE (user_id, course_id)
);

-- Create progress table
CREATE TABLE progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),
    class_id INTEGER REFERENCES classes(id),
    progress_percentage DECIMAL(5, 2) DEFAULT 0.0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_accessed TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT NOT NULL,
    payment_gateway_response JSONB,
    payment_date TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create admin user for initial access
INSERT INTO users (
    username,
    email,
    password,
    privilege_id,
    name
) VALUES (
    'admin',
    'admin@edunova.com',
    '$2a$12$1InE3Tq5B6J.tAQFzm0WY.TtYE9dGKh8jqQHBqiCWfE5d.ixw0ry6', -- Password: Admin123!
    1,
    'System Administrator'
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_courses_status ON courses(status_id);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_classes_course ON classes(course_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_course ON progress(course_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_course ON payments(course_id);

-- Enable foreign key checks
SET session_replication_role = 'origin';