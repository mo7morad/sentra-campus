
-- Drop existing tables in correct order (respecting foreign key dependencies)
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS course_offerings CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS lecturers CASCADE;
DROP TABLE IF EXISTS academic_semesters CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS feedback_categories CASCADE;
DROP TABLE IF EXISTS feedback_status CASCADE;

-- Drop materialized views if they exist
DROP MATERIALIZED VIEW IF EXISTS lecturer_performance_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS course_evaluation_summary CASCADE;

-- Drop any remaining tables from the old schema
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS system_metrics CASCADE;

-- Simplified Campus Management Information System - Manager-Only Version
-- Created: 2025-06-19
-- Version: 2.0

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- LOOKUP TABLES
-- ============================================================================

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

-- Users table (simplified for managers only)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic semesters table
CREATE TABLE academic_semesters (
    id SERIAL PRIMARY KEY,
    semester_name VARCHAR(50) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(semester_name, academic_year)
);

-- Lecturers table (simplified)
CREATE TABLE lecturers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lecturer_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department_id INTEGER NOT NULL REFERENCES departments(id),
    hire_date DATE NOT NULL,
    employment_status VARCHAR(50) DEFAULT 'Active',
    qualification VARCHAR(200),
    specialization TEXT,
    office_location VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table (simplified)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department_id INTEGER NOT NULL REFERENCES departments(id),
    enrollment_date DATE NOT NULL,
    graduation_date DATE,
    current_year INTEGER CHECK (current_year BETWEEN 1 AND 6),
    student_status VARCHAR(50) DEFAULT 'Active',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course offerings (links courses to semesters and lecturers)
CREATE TABLE course_offerings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    lecturer_id UUID NOT NULL REFERENCES lecturers(id),
    semester_id INTEGER NOT NULL REFERENCES academic_semesters(id),
    section VARCHAR(10) DEFAULT 'A',
    enrolled_count INTEGER DEFAULT 0 CHECK (enrolled_count >= 0),
    classroom VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, lecturer_id, semester_id, section)
);

-- Main feedback table (anonymous by design)
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_offering_id UUID NOT NULL REFERENCES course_offerings(id),
    category_id INTEGER NOT NULL REFERENCES feedback_categories(id),
    status_id INTEGER DEFAULT 1 REFERENCES feedback_status(id),
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    teaching_effectiveness INTEGER CHECK (teaching_effectiveness BETWEEN 1 AND 5),
    course_content INTEGER CHECK (course_content BETWEEN 1 AND 5),
    communication INTEGER CHECK (communication BETWEEN 1 AND 5),
    availability INTEGER CHECK (availability BETWEEN 1 AND 5),
    positive_feedback TEXT,
    improvement_suggestions TEXT,
    additional_comments TEXT,
    submission_method VARCHAR(50) DEFAULT 'web',
    is_anonymous BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INITIAL DATA POPULATION
-- ============================================================================

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

-- Insert 2 manager users
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
('manager1@university.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLyPP', 'Sarah', 'Johnson'),
('manager2@university.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLyPP', 'Michael', 'Chen');

-- Insert departments
INSERT INTO departments (department_code, department_name, description, head_of_department_id) VALUES
('CSE', 'Computer Science & Engineering', 'Department of Computer Science and Engineering', (SELECT id FROM users WHERE email = 'manager1@university.edu')),
('EEE', 'Electrical & Electronic Engineering', 'Department of Electrical and Electronic Engineering', (SELECT id FROM users WHERE email = 'manager2@university.edu')),
('MATH', 'Mathematics', 'Department of Mathematics', NULL),
('PHYS', 'Physics', 'Department of Physics', NULL),
('ENG', 'English', 'Department of English Literature', NULL),
('BUS', 'Business Administration', 'Department of Business Administration', NULL);

-- Insert academic semesters
INSERT INTO academic_semesters (semester_name, academic_year, start_date, end_date, is_current) VALUES
('Fall', '2023-2024', '2023-09-01', '2023-12-15', FALSE),
('Spring', '2023-2024', '2024-01-15', '2024-05-15', FALSE),
('Summer', '2023-2024', '2024-06-01', '2024-08-15', FALSE),
('Fall', '2024-2025', '2024-09-01', '2024-12-15', TRUE),
('Spring', '2024-2025', '2025-01-15', '2025-05-15', FALSE),
('Summer', '2024-2025', '2025-06-01', '2025-08-15', FALSE);

