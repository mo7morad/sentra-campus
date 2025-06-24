
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { ChartContainer } from "@/components/ChartContainer";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Star,
  TrendingUp,
  Award,
  GraduationCap,
  Building2,
  BarChart3,
  Target
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar } from "recharts";
import { useDashboardStats, useDepartments, useFeedback, useStudents, useLecturers } from "@/hooks/useData";

// Modern color palette for better UX
const COLORS = {
  primary: '#2563eb',
  success: '#059669', 
  warning: '#d97706',
  danger: '#dc2626',
  purple: '#7c3aed',
  indigo: '#4f46e5',
  teal: '#0d9488',
  slate: '#475569'
};

const Dashboard = () => {
  console.log("Dashboard component rendered");
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: departments } = useDepartments();
  const { data: feedback } = useFeedback();
  const { data: students } = useStudents();
  const { data: lecturers } = useLecturers();

  // Calculate performance metrics
  const calculatePerformanceMetrics = () => {
    if (!feedback || !stats) return { satisfactionRate: 0, responseRate: 0 };
    
    const highRatings = feedback.filter(f => f.overall_rating && f.overall_rating >= 4).length;
    const satisfactionRate = feedback.length > 0 ? Math.round((highRatings / feedback.length) * 100) : 0;
    
    // Calculate response rate (feedback vs total possible responses)
    const totalPossibleResponses = stats.totalStudents * 0.3; // Assuming 30% expected response rate
    const responseRate = Math.round((feedback.length / totalPossibleResponses) * 100);
    
    return { satisfactionRate, responseRate };
  };

  // Department performance analysis
  const getDepartmentInsights = () => {
    if (!departments || !feedback) return [];
    
    return departments.map(dept => {
      const deptFeedback = feedback.filter(f => {
        const courseDepartmentId = f.course_offerings?.courses?.department_id;
        return courseDepartmentId === dept.id;
      });
      
      const avgRating = deptFeedback.length > 0 
        ? deptFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / deptFeedback.length
        : 0;
      
      const highRatings = deptFeedback.filter(f => f.overall_rating && f.overall_rating >= 4).length;
      const satisfactionRate = deptFeedback.length > 0 ? (highRatings / deptFeedback.length) * 100 : 0;
      
      return {
        name: dept.department_name.length > 15 
          ? dept.department_name.substring(0, 15) + '...' 
          : dept.department_name,
        fullName: dept.department_name,
        avgRating: Math.round(avgRating * 10) / 10,
        feedbackCount: deptFeedback.length,
        satisfaction: Math.round(satisfactionRate),
        performance: Math.round(avgRating * 20) // Convert to percentage for radial chart
      };
    }).filter(dept => dept.feedbackCount > 0)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 6);
  };

  // Monthly feedback trends
  const getMonthlyTrends = () => {
    if (!feedback) return [];
    
    const monthlyData: { [key: string]: { count: number, ratings: number[] } } = {};
    
    feedback.forEach(item => {
      if (item.created_at) {
        const date = new Date(item.created_at);
        const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[month]) {
          monthlyData[month] = { count: 0, ratings: [] };
        }
        
        monthlyData[month].count++;
        if (item.overall_rating) {
          monthlyData[month].ratings.push(item.overall_rating);
        }
      }
    });
    
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        responses: data.count,
        avgRating: data.ratings.length > 0 
          ? Math.round((data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length) * 10) / 10
          : 0,
        satisfaction: data.ratings.length > 0 
          ? Math.round((data.ratings.filter(r => r >= 4).length / data.ratings.length) * 100)
          : 0
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6);
  };

  // Rating distribution for insights
  const getRatingInsights = () => {
    if (!feedback || feedback.length === 0) return [];
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    feedback.forEach(f => {
      if (f.overall_rating && f.overall_rating >= 1 && f.overall_rating <= 5) {
        distribution[f.overall_rating as keyof typeof distribution]++;
      }
    });

    return Object.entries(distribution).map(([rating, count]) => ({
      rating: `${rating}⭐`,
      count,
      percentage: Math.round((count / feedback.length) * 100),
      fill: rating >= '4' ? COLORS.success : rating >= '3' ? COLORS.warning : COLORS.danger
    }));
  };

  // Lecturer performance overview
  const getLecturerOverview = () => {
    if (!lecturers || !feedback) return { excellent: 0, good: 0, needsImprovement: 0 };
    
    const lecturerRatings = lecturers.map(lecturer => {
      const lecturerFeedback = feedback.filter(f => 
        f.course_offerings?.lecturer_id === lecturer.id
      );
      
      if (lecturerFeedback.length === 0) return null;
      
      const avgRating = lecturerFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / lecturerFeedback.length;
      return avgRating;
    }).filter(rating => rating !== null);
    
    const excellent = lecturerRatings.filter(r => r! >= 4.5).length;
    const good = lecturerRatings.filter(r => r! >= 3.5 && r! < 4.5).length;
    const needsImprovement = lecturerRatings.filter(r => r! < 3.5).length;
    
    return { excellent, good, needsImprovement };
  };

  const performanceMetrics = calculatePerformanceMetrics();
  const departmentInsights = getDepartmentInsights();
  const monthlyTrends = getMonthlyTrends();
  const ratingInsights = getRatingInsights();
  const lecturerOverview = getLecturerOverview();

  if (statsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          Institutional Dashboard
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Real-time insights into academic performance, student satisfaction, and institutional excellence
        </p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          change={`Across ${departments?.length || 0} departments`}
          changeType="neutral"
          icon={Users}
          gradient="from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Active Courses"
          value={stats?.totalCourses || 0}
          change={`${stats?.totalLecturers || 0} lecturers teaching`}
          changeType="neutral"
          icon={BookOpen}
          gradient="from-green-500 to-green-600"
        />
        <MetricCard
          title="Feedback Responses"
          value={stats?.totalFeedback || 0}
          change={`${performanceMetrics.responseRate}% response rate`}
          changeType={performanceMetrics.responseRate >= 25 ? "positive" : "neutral"}
          icon={MessageSquare}
          gradient="from-orange-500 to-orange-600"
        />
        <MetricCard
          title="Satisfaction Rate"
          value={`${performanceMetrics.satisfactionRate}%`}
          change={`${stats?.avgRating || 0}/5 average rating`}
          changeType={performanceMetrics.satisfactionRate >= 70 ? "positive" : "negative"}
          icon={Star}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Department Performance */}
        <div className="lg:col-span-2">
          <ChartContainer 
            title="Department Performance Overview" 
            description="Average ratings and satisfaction rates by department"
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={departmentInsights} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'avgRating' ? `${value}/5` : `${value}%`,
                    name === 'avgRating' ? 'Avg Rating' : 'Satisfaction'
                  ]}
                  labelFormatter={(label) => {
                    const dept = departmentInsights.find(d => d.name === label);
                    return dept?.fullName || label;
                  }}
                />
                <Legend />
                <Bar dataKey="satisfaction" fill={COLORS.success} name="Satisfaction" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgRating" fill={COLORS.primary} name="Avg Rating" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Lecturer Performance Summary */}
        <ChartContainer 
          title="Lecturer Performance" 
          description="Distribution of lecturer ratings"
          className="h-[400px]"
        >
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div>
                <p className="text-sm font-medium text-green-800">Excellent (4.5+ ⭐)</p>
                <p className="text-2xl font-bold text-green-900">{lecturerOverview.excellent}</p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div>
                <p className="text-sm font-medium text-yellow-800">Good (3.5-4.4 ⭐)</p>
                <p className="text-2xl font-bold text-yellow-900">{lecturerOverview.good}</p>
              </div>
              <Target className="w-8 h-8 text-yellow-600" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <div>
                <p className="text-sm font-medium text-red-800">Needs Support (< 3.5 ⭐)</p>
                <p className="text-2xl font-bold text-red-900">{lecturerOverview.needsImprovement}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 text-center">
                Total Active Lecturers: <span className="font-semibold">{stats?.totalLecturers || 0}</span>
              </p>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Trends and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Trends */}
        <ChartContainer 
          title="Monthly Feedback Trends" 
          description="Response volume and satisfaction over time"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="responsesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.success} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="responses" 
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#responsesGradient)"
                name="Responses"
              />
              <Area 
                type="monotone" 
                dataKey="satisfaction" 
                stroke={COLORS.success}
                fillOpacity={1}
                fill="url(#satisfactionGradient)"
                name="Satisfaction %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Rating Distribution */}
        <ChartContainer 
          title="Rating Distribution" 
          description="How students rate their learning experience"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingInsights} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="rating" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  `${value} responses (${ratingInsights.find(r => r.count === value)?.percentage}%)`,
                  'Count'
                ]}
              />
              <Bar 
                dataKey="count" 
                radius={[6, 6, 0, 0]}
                name="Responses"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Executive Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <h3 className="font-semibold mb-1">Institution Health</h3>
              <p className="text-sm text-slate-300">
                {departments?.length || 0} active departments with {stats?.totalCourses || 0} courses
              </p>
            </div>
            <div className="text-center">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <h3 className="font-semibold mb-1">Student Engagement</h3>
              <p className="text-sm text-slate-300">
                {performanceMetrics.responseRate}% feedback participation rate
              </p>
            </div>
            <div className="text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <h3 className="font-semibold mb-1">Quality Assurance</h3>
              <p className="text-sm text-slate-300">
                {performanceMetrics.satisfactionRate}% student satisfaction rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
