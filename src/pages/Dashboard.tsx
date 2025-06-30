import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Star,
  TrendingUp,
  Calendar,
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
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { useStudents, useLecturers, useCourses, useCourseOfferings, useFeedback, useDepartments } from "@/hooks/useData";

// Clean color palette for charts
const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981', 
  warning: '#f59e0b',
  danger: '#ef4444',
  secondary: '#6366f1',
  accent: '#8b5cf6',
  muted: '#64748b'
};

const Dashboard = () => {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: lecturers, isLoading: lecturersLoading } = useLecturers();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: courseOfferings } = useCourseOfferings();
  const { data: feedback, isLoading: feedbackLoading } = useFeedback();
  const { data: departments } = useDepartments();

  // Debug logging to verify data
  console.log('Dashboard Data Check:', {
    studentsCount: students?.length || 0,
    lecturersCount: lecturers?.length || 0,
    coursesCount: courses?.length || 0,
    courseOfferingsCount: courseOfferings?.length || 0,
    feedbackCount: feedback?.length || 0,
    departmentsCount: departments?.length || 0
  });

  // Key metrics for top cards
  const keyMetrics = useMemo(() => {
    // FIXED: Total students using COUNT(*) FROM students (regardless of status)
    const totalStudents = students?.length || 0;
    
    // Active students using COUNT(*) FROM students WHERE is_active = true
    const activeStudents = students?.filter(s => s.is_active === true)?.length || 0;
    
    const totalLecturers = lecturers?.length || 0;
    const activeCourses = courseOfferings?.filter(co => co.is_active)?.length || 0;
    
    // Current satisfaction rating - average across all feedback with ratings
    const validFeedback = feedback?.filter(f => f.overall_rating && f.overall_rating > 0) || [];
    const avgCourseRating = validFeedback.length > 0 ? 
      validFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / validFeedback.length : 0;

    console.log('Key Metrics Calculation:', {
      totalStudents,
      activeStudents,
      totalLecturers,
      activeCourses,
      validFeedbackCount: validFeedback.length,
      avgCourseRating: Math.round(avgCourseRating * 10) / 10
    });

    return {
      totalStudents,
      activeStudents,
      totalLecturers, 
      activeCourses,
      avgCourseRating: Math.round(avgCourseRating * 10) / 10
    };
  }, [students, lecturers, courseOfferings, feedback]);

  // FIXED: Student distribution by department using LEFT JOIN logic
  const studentsByDepartment = useMemo(() => {
    if (!students || !departments) return [];
    
    // Implement the LEFT JOIN logic: departments LEFT JOIN students
    const deptCounts = departments.map(dept => {
      const studentCount = students.filter(student => student.department_id === dept.id).length;
      return {
        id: dept.id,
        name: dept.department_name,
        students: studentCount
      };
    });

    console.log('Students by Department:', deptCounts);
    
    // Sort by department id to match the SQL query ORDER BY departments.id
    return deptCounts.sort((a, b) => a.id - b.id);
  }, [students, departments]);

  // COMPREHENSIVE: Lecturer Performance Distribution - using all rating metrics
  const lecturerPerformanceDistribution = useMemo(() => {
    if (!lecturers || !courseOfferings || !feedback) {
      console.log('Missing data for lecturer performance:', { lecturers: !!lecturers, courseOfferings: !!courseOfferings, feedback: !!feedback });
      return [];
    }

    console.log('Calculating lecturer performance with comprehensive ratings...');

    const lecturerRatings = lecturers.map(lecturer => {
      const lecturerOfferings = courseOfferings.filter(co => co.lecturer_id === lecturer.id);
      const lecturerFeedback = feedback.filter(f => 
        lecturerOfferings.some(co => co.id === f.course_offering_id)
      );
      
      if (lecturerFeedback.length === 0) {
        console.log(`No feedback for lecturer ${lecturer.first_name} ${lecturer.last_name}`);
        return null;
      }
      
      // Calculate comprehensive rating using all rating metrics - averaging all 5 metrics
      const comprehensiveRatings = lecturerFeedback.map(f => {
        const ratings = [
          f.overall_rating || 0,
          f.teaching_effectiveness || 0,
          f.course_content || 0,
          f.communication || 0,
          f.availability || 0
        ];
        // Average of all 5 ratings (result is between 0-5)
        const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / 5.0;
        return avgRating;
      });
      
      const avgComprehensiveRating = comprehensiveRatings.reduce((sum, rating) => sum + rating, 0) / comprehensiveRatings.length;
      
      console.log(`Lecturer ${lecturer.first_name} ${lecturer.last_name}: ${lecturerFeedback.length} feedback entries, avg rating: ${avgComprehensiveRating.toFixed(2)}`);
      
      return avgComprehensiveRating;
    }).filter(rating => rating !== null);

    console.log('All lecturer ratings:', lecturerRatings);

    // Performance bands based on comprehensive rating (0-5 scale)
    const performanceBands = [
      { 
        range: 'Excellent', 
        count: lecturerRatings.filter(r => r >= 4.5 && r <= 5).length, 
        color: '#10b981', // Green
        description: '4.5 - 5.0'
      },
      { 
        range: 'Good', 
        count: lecturerRatings.filter(r => r >= 4.0 && r < 4.5).length, 
        color: '#f59e0b', // Yellow
        description: '4.0 - 4.49'
      },
      { 
        range: 'Average', 
        count: lecturerRatings.filter(r => r >= 3.0 && r < 4.0).length, 
        color: '#f97316', // Orange
        description: '3.0 - 3.99'
      },
      { 
        range: 'Poor', 
        count: lecturerRatings.filter(r => r < 3.0).length, 
        color: '#ef4444', // Red
        description: 'Below 3.0'
      }
    ];

    console.log('Performance bands distribution:', performanceBands);

    return performanceBands;
  }, [lecturers, courseOfferings, feedback]);

  // Courses satisfaction trend over last 6 months
  const coursesSatisfactionTrend = useMemo(() => {
    if (!feedback) return [];

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = new Map();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData.set(monthKey, { month: monthName, avgRating: 0, count: 0 });
    }

    // Process feedback data
    feedback.forEach(f => {
      if (!f.overall_rating || !f.created_at) return;
      
      const feedbackDate = new Date(f.created_at);
      if (feedbackDate < sixMonthsAgo) return;
      
      const monthKey = feedbackDate.toISOString().slice(0, 7);
      const monthData = monthlyData.get(monthKey);
      
      if (monthData) {
        monthData.avgRating = ((monthData.avgRating * monthData.count) + f.overall_rating) / (monthData.count + 1);
        monthData.count++;
      }
    });

    return Array.from(monthlyData.values())
      .map(data => ({
        ...data,
        avgRating: Math.round(data.avgRating * 10) / 10
      }));
  }, [feedback]);

  // FIXED: Feedback sentiment over time with Y-axis capped at 100%
  const feedbackSentimentOverTime = useMemo(() => {
    if (!feedback) return [];

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = new Map();
    
    // Initialize last 6 months with cleaner month names
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' }); // Just month name
      monthlyData.set(monthKey, { 
        month: monthName, 
        Positive: 0, 
        Neutral: 0, 
        Negative: 0,
        total: 0
      });
    }

    // Process feedback data and categorize by sentiment
    feedback.forEach(f => {
      if (!f.overall_rating || !f.created_at) return;
      
      const feedbackDate = new Date(f.created_at);
      if (feedbackDate < sixMonthsAgo) return;
      
      const monthKey = feedbackDate.toISOString().slice(0, 7);
      const monthData = monthlyData.get(monthKey);
      
      if (monthData) {
        monthData.total++;
        
        // Categorize sentiment based on rating
        if (f.overall_rating >= 4) {
          monthData.Positive++;
        } else if (f.overall_rating === 3) {
          monthData.Neutral++;
        } else {
          monthData.Negative++;
        }
      }
    });

    // Convert counts to percentages for better stacked area visualization
    return Array.from(monthlyData.values()).map(data => {
      const total = data.total || 1; // Avoid division by zero
      const positive = Math.round((data.Positive / total) * 100);
      const neutral = Math.round((data.Neutral / total) * 100);
      const negative = Math.round((data.Negative / total) * 100);
      
      // Ensure percentages don't exceed 100% due to rounding
      const sum = positive + neutral + negative;
      if (sum > 100) {
        // Adjust the largest value to ensure total is 100%
        const max = Math.max(positive, neutral, negative);
        if (positive === max) {
          return { month: data.month, Positive: positive - (sum - 100), Neutral: neutral, Negative: negative };
        } else if (neutral === max) {
          return { month: data.month, Positive: positive, Neutral: neutral - (sum - 100), Negative: negative };
        } else {
          return { month: data.month, Positive: positive, Neutral: neutral, Negative: negative - (sum - 100) };
        }
      }
      
      return {
        month: data.month,
        Positive: positive,
        Neutral: neutral,
        Negative: negative
      };
    });
  }, [feedback]);

  const isLoading = studentsLoading || lecturersLoading || coursesLoading || feedbackLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          University Dashboard
        </h1>
        <p className="text-muted-foreground">
          Comprehensive overview of academic performance and system health
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Students</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{keyMetrics.totalStudents}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">{keyMetrics.activeStudents} active</p>
              </div>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Lecturers</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{keyMetrics.totalLecturers}</p>
                <p className="text-xs text-green-600 dark:text-green-400">faculty members</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Active Courses</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{keyMetrics.activeCourses}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">this semester</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Current Satisfaction Rating</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{keyMetrics.avgCourseRating}/5</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">course feedback</p>
              </div>
              <Star className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FIXED: Student Distribution by Department */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Student Distribution by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentsByDepartment}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  formatter={(value: any) => [value, 'Students']}
                />
                <Bar dataKey="students" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* COMPREHENSIVE: Lecturer Performance Distribution - using all rating metrics */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Lecturer Performance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lecturerPerformanceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis 
                  dataKey="range" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  formatter={(value: any, name: any, props: any) => [
                    `${value} lecturers`, 
                    `${props.payload.description}`
                  ]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {lecturerPerformanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Courses Satisfaction Trend */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Courses Satisfaction Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={coursesSatisfactionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  domain={[0, 5]}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  formatter={(value: any) => [`${value}/5`, 'Avg Rating']}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgRating" 
                  stroke={CHART_COLORS.secondary}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.secondary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: CHART_COLORS.secondary, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* FIXED: Feedback Sentiment Overview with Y-axis capped at 100% */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              Feedback Sentiment Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={feedbackSentimentOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  formatter={(value: any, name: string) => [`${value}%`, name]}
                />
                <Area 
                  type="monotone" 
                  dataKey="Positive" 
                  stackId="1" 
                  stroke={CHART_COLORS.success} 
                  fill={CHART_COLORS.success}
                  fillOpacity={0.8}
                />
                <Area 
                  type="monotone" 
                  dataKey="Neutral" 
                  stackId="1" 
                  stroke={CHART_COLORS.warning} 
                  fill={CHART_COLORS.warning}
                  fillOpacity={0.8}
                />
                <Area 
                  type="monotone" 
                  dataKey="Negative" 
                  stackId="1" 
                  stroke={CHART_COLORS.danger} 
                  fill={CHART_COLORS.danger}
                  fillOpacity={0.8}
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
