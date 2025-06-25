
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
  RadialBarChart,
  RadialBar
} from "recharts";
import { useStudents, useLecturers, useCourses, useCourseOfferings, useFeedback } from "@/hooks/useData";

// Theme-aware colors
const COLORS = {
  students: 'hsl(var(--chart-1))',
  lecturers: 'hsl(var(--chart-2))', 
  courses: 'hsl(var(--chart-3))',
  feedback: 'hsl(var(--chart-4))',
  success: 'hsl(var(--chart-1))',
  warning: 'hsl(var(--chart-4))',
  danger: 'hsl(var(--destructive))',
  muted: 'hsl(var(--muted))'
};

const Dashboard = () => {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: lecturers, isLoading: lecturersLoading } = useLecturers();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: courseOfferings } = useCourseOfferings();
  const { data: feedback, isLoading: feedbackLoading } = useFeedback();

  // Students Overview - Fixed to properly count inactive students
  const studentsOverview = useMemo(() => {
    if (!students) return { active: 0, inactive: 0, total: 0, chartData: [] };
    
    const active = students.filter(s => s.student_status === 'Active').length;
    const inactive = students.filter(s => s.student_status !== 'Active').length;
    const total = students.length;
    
    return {
      active,
      inactive,
      total,
      chartData: [
        { name: 'Active', value: active, color: COLORS.success },
        { name: 'Inactive', value: inactive, color: COLORS.warning }
      ].filter(item => item.value > 0)
    };
  }, [students]);

  // Lecturers Performance Overview - Aggregate statistics
  const lecturersOverview = useMemo(() => {
    if (!lecturers || !courseOfferings || !feedback) return {
      totalLecturers: 0, 
      avgRating: 0, 
      highPerformers: 0,
      gaugeData: [],
      distributionData: []
    };
    
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
      return avgRating;
    }).filter(rating => rating !== null);
    
    const totalLecturers = lecturerRatings.length;
    const avgRating = totalLecturers > 0 ? 
      lecturerRatings.reduce((sum, rating) => sum + rating, 0) / totalLecturers : 0;
    const highPerformers = lecturerRatings.filter(rating => rating >= 4).length;
    
    // Distribution data
    const poor = lecturerRatings.filter(r => r < 2).length;
    const average = lecturerRatings.filter(r => r >= 2 && r < 3).length;
    const good = lecturerRatings.filter(r => r >= 3 && r < 4).length;
    const excellent = lecturerRatings.filter(r => r >= 4).length;
    
    return {
      totalLecturers,
      avgRating: Math.round(avgRating * 10) / 10,
      highPerformers,
      gaugeData: [{ name: 'Rating', value: avgRating, fill: COLORS.lecturers }],
      distributionData: [
        { range: 'Poor (1-2)', count: poor, fill: COLORS.danger },
        { range: 'Average (2-3)', count: average, fill: COLORS.warning },
        { range: 'Good (3-4)', count: good, fill: COLORS.lecturers },
        { range: 'Excellent (4-5)', count: excellent, fill: COLORS.success }
      ].filter(item => item.count > 0)
    };
  }, [lecturers, courseOfferings, feedback]);

  // Courses Performance Overview - Aggregate statistics
  const coursesOverview = useMemo(() => {
    if (!courses || !courseOfferings || !feedback) return {
      totalCourses: 0,
      avgSatisfaction: 0,
      topRated: 0,
      gaugeData: [],
      distributionData: []
    };
    
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
      return avgRating;
    }).filter(rating => rating !== null);
    
    const totalCourses = courseRatings.length;
    const avgSatisfaction = totalCourses > 0 ? 
      courseRatings.reduce((sum, rating) => sum + rating, 0) / totalCourses : 0;
    const topRated = courseRatings.filter(rating => rating >= 4).length;
    
    // Distribution data
    const needsImprovement = courseRatings.filter(r => r < 2).length;
    const average = courseRatings.filter(r => r >= 2 && r < 3).length;
    const good = courseRatings.filter(r => r >= 3 && r < 4).length;
    const excellent = courseRatings.filter(r => r >= 4).length;
    
    return {
      totalCourses,
      avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
      topRated,
      gaugeData: [{ name: 'Satisfaction', value: avgSatisfaction, fill: COLORS.courses }],
      distributionData: [
        { range: 'Needs Improvement (1-2)', count: needsImprovement, fill: COLORS.danger },
        { range: 'Average (2-3)', count: average, fill: COLORS.warning },
        { range: 'Good (3-4)', count: good, fill: COLORS.courses },
        { range: 'Excellent (4-5)', count: excellent, fill: COLORS.success }
      ].filter(item => item.count > 0)
    };
  }, [courses, courseOfferings, feedback]);

  // Feedback Overview - Enhanced with more context
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
      fill: rating <= 2 ? COLORS.danger : rating === 3 ? COLORS.warning : COLORS.success
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
          Management overview and key performance metrics
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        
        {/* 1. Students Overview */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <Users className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: COLORS.students }} />
              Students Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-foreground">
                  {studentsOverview.total}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold" style={{color: COLORS.success}}>
                  {studentsOverview.active}
                </div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold" style={{color: COLORS.warning}}>
                  {studentsOverview.inactive}
                </div>
                <div className="text-xs text-muted-foreground">Inactive</div>
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

        {/* 2. Lecturers Performance Overview */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <GraduationCap className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: COLORS.lecturers }} />
              Lecturer Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-foreground">
                  {lecturersOverview.totalLecturers}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold" style={{color: COLORS.lecturers}}>
                  {lecturersOverview.avgRating}/5
                </div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold" style={{color: COLORS.success}}>
                  {lecturersOverview.highPerformers}
                </div>
                <div className="text-xs text-muted-foreground">High Performers</div>
              </div>
            </div>
            
            {/* Gauge Chart */}
            <div className="mb-4">
              <ResponsiveContainer width="100%" height={120}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="70%" data={[{value: lecturersOverview.avgRating * 20}]}>
                  <RadialBar dataKey="value" cornerRadius={10} fill={COLORS.lecturers} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Distribution Chart */}
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={lecturersOverview.distributionData}>
                <XAxis dataKey="range" fontSize={9} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Courses Performance Overview */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <BookOpen className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: COLORS.courses }} />
              Course Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-foreground">
                  {coursesOverview.totalCourses}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold" style={{color: COLORS.courses}}>
                  {coursesOverview.avgSatisfaction}/5
                </div>
                <div className="text-xs text-muted-foreground">Avg Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold" style={{color: COLORS.success}}>
                  {coursesOverview.topRated}
                </div>
                <div className="text-xs text-muted-foreground">Top Rated</div>
              </div>
            </div>
            
            {/* Gauge Chart */}
            <div className="mb-4">
              <ResponsiveContainer width="100%" height={120}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="70%" data={[{value: coursesOverview.avgSatisfaction * 20}]}>
                  <RadialBar dataKey="value" cornerRadius={10} fill={COLORS.courses} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Distribution Chart */}
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={coursesOverview.distributionData}>
                <XAxis dataKey="range" fontSize={9} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 4. Feedback Overview */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: COLORS.feedback }} />
              Feedback Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-foreground">
                  {feedbackOverview.total}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold" style={{color: COLORS.feedback}}>
                  {feedbackOverview.avgRating}/5
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
            
            {/* Distribution Chart */}
            <ResponsiveContainer width="100%" height={200}>
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
