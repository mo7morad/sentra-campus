
-- Campus Management Information System - Optimized Database Schema
-- Created: 2025-06-19
-- Version: 1.0

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- LOOKUP TABLES
-- ============================================================================

-- User roles lookup table
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback status lookup table
CREATE TABLE feedback_status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback categories lookup table
CREATE TABLE feedback_categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CORE ENTITY TABLES
-- ============================================================================

-- Users table (centralized user management)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES user_roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    department_code VARCHAR(10) UNIQUE NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    head_of_department_id UUID REFERENCES users(id),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Academic semesters table
CREATE TABLE academic_semesters (
    id SERIAL PRIMARY KEY,
    semester_name VARCHAR(50) NOT NULL,
    academic_year VARCHAR(9) NOT NULL, -- Format: 2023-2024
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT semester_date_check CHECK (end_date > start_date),
    CONSTRAINT academic_year_format CHECK (academic_year ~ '^\d{4}-\d{4}$'),
    UNIQUE(semester_name, academic_year)
);

-- Lecturers table (enhanced with performance tracking)
CREATE TABLE lecturers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lecturer_id VARCHAR(20) UNIQUE NOT NULL,
    department_id INTEGER NOT NULL REFERENCES departments(id),
    hire_date DATE NOT NULL,
    employment_status VARCHAR(50) DEFAULT 'Active',
    qualification VARCHAR(200),
    specialization TEXT,
    office_location VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT employment_status_check CHECK (employment_status IN ('Active', 'On Leave', 'Suspended', 'Terminated')),
    CONSTRAINT phone_format_check CHECK (phone ~ '^\+?[\d\s\-\(\)]+$')
);

-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    department_id INTEGER NOT NULL REFERENCES departments(id),
    enrollment_date DATE NOT NULL,
    graduation_date DATE,
    current_year INTEGER CHECK (current_year BETWEEN 1 AND 6),
    student_status VARCHAR(50) DEFAULT 'Active',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT student_status_check CHECK (student_status IN ('Active', 'Graduated', 'Suspended', 'Withdrawn', 'On Leave')),
    CONSTRAINT graduation_date_check CHECK (graduation_date IS NULL OR graduation_date > enrollment_date)
);

-- Courses table (enhanced with capacity and prerequisites)
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    department_id INTEGER NOT NULL REFERENCES departments(id),
    credits INTEGER NOT NULL CHECK (credits > 0),
    course_level INTEGER CHECK (course_level BETWEEN 100 AND 900),
    max_capacity INTEGER CHECK (max_capacity > 0),
    description TEXT,
    prerequisites TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Course offerings (links courses to semesters and lecturers)
CREATE TABLE course_offerings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    lecturer_id UUID NOT NULL REFERENCES lecturers(id),
    semester_id INTEGER NOT NULL REFERENCES academic_semesters(id),
    section VARCHAR(10) DEFAULT 'A',
    enrolled_count INTEGER DEFAULT 0 CHECK (enrolled_count >= 0),
    schedule_info JSONB, -- Store class schedule as JSON
    classroom VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(course_id, lecturer_id, semester_id, section)
);

-- ============================================================================
-- FEEDBACK SYSTEM TABLES
-- ============================================================================

-- Main feedback table (anonymous by design)
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_offering_id UUID NOT NULL REFERENCES course_offerings(id),
    category_id INTEGER NOT NULL REFERENCES feedback_categories(id),
    status_id INTEGER DEFAULT 1 REFERENCES feedback_status(id),
    
    -- Rating fields (1-5 scale)
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    teaching_effectiveness INTEGER CHECK (teaching_effectiveness BETWEEN 1 AND 5),
    course_content INTEGER CHECK (course_content BETWEEN 1 AND 5),
    communication INTEGER CHECK (communication BETWEEN 1 AND 5),
    availability INTEGER CHECK (availability BETWEEN 1 AND 5),
    
    -- Text feedback
    positive_feedback TEXT,
    improvement_suggestions TEXT,
    additional_comments TEXT,
    
    -- Metadata
    submission_method VARCHAR(50) DEFAULT 'web',
    ip_address INET, -- For basic analytics while maintaining anonymity
    user_agent TEXT,
    is_anonymous BOOLEAN DEFAULT TRUE,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT feedback_ratings_check CHECK (
        overall_rating IS NOT NULL OR 
        teaching_effectiveness IS NOT NULL OR 
        course_content IS NOT NULL OR 
        communication IS NOT NULL OR 
        availability IS NOT NULL
    )
);

