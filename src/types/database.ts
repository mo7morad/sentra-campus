
// Database types for the simplified schema
export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: number;
  department_code: string;
  department_name: string;
  head_of_department_id?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lecturer {
  id: string;
  lecturer_code: string;
  first_name: string;
  last_name: string;
  department_id: number;
  hire_date: string;
  employment_status: string;
  qualification?: string;
  specialization?: string;
  office_location?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  department_id: number;
  enrollment_date: string;
  graduation_date?: string;
  current_year?: number;
  student_status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  department_id: number;
  credits: number;
  course_level?: number;
  max_capacity?: number;
  description?: string;
  prerequisites?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseOffering {
  id: string;
  course_id: string;
  lecturer_id: string;
  semester_id: number;
  section: string;
  enrolled_count: number;
  classroom?: string;
  is_active: boolean;
  created_at: string;
}

export interface Feedback {
  id: string;
  course_offering_id: string;
  category_id: number;
  status_id: number;
  overall_rating?: number;
  teaching_effectiveness?: number;
  course_content?: number;
  communication?: number;
  availability?: number;
  positive_feedback?: string;
  improvement_suggestions?: string;
  additional_comments?: string;
  submission_method: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicSemester {
  id: number;
  semester_name: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
}

export interface FeedbackCategory {
  id: number;
  category_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface FeedbackStatus {
  id: number;
  status_name: string;
  description?: string;
  created_at: string;
}