-- Insert lecturers
INSERT INTO lecturers (lecturer_code, first_name, last_name, department_id, hire_date, employment_status, qualification, specialization, office_location, phone) VALUES
('L001', 'Dr. John', 'Smith', 1, '2020-08-15', 'Active', 'PhD in Computer Science', 'Machine Learning, AI', 'CSE-201', '+1-555-0101'),
('L002', 'Prof. Emily', 'Davis', 1, '2018-09-01', 'Active', 'PhD in Software Engineering', 'Software Architecture, DevOps', 'CSE-203', '+1-555-0102'),
('L003', 'Dr. Robert', 'Wilson', 2, '2019-01-20', 'Active', 'PhD in Electrical Engineering', 'Power Systems, Renewable Energy', 'EEE-101', '+1-555-0201'),
('L004', 'Dr. Lisa', 'Anderson', 2, '2021-03-10', 'Active', 'PhD in Electronics', 'Digital Signal Processing', 'EEE-103', '+1-555-0202'),
('L005', 'Prof. David', 'Brown', 3, '2017-08-25', 'Active', 'PhD in Mathematics', 'Applied Mathematics, Statistics', 'MATH-301', '+1-555-0301'),
('L006', 'Dr. Maria', 'Garcia', 3, '2020-02-14', 'Active', 'PhD in Pure Mathematics', 'Algebra, Number Theory', 'MATH-302', '+1-555-0302'),
('L007', 'Dr. James', 'Miller', 4, '2019-09-05', 'Active', 'PhD in Physics', 'Quantum Physics, Optics', 'PHYS-401', '+1-555-0401'),
('L008', 'Prof. Susan', 'Taylor', 5, '2018-01-15', 'Active', 'PhD in English Literature', 'Modern Literature, Creative Writing', 'ENG-501', '+1-555-0501'),
('L009', 'Dr. Mark', 'Johnson', 6, '2020-07-01', 'Active', 'PhD in Business Administration', 'Finance, Strategic Management', 'BUS-601', '+1-555-0601'),
('L010', 'Dr. Karen', 'White', 1, '2022-01-10', 'Active', 'PhD in Computer Science', 'Cybersecurity, Network Security', 'CSE-205', '+1-555-0103');

-- Insert students
INSERT INTO students (student_number, first_name, last_name, department_id, enrollment_date, current_year, student_status) VALUES
('S2021001', 'Alice', 'Johnson', 1, '2021-09-01', 3, 'Active'),
('S2021002', 'Bob', 'Williams', 1, '2021-09-01', 3, 'Active'),
('S2021003', 'Charlie', 'Brown', 2, '2021-09-01', 3, 'Active'),
('S2021004', 'Diana', 'Davis', 2, '2021-09-01', 3, 'Active'),
('S2022001', 'Eva', 'Miller', 1, '2022-09-01', 2, 'Active'),
('S2022002', 'Frank', 'Wilson', 3, '2022-09-01', 2, 'Active'),
('S2022003', 'Grace', 'Moore', 4, '2022-09-01', 2, 'Active'),
('S2022004', 'Henry', 'Taylor', 5, '2022-09-01', 2, 'Active'),
('S2023001', 'Ivy', 'Anderson', 1, '2023-09-01', 1, 'Active'),
('S2023002', 'Jack', 'Thomas', 2, '2023-09-01', 1, 'Active'),
('S2023003', 'Kate', 'Jackson', 3, '2023-09-01', 1, 'Active'),
('S2023004', 'Leo', 'White', 6, '2023-09-01', 1, 'Active'),
('S2024001', 'Mia', 'Harris', 1, '2024-09-01', 1, 'Active'),
('S2024002', 'Noah', 'Martin', 2, '2024-09-01', 1, 'Active'),
('S2024003', 'Olivia', 'Garcia', 4, '2024-09-01', 1, 'Active'),
('S2020001', 'Paul', 'Rodriguez', 1, '2020-09-01', 4, 'Active'),
('S2020002', 'Quinn', 'Lewis', 2, '2020-09-01', 4, 'Active'),
('S2019001', 'Rachel', 'Lee', 3, '2019-09-01', 5, 'Active'),
('S2019002', 'Sam', 'Walker', 5, '2019-09-01', 5, 'Active'),
('S2018001', 'Tina', 'Hall', 6, '2018-09-01', 6, 'Active');