-- ============================================================================
-- AUDIT AND LOGGING TABLES
-- ============================================================================

-- System audit log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    record_id VARCHAR(100) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User session tracking
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- System metrics for monitoring
CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_data JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_metrics_name_time (metric_name, recorded_at)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- Lecturers table indexes
CREATE INDEX idx_lecturers_user_id ON lecturers(user_id);
CREATE INDEX idx_lecturers_department ON lecturers(department_id);
CREATE INDEX idx_lecturers_active ON lecturers(is_active) WHERE is_active = TRUE;

-- Students table indexes
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_department ON students(department_id);
CREATE INDEX idx_students_status ON students(student_status);

-- Courses table indexes
CREATE INDEX idx_courses_department ON courses(department_id);
CREATE INDEX idx_courses_level ON courses(course_level);
CREATE INDEX idx_courses_active ON courses(is_active) WHERE is_active = TRUE;

-- Course offerings indexes
CREATE INDEX idx_course_offerings_course ON course_offerings(course_id);
CREATE INDEX idx_course_offerings_lecturer ON course_offerings(lecturer_id);
CREATE INDEX idx_course_offerings_semester ON course_offerings(semester_id);

-- Feedback table indexes
CREATE INDEX idx_feedback_course_offering ON feedback(course_offering_id);
CREATE INDEX idx_feedback_category ON feedback(category_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);
CREATE INDEX idx_feedback_ratings ON feedback(overall_rating) WHERE overall_rating IS NOT NULL;

-- Audit logs indexes
CREATE INDEX idx_audit_logs_table_operation ON audit_logs(table_name, operation);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- MATERIALIZED VIEWS FOR ANALYTICS
-- ============================================================================

-- Lecturer performance summary view
CREATE MATERIALIZED VIEW lecturer_performance_summary AS
SELECT 
    l.id as lecturer_id,
    l.lecturer_id,
    u.first_name || ' ' || u.last_name as lecturer_name,
    d.department_name,
    COUNT(DISTINCT co.id) as total_courses_taught,
    COUNT(f.id) as total_feedback_received,
    ROUND(AVG(f.overall_rating), 2) as avg_overall_rating,
    ROUND(AVG(f.teaching_effectiveness), 2) as avg_teaching_effectiveness,
    ROUND(AVG(f.course_content), 2) as avg_course_content,
    ROUND(AVG(f.communication), 2) as avg_communication,
    ROUND(AVG(f.availability), 2) as avg_availability,
    MAX(f.created_at) as last_feedback_date
FROM lecturers l
JOIN users u ON l.user_id = u.id
JOIN departments d ON l.department_id = d.id
LEFT JOIN course_offerings co ON l.id = co.lecturer_id
LEFT JOIN feedback f ON co.id = f.course_offering_id
WHERE l.is_active = TRUE
GROUP BY l.id, l.lecturer_id, u.first_name, u.last_name, d.department_name;

-- Course evaluation summary view
CREATE MATERIALIZED VIEW course_evaluation_summary AS
SELECT 
    c.id as course_id,
    c.course_code,
    c.course_name,
    d.department_name,
    COUNT(DISTINCT co.id) as total_offerings,
    COUNT(f.id) as total_feedback_received,
    ROUND(AVG(f.overall_rating), 2) as avg_overall_rating,
    ROUND(AVG(f.course_content), 2) as avg_course_content,
    MAX(f.created_at) as last_feedback_date
