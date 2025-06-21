
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Department, Lecturer, Student, Course, CourseOffering, Feedback, AcademicSemester, FeedbackCategory, FeedbackStatus } from '@/types/database';

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('department_name');
      
      if (error) throw error;
      return data as Department[];
    },
  });
};

export const useLecturers = () => {
  return useQuery({
    queryKey: ['lecturers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lecturers')
        .select(`
          *,
          departments (
            department_name
          )
        `)
        .eq('is_active', true)
        .order('first_name');
      
      if (error) throw error;
      return data as (Lecturer & { departments: { department_name: string } })[];
    },
  });
};

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          departments (
            department_name
          )
        `)
        .eq('is_active', true)
        .order('first_name');
      
      if (error) throw error;
      return data as (Student & { departments: { department_name: string } })[];
    },
  });
};

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          departments (
            department_name
          )
        `)
        .eq('is_active', true)
        .order('course_code');
      
      if (error) throw error;
      return data as (Course & { departments: { department_name: string } })[];
    },
  });
};

export const useFeedback = () => {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          course_offerings (
            section,
            classroom,
            courses (
              course_code,
              course_name
            ),
            lecturers (
              first_name,
              last_name
            ),
            academic_semesters (
              semester_name,
              academic_year
            )
          ),
          feedback_categories (
            category_name
          ),
          feedback_status (
            status_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCurrentSemester = () => {
  return useQuery({
    queryKey: ['current-semester'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_semesters')
        .select('*')
        .eq('is_current', true)
        .single();
      
      if (error) throw error;
      return data as AcademicSemester;
    },
  });
};

export const useFeedbackCategories = () => {
  return useQuery({
    queryKey: ['feedback-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback_categories')
        .select('*')
        .eq('is_active', true)
        .order('category_name');
      
      if (error) throw error;
      return data as FeedbackCategory[];
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get counts for dashboard stats
      const [
        { count: totalLecturers },
        { count: totalStudents },
        { count: totalCourses },
        { count: totalFeedback }
      ] = await Promise.all([
        supabase.from('lecturers').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('students').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('feedback').select('*', { count: 'exact', head: true })
      ]);

      // Get average rating
      const { data: avgRatingData } = await supabase
        .from('feedback')
        .select('overall_rating')
        .not('overall_rating', 'is', null);

      const avgRating = avgRatingData?.length 
        ? avgRatingData.reduce((sum, item) => sum + (item.overall_rating || 0), 0) / avgRatingData.length
        : 0;

      return {
        totalLecturers: totalLecturers || 0,
        totalStudents: totalStudents || 0,
        totalCourses: totalCourses || 0,
        totalFeedback: totalFeedback || 0,
        avgRating: Math.round(avgRating * 10) / 10
      };
    },
  });
};