-- Insert courses
INSERT INTO courses (course_code, course_name, department_id, credits, course_level, max_capacity, description, prerequisites) VALUES
('CSE101', 'Introduction to Programming', 1, 3, 100, 50, 'Basic programming concepts using Python', NULL),
('CSE201', 'Data Structures and Algorithms', 1, 4, 200, 40, 'Fundamental data structures and algorithms', 'CSE101'),
('CSE301', 'Database Systems', 1, 3, 300, 35, 'Database design and SQL programming', 'CSE201'),
('CSE401', 'Machine Learning', 1, 4, 400, 30, 'Introduction to machine learning algorithms', 'CSE301, MATH201'),
('EEE101', 'Circuit Analysis', 2, 4, 100, 45, 'Basic electrical circuit analysis', NULL),
('EEE201', 'Digital Electronics', 2, 3, 200, 40, 'Digital logic design and implementation', 'EEE101'),
('EEE301', 'Power Systems', 2, 4, 300, 30, 'Power generation and distribution systems', 'EEE201'),
('MATH101', 'Calculus I', 3, 4, 100, 60, 'Differential and integral calculus', NULL),
('MATH201', 'Statistics', 3, 3, 200, 50, 'Probability and statistical analysis', 'MATH101'),
('MATH301', 'Linear Algebra', 3, 3, 300, 40, 'Vector spaces and matrix operations', 'MATH201'),
('PHYS101', 'Physics I', 4, 4, 100, 55, 'Mechanics and thermodynamics', NULL),
('PHYS201', 'Physics II', 4, 4, 200, 45, 'Electricity, magnetism, and waves', 'PHYS101'),
('ENG101', 'English Composition', 5, 3, 100, 25, 'Academic writing and communication', NULL),
('ENG201', 'Literature Survey', 5, 3, 200, 30, 'Survey of world literature', 'ENG101'),
('BUS101', 'Business Fundamentals', 6, 3, 100, 40, 'Introduction to business concepts', NULL),
('BUS201', 'Marketing Principles', 6, 3, 200, 35, 'Marketing strategy and consumer behavior', 'BUS101');

-- Insert course offerings for multiple semesters
INSERT INTO course_offerings (course_id, lecturer_id, semester_id, section, enrolled_count, classroom) VALUES
-- Fall 2023-2024 offerings
((SELECT id FROM courses WHERE course_code = 'CSE101'), (SELECT id FROM lecturers WHERE lecturer_code = 'L001'), 1, 'A', 48, 'CSE-Lab-1'),
((SELECT id FROM courses WHERE course_code = 'CSE201'), (SELECT id FROM lecturers WHERE lecturer_code = 'L002'), 1, 'A', 38, 'CSE-Lab-2'),
((SELECT id FROM courses WHERE course_code = 'EEE101'), (SELECT id FROM lecturers WHERE lecturer_code = 'L003'), 1, 'A', 42, 'EEE-Lab-1'),
((SELECT id FROM courses WHERE course_code = 'MATH101'), (SELECT id FROM lecturers WHERE lecturer_code = 'L005'), 1, 'A', 55, 'MATH-201'),
((SELECT id FROM courses WHERE course_code = 'PHYS101'), (SELECT id FROM lecturers WHERE lecturer_code = 'L007'), 1, 'A', 50, 'PHYS-Lab-1'),
-- Spring 2023-2024 offerings
((SELECT id FROM courses WHERE course_code = 'CSE201'), (SELECT id FROM lecturers WHERE lecturer_code = 'L001'), 2, 'A', 35, 'CSE-Lab-1'),
((SELECT id FROM courses WHERE course_code = 'CSE301'), (SELECT id FROM lecturers WHERE lecturer_code = 'L002'), 2, 'A', 32, 'CSE-Lab-3'),
((SELECT id FROM courses WHERE course_code = 'EEE201'), (SELECT id FROM lecturers WHERE lecturer_code = 'L004'), 2, 'A', 38, 'EEE-Lab-2'),
((SELECT id FROM courses WHERE course_code = 'MATH201'), (SELECT id FROM lecturers WHERE lecturer_code = 'L006'), 2, 'A', 45, 'MATH-202'),
((SELECT id FROM courses WHERE course_code = 'ENG101'), (SELECT id FROM lecturers WHERE lecturer_code = 'L008'), 2, 'A', 22, 'ENG-101'),
-- Fall 2024-2025 offerings (current)
((SELECT id FROM courses WHERE course_code = 'CSE101'), (SELECT id FROM lecturers WHERE lecturer_code = 'L010'), 4, 'A', 45, 'CSE-Lab-1'),
((SELECT id FROM courses WHERE course_code = 'CSE201'), (SELECT id FROM lecturers WHERE lecturer_code = 'L001'), 4, 'A', 40, 'CSE-Lab-2'),
((SELECT id FROM courses WHERE course_code = 'CSE301'), (SELECT id FROM lecturers WHERE lecturer_code = 'L002'), 4, 'A', 33, 'CSE-Lab-3'),
((SELECT id FROM courses WHERE course_code = 'CSE401'), (SELECT id FROM lecturers WHERE lecturer_code = 'L001'), 4, 'A', 28, 'CSE-Lab-4'),
((SELECT id FROM courses WHERE course_code = 'EEE101'), (SELECT id FROM lecturers WHERE lecturer_code = 'L003'), 4, 'A', 43, 'EEE-Lab-1'),
((SELECT id FROM courses WHERE course_code = 'EEE201'), (SELECT id FROM lecturers WHERE lecturer_code = 'L004'), 4, 'A', 37, 'EEE-Lab-2'),
((SELECT id FROM courses WHERE course_code = 'EEE301'), (SELECT id FROM lecturers WHERE lecturer_code = 'L003'), 4, 'A', 29, 'EEE-Lab-3'),
((SELECT id FROM courses WHERE course_code = 'MATH101'), (SELECT id FROM lecturers WHERE lecturer_code = 'L005'), 4, 'A', 58, 'MATH-201'),
((SELECT id FROM courses WHERE course_code = 'MATH201'), (SELECT id FROM lecturers WHERE lecturer_code = 'L006'), 4, 'A', 47, 'MATH-202'),
((SELECT id FROM courses WHERE course_code = 'BUS101'), (SELECT id FROM lecturers WHERE lecturer_code = 'L009'), 4, 'A', 39, 'BUS-101');

