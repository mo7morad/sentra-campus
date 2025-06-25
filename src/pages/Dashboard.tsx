
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
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { useStudents, useLecturers, useCourses, useCourseOfferings, useFeedback } from "@/hooks/useData";

// Theme-aware colors that work in both light and dark modes
const COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--chart-2))',
  accent: 'hsl(var(--chart-3))',
  warning: 'hsl(var(--chart-4))',
  success: 'hsl(var(--chart-1))'
};

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

const Dashboard = () => {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: lecturers, isLoading: lecturersLoading } = useLecturers();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: courseOfferings } = useCourseOfferings();
  const { data: feedback, isLoading: feedbackLoading } = useFeedback();

  // Students Overview Data - Pie chart is appropriate for showing part-to-whole relationships
  const studentsOverview = useMemo(() => {
    if (!students) return { active: 0, inactive: 0, chartData: [] };
    
    const active = students.filter(s => s.student_status === 'Active').length;
    const inactive = students.length - active;
    
    return {
      active,
      inactive,
      total: students.length,
      chartData: [
        { name: 'Active', value: active, color: COLORS.success },
        { name: 'Inactive', value: inactive, color: COLORS.warning }
      ].filter(item => item.value > 0)
    };
  }, [students]);

  // Lecturers Performance - Horizontal bar chart is best for comparing names/categories
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
      .slice(0, 8);
    
    return lecturerRatings;
  }, [lecturers, courseOfferings, feedback]);

  // Courses Performance - Vertical bar chart works well for course comparisons
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
        name: course.course_name.length > 15 ? 
          course.course_name.substring(0, 15) + '...' : 
          course.course_name,
        fullName: course.course_name,
        rating: Math.round(avgRating * 10) / 10,
        feedbackCount: courseFeedback.length
      };
    }).filter(item => item !== null)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
    
    return courseRatings;
  }, [courses, courseOfferings, feedback]);

  // Feedback Overview - Bar chart is perfect for showing distribution across categories
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
      rating: `${rating}★`,
      count: validFeedback.filter(f => f.overall_rating === rating).length,
      fill: CHART_COLORS[rating - 1]
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 lg:h-96 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-2 sm:p-0">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          University Dashboard
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Key metrics and performance overview
        </p>
      </div>

      {/* Main Dashboard Grid - Responsive 2x2 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        
        {/* 1. Students Overview - Pie Chart (Part-to-whole relationship) */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <Users className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              Students Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
              <div className="text-center sm:text-left">
                <div className="text-xl lg:text-2xl font-bold text-foreground">
                  {studentsOverview.total}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">Total Students</div>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <div className="text-lg lg:text-xl font-bold text-green-600 dark:text-green-400">
                    {studentsOverview.active}
                  </div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div>
                  <div className="text-lg lg:text-xl font-bold text-orange-600 dark:text-orange-400">
                    {studentsOverview.inactive}
                  </div>
                  <div className="text-xs text-muted-foreground">Inactive</div>
                </div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={studentsOverview.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {studentsOverview.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value} students`, name]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2. Lecturers Performance - Horizontal Bar Chart (Best for comparing names) */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <GraduationCap className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              Top Lecturer Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={lecturersPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis 
                  type="number" 
                  domain={[0, 5]} 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  width={80}
                />
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value}/5.0 (${props.payload.feedbackCount} reviews)`,
                    'Average Rating'
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Bar dataKey="rating" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Courses Performance - Vertical Bar Chart (Good for course comparisons) */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              Top Course Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={coursesPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis 
                  domain={[0, 5]} 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11} 
                />
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value}/5.0 (${props.payload.feedbackCount} reviews)`,
                    'Average Rating'
                  ]}
                  labelFormatter={(label: any) => {
                    const course = coursesPerformance.find(c => c.name === label);
                    return course ? course.fullName : label;
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Bar dataKey="rating" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 4. Feedback Overview - Bar Chart (Perfect for distribution) */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              Feedback Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
              <div className="text-center sm:text-left">
                <div className="text-xl lg:text-2xl font-bold text-foreground">
                  {feedbackOverview.total}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                  {feedbackOverview.avgRating}/5
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={feedbackOverview.distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis 
                  dataKey="rating" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11} 
                />
                <Tooltip 
                  formatter={(value: any) => [`${value} responses`, 'Count']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Bar 
                  dataKey="count" 
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
