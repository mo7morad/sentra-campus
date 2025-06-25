
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  MessageSquare,
  TrendingUp,
  UserCheck,
  Star,
  Award,
  BarChart3
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
  RadialBar,
  AreaChart,
  Area,
  LineChart,
  Line
} from "recharts";
import { useStudents, useLecturers, useCourses, useCourseOfferings, useFeedback } from "@/hooks/useData";

// Theme-aware colors with better dark mode support
const COLORS = {
  students: 'hsl(var(--chart-1))',
  lecturers: 'hsl(var(--chart-2))', 
  courses: 'hsl(var(--chart-3))',
  feedback: 'hsl(var(--chart-4))',
  success: 'hsl(142 76% 36%)',
  warning: 'hsl(38 92% 50%)',
  danger: 'hsl(0 84% 60%)',
  muted: 'hsl(var(--muted))',
  positive: '#10b981',
  neutral: '#f59e0b',
  negative: '#ef4444',
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))'
};

const Dashboard = () => {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: lecturers, isLoading: lecturersLoading } = useLecturers();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: courseOfferings } = useCourseOfferings();
  const { data: feedback, isLoading: feedbackLoading } = useFeedback();

  // Top KPI Cards Data - Enhanced
  const topKPIs = useMemo(() => {
    if (!students || !courseOfferings || !lecturers || !feedback) return {
      totalStudents: 0,
      totalLecturers: 0,
      coursesThisSemester: 0,
      avgFeedbackRating: 0
    };

    const totalStudents = students.length;
    const totalLecturers = lecturers.length;
    const coursesThisSemester = courseOfferings?.filter(co => co.is_active).length || 0;
    const validFeedback = feedback.filter(f => f.overall_rating !== null);
    const avgFeedbackRating = validFeedback.length > 0 ? 
      validFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / validFeedback.length : 0;

    return {
      totalStudents,
      totalLecturers,
      coursesThisSemester,
      avgFeedbackRating: Math.round(avgFeedbackRating * 10) / 10
    };
  }, [students, courseOfferings, lecturers, feedback]);

  // Students Overview - Enhanced with department breakdown
  const studentsOverview = useMemo(() => {
    if (!students) return { 
      active: 0, 
      inactive: 0, 
      total: 0, 
      chartData: [],
      departmentData: [],
      yearData: []
    };
    
    const total = students.length;
    const active = students.filter(s => s.is_active === true).length;
    const inactive = students.filter(s => s.is_active === false).length;
    
    // Department breakdown
    const departmentCounts = students.reduce((acc, student) => {
      const deptName = student.departments?.department_name || 'Unknown';
      acc[deptName] = (acc[deptName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const departmentData = Object.entries(departmentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 departments
    
    // Academic year breakdown
    const yearCounts = students.reduce((acc, student) => {
      const year = student.current_year || 'Unknown';
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string | number, number>);
    
    const yearData = Object.entries(yearCounts)
      .map(([year, count]) => ({ year: `Year ${year}`, count }))
      .sort((a, b) => (a.year.localeCompare(b.year)));
    
    return {
      active,
      inactive,
      total,
      chartData: [
        { name: 'Active', value: active, color: COLORS.success },
        { name: 'Inactive', value: inactive, color: COLORS.warning }
      ].filter(item => item.value > 0),
      departmentData,
      yearData
    };
  }, [students]);

  // Lecturers Performance - Enhanced with gauge chart
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
    
    // Distribution data with better categories
    const poor = lecturerRatings.filter(r => r >= 1 && r < 2).length;
    const average = lecturerRatings.filter(r => r >= 2 && r < 3).length;
    const good = lecturerRatings.filter(r => r >= 3 && r < 4).length;
    const excellent = lecturerRatings.filter(r => r >= 4).length;
    
    // Gauge data (percentage of 5-star scale)
    const gaugeData = [{
      name: 'Rating',
      value: (avgRating / 5) * 100,
      fill: avgRating >= 4 ? COLORS.success : avgRating >= 3 ? COLORS.warning : COLORS.danger
    }];
    
    return {
      totalLecturers,
      avgRating: Math.round(avgRating * 10) / 10,
      highPerformers,
      gaugeData,
      distributionData: [
        { range: 'Poor (1-2)', count: poor, fill: COLORS.danger },
        { range: 'Average (2-3)', count: average, fill: COLORS.warning },
        { range: 'Good (3-4)', count: good, fill: COLORS.courses },
        { range: 'Excellent (4-5)', count: excellent, fill: COLORS.success }
      ].filter(item => item.count > 0)
    };
  }, [lecturers, courseOfferings, feedback]);

  // Courses Performance - Enhanced with stacked bar chart
  const coursesOverview = useMemo(() => {
    if (!courses || !courseOfferings || !feedback) return {
      totalCourses: 0,
      avgSatisfaction: 0,
      topRated: 0,
      levelData: []
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
      return { course, rating: avgRating };
    }).filter(item => item !== null);
    
    const totalCourses = courseRatings.length;
    const avgSatisfaction = totalCourses > 0 ? 
      courseRatings.reduce((sum, item) => sum + item.rating, 0) / totalCourses : 0;
    const topRated = courseRatings.filter(item => item.rating >= 4).length;
    
    // Group by course level for stacked bar chart
    const levelGroups = courseRatings.reduce((acc, item) => {
      const level = item.course.course_level || 100;
      const levelName = level < 200 ? '100-Level' : 
                        level < 300 ? '200-Level' : 
                        level < 400 ? '300-Level' : '400+ Level';
      
      if (!acc[levelName]) {
        acc[levelName] = { name: levelName, average: 0, good: 0, excellent: 0 };
      }
      
      if (item.rating >= 4) acc[levelName].excellent++;
      else if (item.rating >= 3) acc[levelName].good++;
      else acc[levelName].average++;
      
      return acc;
    }, {} as Record<string, any>);
    
    const levelData = Object.values(levelGroups);
    
    return {
      totalCourses,
      avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
      topRated,
      levelData
    };
  }, [courses, courseOfferings, feedback]);

  // Feedback Sentiment Trends - Enhanced with better time grouping
  const feedbackSentimentTrends = useMemo(() => {
    if (!feedback) return [];
    
    // Group feedback by month for last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const monthlyData = new Map();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData.set(monthKey, {
        month: monthName,
        positive: 0,
        neutral: 0,
        negative: 0
      });
    }
    
    // Process feedback data
    feedback.forEach(f => {
      if (!f.overall_rating || !f.created_at) return;
      
      const feedbackDate = new Date(f.created_at);
      if (feedbackDate < sixMonthsAgo) return;
      
      const monthKey = feedbackDate.toISOString().slice(0, 7);
      const monthData = monthlyData.get(monthKey);
      
      if (monthData) {
        if (f.overall_rating >= 4) {
          monthData.positive++;
        } else if (f.overall_rating === 3) {
          monthData.neutral++;
        } else if (f.overall_rating <= 2) {
          monthData.negative++;
        }
      }
    });
    
    return Array.from(monthlyData.values());
  }, [feedback]);

  const isLoading = studentsLoading || lecturersLoading || coursesLoading || feedbackLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-64"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg"></div>
          ))}
        </div>
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

      {/* Enhanced Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border bg-card text-card-foreground hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">
                  {topKPIs.totalStudents}
                </p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
              <Users className="h-6 w-6 lg:h-8 lg:w-8 text-chart-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border bg-card text-card-foreground hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">
                  {topKPIs.totalLecturers}
                </p>
                <p className="text-sm text-muted-foreground">Total Lecturers</p>
              </div>
              <GraduationCap className="h-6 w-6 lg:h-8 lg:w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border bg-card text-card-foreground hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">
                  {topKPIs.coursesThisSemester}
                </p>
                <p className="text-sm text-muted-foreground">Courses This Semester</p>
              </div>
              <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border bg-card text-card-foreground hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">
                  {topKPIs.avgFeedbackRating}/5
                </p>
                <p className="text-sm text-muted-foreground">Avg Feedback Rating</p>
              </div>
              <Star className="h-6 w-6 lg:h-8 lg:w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        
        {/* 1. Enhanced Students Overview */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <Users className="h-4 w-4 lg:h-5 lg:w-5 text-chart-1" />
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
                <div className="text-lg lg:text-xl font-bold text-green-600 dark:text-green-400">
                  {studentsOverview.active}
                </div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-orange-600 dark:text-orange-400">
                  {studentsOverview.inactive}
                </div>
                <div className="text-xs text-muted-foreground">Inactive</div>
              </div>
            </div>
            
            {/* Enhanced Donut Chart with better spacing */}
            <div className="mb-4">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={studentsOverview.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {studentsOverview.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--background))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value} students`, name]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--popover-foreground))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Department Breakdown */}
            <div className="mb-3">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">By Department</h4>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={studentsOverview.departmentData} layout="horizontal">
                  <XAxis type="number" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" fontSize={9} stroke="hsl(var(--muted-foreground))" width={80} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--popover-foreground))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 2. Enhanced Lecturers Performance with Gauge Chart */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <GraduationCap className="h-4 w-4 lg:h-5 lg:w-5 text-chart-2" />
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
                <div className="text-lg lg:text-xl font-bold text-chart-2">
                  {lecturersOverview.avgRating}/5
                </div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-green-600 dark:text-green-400">
                  {lecturersOverview.highPerformers}
                </div>
                <div className="text-xs text-muted-foreground">Excellent (4+)</div>
              </div>
            </div>
            
            {/* Enhanced Gauge Chart */}
            <div className="mb-4">
              <ResponsiveContainer width="100%" height={140}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" data={lecturersOverview.gaugeData}>
                  <RadialBar 
                    dataKey="value" 
                    cornerRadius={8} 
                    fill={lecturersOverview.gaugeData[0]?.fill || COLORS.warning}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-lg font-bold">
                    {lecturersOverview.avgRating}/5
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Enhanced Distribution Chart */}
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={lecturersOverview.distributionData}>
                <XAxis dataKey="range" fontSize={9} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Enhanced Course Performance with Stacked Bar Chart */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-chart-3" />
              Course Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            {/* Enhanced KPI Cards */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-foreground">
                  {coursesOverview.totalCourses}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-chart-3">
                  {coursesOverview.avgSatisfaction}/5
                </div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-green-600 dark:text-green-400">
                  {coursesOverview.topRated}
                </div>
                <div className="text-xs text-muted-foreground">Top Rated</div>
              </div>
            </div>
            
            {/* Stacked Bar Chart by Course Level */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Performance by Course Level</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={coursesOverview.levelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10} 
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10} 
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--popover-foreground))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="average" stackId="a" fill={COLORS.warning} name="Average (2-3)" />
                  <Bar dataKey="good" stackId="a" fill={COLORS.courses} name="Good (3-4)" />
                  <Bar dataKey="excellent" stackId="a" fill={COLORS.success} name="Excellent (4-5)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 4. Enhanced Feedback Sentiment Trends */}
        <Card className="shadow-sm border bg-card text-card-foreground">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-chart-4" />
              Feedback Sentiment Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-green-600 dark:text-green-400">
                  {feedbackSentimentTrends.reduce((sum, month) => sum + month.positive, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Positive</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-orange-600 dark:text-orange-400">
                  {feedbackSentimentTrends.reduce((sum, month) => sum + month.neutral, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Neutral</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-red-600 dark:text-red-400">
                  {feedbackSentimentTrends.reduce((sum, month) => sum + month.negative, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Negative</div>
              </div>
            </div>
            
            {/* Enhanced Stacked Area Chart */}
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={feedbackSentimentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.7}
                  name="Positive"
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.7}
                  name="Neutral"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.7}
                  name="Negative"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
