
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
  Award
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useDashboardStats, useDepartments, useFeedback, useStudents } from "@/hooks/useData";

// Chart color scheme
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981', 
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  indigo: '#6366F1',
  pink: '#EC4899',
  teal: '#14B8A6'
};

const Dashboard = () => {
  console.log("Dashboard component rendered");
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: departments } = useDepartments();
  const { data: feedback } = useFeedback();
  const { data: students } = useStudents();

  // Process real student status data
  const processStudentStatusData = () => {
    if (!students) return [];
    
    const statusCounts = students.reduce((acc, student) => {
      const status = student.student_status || 'Active';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color: status === 'Active' ? COLORS.secondary : COLORS.danger
    }));
  };

  // Process feedback trends by month with real data
  const processFeedbackTrends = () => {
    if (!feedback) return [];
    
    const monthlyData: { [key: string]: { total: number, avgRating: number, ratings: number[] } } = {};
    
    feedback.forEach(item => {
      if (item.overall_rating && item.created_at) {
        const date = new Date(item.created_at);
        const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        if (!monthlyData[month]) {
          monthlyData[month] = { total: 0, avgRating: 0, ratings: [] };
        }
        
        monthlyData[month].total++;
        monthlyData[month].ratings.push(item.overall_rating);
      }
    });
    
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        feedback: data.total,
        avgRating: Math.round((data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length) * 10) / 10
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  };

  // Department performance with real data
  const departmentData = departments?.map(dept => {
    const deptFeedback = feedback?.filter(f => {
      const courseDepartmentId = f.course_offerings?.courses?.department_id;
      return courseDepartmentId === dept.id;
    }) || [];
    
    const avgRating = deptFeedback.length > 0 
      ? deptFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / deptFeedback.length
      : 0;
    
    return {
      name: dept.department_name.length > 12 
        ? dept.department_name.substring(0, 12) + '...' 
        : dept.department_name,
      feedback: deptFeedback.length,
      rating: Math.round(avgRating * 10) / 10,
      fullName: dept.department_name
    };
  }).filter(dept => dept.feedback > 0) // Only show departments with feedback
    .sort((a, b) => b.rating - a.rating) // Sort by rating descending
    .slice(0, 8) || []; // Top 8 departments

  // Rating distribution data
  const ratingDistribution = () => {
    if (!feedback) return [];
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    feedback.forEach(f => {
      if (f.overall_rating) {
        distribution[f.overall_rating as keyof typeof distribution]++;
      }
    });

    return Object.entries(distribution).map(([rating, count]) => ({
      rating: `${rating} Star${rating !== '1' ? 's' : ''}`,
      count,
      percentage: Math.round((count / feedback.length) * 100)
    }));
  };

  // Monthly feedback volume
  const monthlyFeedbackVolume = () => {
    if (!feedback) return [];
    
    const monthlyData: { [key: string]: number } = {};
    
    feedback.forEach(item => {
      if (item.created_at) {
        const date = new Date(item.created_at);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      }
    });
    
    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .slice(-12); // Last 12 months
  };

  const studentStatusData = processStudentStatusData();
  const feedbackTrends = processFeedbackTrends();
  const ratingDist = ratingDistribution();
  const monthlyVolume = monthlyFeedbackVolume();

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
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Monitor key performance indicators and institutional metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          change="+5.2% from last month"
          changeType="positive"
          icon={Users}
          gradient="gradient-primary"
        />
        <MetricCard
          title="Active Courses"
          value={stats?.totalCourses || 0}
          change="+2 new courses"
          changeType="positive"
          icon={BookOpen}
          gradient="gradient-success"
        />
        <MetricCard
          title="Total Feedback"
          value={stats?.totalFeedback || 0}
          change="+12.3% this week"
          changeType="positive"
          icon={MessageSquare}
          gradient="gradient-warning"
        />
        <MetricCard
          title="Avg Rating"
          value={`${stats?.avgRating || 0}/5`}
          change="+0.3 from last semester"
          changeType="positive"
          icon={Star}
          gradient="gradient-destructive"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Department Performance */}
        <ChartContainer title="Department Performance" description="Average rating and feedback count by department">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  name === 'rating' ? `${value}/5` : value,
                  name === 'rating' ? 'Avg Rating' : 'Feedback Count'
                ]}
                labelFormatter={(label) => {
                  const dept = departmentData.find(d => d.name === label);
                  return dept?.fullName || label;
                }}
              />
              <Legend />
              <Bar dataKey="feedback" fill={COLORS.primary} name="Feedback" radius={[2, 2, 0, 0]} />
              <Bar dataKey="rating" fill={COLORS.secondary} name="Rating" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Student Status Distribution */}
        <ChartContainer title="Student Status Distribution" description="Current enrollment status of all students">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={studentStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {studentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value} students (${Math.round((value / (stats?.totalStudents || 1)) * 100)}%)`,
                  props.payload.name
                ]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Feedback Trends Over Time */}
        <ChartContainer title="Feedback Trends" description="Monthly feedback volume and average ratings">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={feedbackTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="feedbackGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  name === 'avgRating' ? `${value}/5` : value,
                  name === 'avgRating' ? 'Avg Rating' : 'Feedback Count'
                ]}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="feedback" 
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#feedbackGradient)"
                name="Feedback"
              />
              <Area 
                type="monotone" 
                dataKey="avgRating" 
                stroke={COLORS.secondary}
                fillOpacity={1}
                fill="url(#ratingGradient)"
                name="Avg Rating"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Rating Distribution */}
        <ChartContainer title="Rating Distribution" description="Distribution of feedback ratings across all submissions">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ratingDist} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="rating" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value} submissions`, 'Count']}
              />
              <Bar 
                dataKey="count" 
                fill={COLORS.accent}
                radius={[4, 4, 0, 0]}
                name="Submissions"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

      </div>

      {/* Bottom Row - Quick Stats and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Quick Stats */}
        <Card className="hover-lift animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Lecturers</span>
                <span className="text-lg font-bold text-primary">{stats?.totalLecturers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Departments</span>
                <span className="text-lg font-bold text-secondary">{departments?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Feedback This Month</span>
                <span className="text-lg font-bold text-accent">
                  {feedback?.filter(f => {
                    const created = new Date(f.created_at!);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Top Rated Dept</span>
                <span className="text-lg font-bold text-purple">
                  {departmentData[0]?.name || 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Volume Trend */}
        <Card className="hover-lift animate-slide-up lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Monthly Feedback Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value} submissions`, 'Feedback']}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke={COLORS.indigo} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.indigo, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
