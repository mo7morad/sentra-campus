
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  MessageSquare
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useStudents, useLecturers, useCourses, useCourseOfferings, useFeedback } from "@/hooks/useData";

// University color palette
const COLORS = {
  primary: '#1e40af',      // Blue
  secondary: '#059669',    // Green
  accent: '#dc2626',       // Red for inactive
  muted: '#64748b'         // Slate gray
};

const CHART_COLORS = ['#1e40af', '#059669', '#f59e0b', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: lecturers, isLoading: lecturersLoading } = useLecturers();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: courseOfferings } = useCourseOfferings();
  const { data: feedback, isLoading: feedbackLoading } = useFeedback();

  // 1. Students Overview Data
  const studentsOverview = useMemo(() => {
    if (!students) return { active: 0, inactive: 0, chartData: [] };
    
    const active = students.filter(s => s.student_status === 'Active').length;
    const inactive = students.length - active;
    
    return {
      active,
      inactive,
      chartData: [
        { name: 'Active', value: active, color: COLORS.secondary },
        { name: 'Inactive', value: inactive, color: COLORS.accent }
      ].filter(item => item.value > 0)
    };
  }, [students]);

  // 2. Lecturers Performance Data
  const lecturersPerformance = useMemo(() => {
    if (!lecturers || !courseOfferings || !feedback) return [];
    
    const lecturerRatings = lecturers.map(lecturer => {
      const lecturerOfferings = courseOfferings.filter(
        offering => offering.lecturer_id === lecturer.id
      );
      
      const lecturerFeedback = feedback.filter(f => 
        lecturerOfferings.some(offering => offering.id === f.course_offering_id) &&
        f.overall_rating !== null
      );
      
      if (lecturerFeedback.length === 0) return null;
      
      const avgRating = lecturerFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / lecturerFeedback.length;
      
      return {
        name: `${lecturer.first_name} ${lecturer.last_name}`,
        rating: Math.round(avgRating * 10) / 10,
        feedbackCount: lecturerFeedback.length
      };
    }).filter(item => item !== null)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8); // Top 8 lecturers
    
    return lecturerRatings;
  }, [lecturers, courseOfferings, feedback]);

  // 3. Courses Performance Data
  const coursesPerformance = useMemo(() => {
    if (!courses || !courseOfferings || !feedback) return [];
    
    const courseRatings = courses.map(course => {
      const courseOfferingsForCourse = courseOfferings.filter(
        offering => offering.course_id === course.id
      );
      
      const courseFeedback = feedback.filter(f => 
        courseOfferingsForCourse.some(offering => offering.id === f.course_offering_id) &&
        f.overall_rating !== null
      );
      
      if (courseFeedback.length === 0) return null;
      
      const avgRating = courseFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / courseFeedback.length;
      
      return {
        name: course.course_name.length > 20 ? 
          course.course_name.substring(0, 20) + '...' : 
          course.course_name,
        fullName: course.course_name,
        rating: Math.round(avgRating * 10) / 10,
        feedbackCount: courseFeedback.length
      };
    }).filter(item => item !== null)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8); // Top 8 courses
    
    return courseRatings;
  }, [courses, courseOfferings, feedback]);

  // 4. Feedback Overview Data
  const feedbackOverview = useMemo(() => {
    if (!feedback) return { 
      total: 0, 
      avgRating: 0, 
      distribution: [] 
    };
    
    const validFeedback = feedback.filter(f => f.overall_rating !== null);
    const total = validFeedback.length;
    const avgRating = total > 0 ? 
      validFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / total : 0;
    
    const distribution = [1, 2, 3, 4, 5].map(rating => ({
      rating: `${rating} Star`,
      count: validFeedback.filter(f => f.overall_rating === rating).length
    }));
    
    return {
      total,
      avgRating: Math.round(avgRating * 10) / 10,
      distribution
    };
  }, [feedback]);

  const isLoading = studentsLoading || lecturersLoading || coursesLoading || feedbackLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-64"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">University Dashboard</h1>
        <p className="text-muted-foreground">
          Key metrics and performance overview
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Students Overview */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Users className="h-5 w-5 text-primary" />
              Students Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {studentsOverview.active}
                </div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">
                  {studentsOverview.inactive}
                </div>
                <div className="text-sm text-muted-foreground">Inactive Students</div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={studentsOverview.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {studentsOverview.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value} students`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2. Lecturers Performance */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <GraduationCap className="h-5 w-5 text-primary" />
              Lecturer Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={lecturersPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 5]} stroke="#64748b" fontSize={12} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#64748b" 
                  fontSize={10}
                  width={80}
                />
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value}/5.0 (${props.payload.feedbackCount} reviews)`,
                    'Average Rating'
                  ]}
                />
                <Bar dataKey="rating" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Courses Performance */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-primary" />
              Course Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={coursesPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 5]} stroke="#64748b" fontSize={12} />
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value}/5.0 (${props.payload.feedbackCount} reviews)`,
                    'Average Rating'
                  ]}
                  labelFormatter={(label: any) => {
                    const course = coursesPerformance.find(c => c.name === label);
                    return course ? course.fullName : label;
                  }}
                />
                <Bar dataKey="rating" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 4. Feedback Overview */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <MessageSquare className="h-5 w-5 text-primary" />
              Feedback Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {feedbackOverview.total}
                </div>
                <div className="text-sm text-muted-foreground">Total Feedback</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {feedbackOverview.avgRating}/5
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={feedbackOverview.distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="rating" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  formatter={(value: any) => [`${value} responses`, 'Count']}
                />
                <Bar 
                  dataKey="count" 
                  fill={COLORS.primary} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
