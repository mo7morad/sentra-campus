export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      academic_semesters: {
        Row: {
          academic_year: string
          created_at: string | null
          end_date: string
          id: number
          is_current: boolean | null
          semester_name: string
          start_date: string
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          end_date: string
          id?: number
          is_current?: boolean | null
          semester_name: string
          start_date: string
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          end_date?: string
          id?: number
          is_current?: boolean | null
          semester_name?: string
          start_date?: string
        }
        Relationships: []
      }
      course_offerings: {
        Row: {
          classroom: string | null
          course_id: string
          created_at: string | null
          enrolled_count: number | null
          id: string
          is_active: boolean | null
          lecturer_id: string
          section: string | null
          semester_id: number
        }
        Insert: {
          classroom?: string | null
          course_id: string
          created_at?: string | null
          enrolled_count?: number | null
          id?: string
          is_active?: boolean | null
          lecturer_id: string
          section?: string | null
          semester_id: number
        }
        Update: {
          classroom?: string | null
          course_id?: string
          created_at?: string | null
          enrolled_count?: number | null
          id?: string
          is_active?: boolean | null
          lecturer_id?: string
          section?: string | null
          semester_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_offerings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_offerings_lecturer_id_fkey"
            columns: ["lecturer_id"]
            isOneToOne: false
            referencedRelation: "lecturers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_offerings_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "academic_semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          course_code: string
          course_level: number | null
          course_name: string
          created_at: string | null
          credits: number
          department_id: number
          description: string | null
          id: string
          is_active: boolean | null
          max_capacity: number | null
          prerequisites: string | null
          updated_at: string | null
        }
        Insert: {
          course_code: string
          course_level?: number | null
          course_name: string
          created_at?: string | null
          credits: number
          department_id: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_capacity?: number | null
          prerequisites?: string | null
          updated_at?: string | null
        }
        Update: {
          course_code?: string
          course_level?: number | null
          course_name?: string
          created_at?: string | null
          credits?: number
          department_id?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_capacity?: number | null
          prerequisites?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          department_code: string
          department_name: string
          description: string | null
          head_of_department_id: string | null
          id: number
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_code: string
          department_name: string
          description?: string | null
          head_of_department_id?: string | null
          id?: number
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_code?: string
          department_name?: string
          description?: string | null
          head_of_department_id?: string | null
          id?: number
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_head_of_department_id_fkey"
            columns: ["head_of_department_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          additional_comments: string | null
          availability: number | null
          category_id: number
          communication: number | null
          course_content: number | null
          course_offering_id: string
          created_at: string | null
          id: string
          improvement_suggestions: string | null
          is_anonymous: boolean | null
          overall_rating: number | null
          positive_feedback: string | null
          status_id: number | null
          submission_method: string | null
          teaching_effectiveness: number | null
          updated_at: string | null
        }
        Insert: {
          additional_comments?: string | null
          availability?: number | null
          category_id: number
          communication?: number | null
          course_content?: number | null
          course_offering_id: string
          created_at?: string | null
          id?: string
          improvement_suggestions?: string | null
          is_anonymous?: boolean | null
          overall_rating?: number | null
          positive_feedback?: string | null
          status_id?: number | null
          submission_method?: string | null
          teaching_effectiveness?: number | null
          updated_at?: string | null
        }
        Update: {
          additional_comments?: string | null
          availability?: number | null
          category_id?: number
          communication?: number | null
          course_content?: number | null
          course_offering_id?: string
          created_at?: string | null
          id?: string
          improvement_suggestions?: string | null
          is_anonymous?: boolean | null
          overall_rating?: number | null
          positive_feedback?: string | null
          status_id?: number | null
          submission_method?: string | null
          teaching_effectiveness?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "feedback_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_course_offering_id_fkey"
            columns: ["course_offering_id"]
            isOneToOne: false
            referencedRelation: "course_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "feedback_status"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_categories: {
        Row: {
          category_name: string
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
        }
        Insert: {
          category_name: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
        }
        Update: {
          category_name?: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
        }
        Relationships: []
      }
      feedback_status: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          status_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          status_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          status_name?: string
        }
        Relationships: []
      }
      lecturers: {
        Row: {
          created_at: string | null
          department_id: number
          employment_status: string | null
          first_name: string
          hire_date: string
          id: string
          is_active: boolean | null
          last_name: string
          lecturer_code: string
          office_location: string | null
          phone: string | null
          qualification: string | null
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id: number
          employment_status?: string | null
          first_name: string
          hire_date: string
          id?: string
          is_active?: boolean | null
          last_name: string
          lecturer_code: string
          office_location?: string | null
          phone?: string | null
          qualification?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: number
          employment_status?: string | null
          first_name?: string
          hire_date?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          lecturer_code?: string
          office_location?: string | null
          phone?: string | null
          qualification?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lecturers_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string | null
          current_year: number | null
          department_id: number
          enrollment_date: string
          first_name: string
          graduation_date: string | null
          id: string
          is_active: boolean | null
          last_name: string
          student_number: string
          student_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_year?: number | null
          department_id: number
          enrollment_date: string
          first_name: string
          graduation_date?: string | null
          id?: string
          is_active?: boolean | null
          last_name: string
          student_number: string
          student_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_year?: number | null
          department_id?: number
          enrollment_date?: string
          first_name?: string
          graduation_date?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string
          student_number?: string
          student_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          password_hash: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          password_hash: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          password_hash?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