FROM courses c
JOIN departments d ON c.department_id = d.id
LEFT JOIN course_offerings co ON c.id = co.course_id
LEFT JOIN feedback f ON co.id = f.course_offering_id
WHERE c.is_active = TRUE
GROUP BY c.id, c.course_code, c.course_name, d.department_name;

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lecturers_updated_at BEFORE UPDATE ON lecturers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one current semester
CREATE OR REPLACE FUNCTION ensure_single_current_semester()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_current = TRUE THEN
        UPDATE academic_semesters 
        SET is_current = FALSE 
        WHERE id != NEW.id AND is_current = TRUE;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER ensure_single_current_semester_trigger
    BEFORE INSERT OR UPDATE ON academic_semesters
    FOR EACH ROW EXECUTE FUNCTION ensure_single_current_semester();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY users_own_data ON users
    FOR ALL USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY users_admin_access ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            JOIN user_roles ur ON u.role_id = ur.id 
            WHERE u.id = auth.uid() AND ur.role_name = 'Admin'
        )
    );

-- Lecturers can view their own lecturer data
CREATE POLICY lecturers_own_data ON lecturers
    FOR ALL USING (user_id = auth.uid());

-- Students can view their own student data
CREATE POLICY students_own_data ON students
    FOR ALL USING (user_id = auth.uid());

-- Feedback is anonymous but can be viewed by authorized roles
CREATE POLICY feedback_view_policy ON feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            JOIN user_roles ur ON u.role_id = ur.id 
            WHERE u.id = auth.uid() AND ur.role_name IN ('Admin', 'Management', 'Faculty')
        )
    );

-- ============================================================================
-- INITIAL DATA POPULATION
-- ============================================================================

-- Insert user roles
INSERT INTO user_roles (role_name, description) VALUES
('Admin', 'System administrator with full access'),
('Management', 'Academic management with reporting access'),
('Faculty', 'Teaching staff with limited access'),
('Student', 'Students with feedback submission access');

-- Insert feedback status
INSERT INTO feedback_status (status_name, description) VALUES
('Pending', 'Feedback submitted and pending review'),
('Reviewed', 'Feedback has been reviewed by management'),
('Archived', 'Feedback has been archived'),
('Flagged', 'Feedback requires special attention');

-- Insert feedback categories
INSERT INTO feedback_categories (category_name, description) VALUES
('Course Evaluation', 'General course and teaching evaluation'),
('Teaching Methods', 'Feedback on teaching methodologies'),
('Course Content', 'Feedback on course material and curriculum'),
('Assessment', 'Feedback on exams and assignments'),
('Classroom Environment', 'Feedback on physical and virtual classroom'),
('Communication', 'Feedback on lecturer communication skills'),
('Other', 'General feedback not covered by other categories');

-- Create refresh function for materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW lecturer_performance_summary;
    REFRESH MATERIALIZED VIEW course_evaluation_summary;
END;
$$ language 'plpgsql';

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'Central user management for all system users';
COMMENT ON TABLE lecturers IS 'Faculty members who teach courses';
COMMENT ON TABLE students IS 'Students enrolled in the institution';
COMMENT ON TABLE courses IS 'Course catalog and information';
COMMENT ON TABLE course_offerings IS 'Specific course instances per semester';
COMMENT ON TABLE feedback IS 'Anonymous student feedback on courses and lecturers';
COMMENT ON TABLE audit_logs IS 'System audit trail for compliance and debugging';

COMMENT ON COLUMN feedback.is_anonymous IS 'Indicates if feedback is submitted anonymously (default: true)';
COMMENT ON COLUMN course_offerings.schedule_info IS 'JSON field storing class schedule details';
COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp - NULL means not deleted';

-- Schema creation complete
SELECT 'Campus MIS Database Schema created successfully!' as status;