-- Insert feedback data (fixed ambiguous column references)
INSERT INTO feedback (course_offering_id, category_id, status_id, overall_rating, teaching_effectiveness, course_content, communication, availability, positive_feedback, improvement_suggestions, additional_comments) VALUES
-- Feedback for CSE101 (Fall 2023)
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'CSE101' AND co.semester_id = 1), 1, 2, 4, 5, 4, 4, 3, 'Great introduction to programming. Clear explanations.', 'More practical exercises would be helpful.', 'Overall satisfied with the course.'),
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'CSE101' AND co.semester_id = 1), 1, 2, 5, 5, 5, 5, 4, 'Excellent teacher! Made complex concepts easy to understand.', 'Nothing to improve, perfect course.', 'Highly recommend this course.'),
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'CSE101' AND co.semester_id = 1), 1, 2, 3, 3, 4, 3, 2, 'Course content was good but lectures were sometimes unclear.', 'Improve explanation clarity and office hours.', 'Average experience.'),
-- Feedback for CSE201 (Fall 2023)
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'CSE201' AND co.semester_id = 1), 1, 2, 4, 4, 5, 4, 4, 'Very comprehensive coverage of data structures.', 'More coding practice sessions needed.', 'Challenging but rewarding course.'),
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'CSE201' AND co.semester_id = 1), 2, 2, 5, 5, 4, 5, 5, 'Prof. Davis is amazing! Always available to help.', 'Course is perfect as is.', 'Best course this semester.'),
-- Feedback for EEE101 (Fall 2023)
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'EEE101' AND co.semester_id = 1), 1, 2, 4, 4, 4, 3, 3, 'Good foundation in circuit analysis.', 'More lab time for hands-on practice.', 'Solid course overall.'),
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'EEE101' AND co.semester_id = 1), 1, 2, 3, 3, 4, 3, 2, 'Content is relevant but delivery could be better.', 'Use more visual aids and examples.', 'Room for improvement.'),
-- Feedback for current semester courses
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'CSE101' AND co.semester_id = 4), 1, 1, 5, 5, 4, 5, 4, 'Dr. White brings fresh perspective to the course.', 'More real-world programming examples.', 'Enjoying the new teaching style.'),
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'CSE201' AND co.semester_id = 4), 1, 1, 4, 4, 5, 4, 3, 'Consistent quality from Dr. Smith.', 'Provide more algorithm visualization tools.', 'Solid as always.'),
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'CSE401' AND co.semester_id = 4), 2, 1, 5, 5, 5, 4, 4, 'Cutting-edge ML course content.', 'More GPU resources for training models.', 'Excellent advanced course.'),
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'EEE301' AND co.semester_id = 4), 1, 1, 4, 4, 4, 4, 3, 'Comprehensive power systems coverage.', 'Industry guest lectures would be valuable.', 'Good preparation for industry.'),
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'MATH201' AND co.semester_id = 4), 1, 1, 3, 3, 4, 3, 2, 'Statistics concepts are well explained.', 'More interactive problem-solving sessions.', 'Could use more engagement.'),
((SELECT co.id FROM course_offerings co JOIN courses c ON co.course_id = c.id WHERE c.course_code = 'BUS101' AND co.semester_id = 4), 1, 1, 4, 4, 3, 4, 4, 'Great introduction to business concepts.', 'More case studies from local businesses.', 'Practical and useful course.');

-- Schema creation complete
SELECT 'Simplified Campus MIS Database Schema created successfully with realistic data!' as status;
