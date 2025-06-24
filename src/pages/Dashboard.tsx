
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { ChartContainer } from "@/components/ChartContainer";
import { AcademicNavigator } from "@/components/AcademicNavigator";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Star
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useDashboardStats, useDepartments, useFeedback } from "@/hooks/useData";

// Chart color scheme
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981', 
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6'
};

const Dashboard = () => {
  console.log("Dashboard component rendered");
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: departments } = useDepartments();
  const { data: feedback } = useFeedback();

  // Process real feedback data for charts
  const processFeedbackData = () => {
    if (!feedback) return [];
    
    const monthlyData: { [key: string]: { positive: number, neutral: number, negative: number } } = {};
    
    feedback.forEach(item => {
      if (item.overall_rating) {
        const month = new Date(item.created_at!).toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { positive: 0, neutral: 0, negative: 0 };
        }
        
        if (item.overall_rating >= 4) {
          monthlyData[month].positive++;
        } else if (item.overall_rating >= 3) {
          monthlyData[month].neutral++;
        } else {
          monthlyData[month].negative++;
        }
      }
    });
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    }));
  };

  // Department performance with real data
  const departmentData = departments?.map(dept => {
    const deptFeedback = feedback?.filter(f => 
      f.course_offerings?.courses?.departments?.id === dept.id
    ) || [];
    
    const avgRating = deptFeedback.length > 0 
      ? deptFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / deptFeedback.length
      : 0;
    
    return {
      name: dept.department_name.length > 10 
        ? dept.department_name.substring(0, 10) + '...' 
        : dept.department_name,
      feedback: deptFeedback.length,
      rating: Math.round(avgRating * 10) / 10
    };
  }) || [];

  // Student enrollment status (simplified)
  const enrollmentData = [
    { name: 'Active', value: 85, color: COLORS.secondary },
    { name: 'On Leave', value: 10, color: COLORS.accent },
    { name: 'Inactive', value: 5, color: COLORS.danger }
  ];

  const feedbackTrends = processFeedbackData();

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
    <div className="space-y-4 sm:space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Monitor key performance indicators and institutional metrics
        </p>
      </div>

      {/* Academic Navigator */}
      <AcademicNavigator />

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

      {/* Simplified Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Department Performance - Simplified */}
        <ChartContainer title="Department Feedback" description="Feedback count and average rating by department">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="feedback" fill={COLORS.primary} name="Feedback Count" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rating" fill={COLORS.secondary} name="Avg Rating" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Student Status - Simplified */}
        <ChartContainer title="Student Status" description="Current student enrollment distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={enrollmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {enrollmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentage']}
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

        {/* Feedback Trends - Real Data */}
        {feedbackTrends.length > 0 && (
          <ChartContainer title="Feedback Trends" description="Monthly feedback sentiment from real data">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={feedbackTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="positive" 
                  stroke={COLORS.secondary} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 4 }}
                  name="Positive"
                />
                <Line 
                  type="monotone" 
                  dataKey="neutral" 
                  stroke={COLORS.accent} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.accent, strokeWidth: 2, r: 4 }}
                  name="Neutral"
                />
                <Line 
                  type="monotone" 
                  dataKey="negative" 
                  stroke={COLORS.danger} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.danger, strokeWidth: 2, r: 4 }}
                  name="Negative"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}

        {/* Rating Distribution */}
        <Card className="hover-lift animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
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
                <span className="text-sm font-medium">Average Response Rate</span>
                <span className="text-lg font-bold text-purple">78%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
