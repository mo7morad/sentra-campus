
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

export const useCourseOfferings = () => {
  return useQuery({
    queryKey: ['course-offerings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_offerings')
        .select(`
          *,
          courses (
            course_code,
            course_name,
            departments (
              id,
              department_name
            )
          ),
          lecturers (
            first_name,
            last_name,
            lecturer_code
          ),
          academic_semesters (
            id,
            semester_name,
            academic_year
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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
            id,
            section,
            classroom,
            enrolled_count,
            lecturer_id,
            course_id,
            semester_id,
            courses (
              id,
              course_code,
              course_name,
              department_id
            ),
            lecturers (
              id,
              first_name,
              last_name
            ),
            academic_semesters (
              id,
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
      
      if (error) {
        // If no current semester is set, get the most recent one
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('academic_semesters')
          .select('*')
          .order('start_date', { ascending: false })
          .limit(1)
          .single();
        
        if (fallbackError) throw fallbackError;
        return fallbackData as AcademicSemester;
      }
      return data as AcademicSemester;
    },
  });
};

export const useAcademicSemesters = () => {
  return useQuery({
    queryKey: ['academic-semesters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_semesters')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data as AcademicSemester[];
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

export const useFeedbackStatus = () => {
  return useQuery({
    queryKey: ['feedback-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback_status')
        .select('*')
        .order('status_name');
      
      if (error) throw error;
      return data as FeedbackStatus[];
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      console.log('Fetching dashboard stats...');
      
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

      console.log('Counts fetched:', { totalLecturers, totalStudents, totalCourses, totalFeedback });

      // Get average rating
      const { data: avgRatingData } = await supabase
        .from('feedback')
        .select('overall_rating')
        .not('overall_rating', 'is', null);

      const avgRating = avgRatingData?.length 
        ? avgRatingData.reduce((sum, item) => sum + (item.overall_rating || 0), 0) / avgRatingData.length
        : 0;

      console.log('Average rating calculated:', avgRating);

      const stats = {
        totalLecturers: totalLecturers || 0,
        totalStudents: totalStudents || 0,
        totalCourses: totalCourses || 0,
        totalFeedback: totalFeedback || 0,
        avgRating: Math.round(avgRating * 10) / 10
      };

      console.log('Final dashboard stats:', stats);
      return stats;
    },
  });
};

// Additional specialized hooks for specific data needs
export const useLecturerById = (lecturerId: string) => {
  return useQuery({
    queryKey: ['lecturer', lecturerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lecturers')
        .select(`
          *,
          departments (
            department_name
          )
        `)
        .eq('id', lecturerId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!lecturerId,
  });
};

export const useCourseById = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          departments (
            department_name
          )
        `)
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};

export const useFeedbackByLecturer = (lecturerId: string) => {
  return useQuery({
    queryKey: ['feedback-by-lecturer', lecturerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          course_offerings!inner (
            lecturer_id,
            courses (
              course_name,
              course_code
            )
          )
        `)
        .eq('course_offerings.lecturer_id', lecturerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!lecturerId,
  });
};

export const useFeedbackByCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['feedback-by-course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          course_offerings!inner (
            course_id,
            lecturers (
              first_name,
              last_name
            )
          )
        `)
        .eq('course_offerings.course_id', courseId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};
