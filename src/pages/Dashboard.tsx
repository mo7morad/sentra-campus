
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { ChartContainer } from "@/components/ChartContainer";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  GraduationCap,
  UserCheck,
  Clock,
  Star
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useDashboardStats, useDepartments, useAcademicSemesters } from "@/hooks/useData";

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
  const { data: semesters } = useAcademicSemesters();

  // Sample performance data
  const performanceData = [
    { month: 'Jan', satisfaction: 4.2, engagement: 3.8, performance: 4.0 },
    { month: 'Feb', satisfaction: 4.3, engagement: 4.0, performance: 4.1 },
    { month: 'Mar', satisfaction: 4.1, engagement: 3.9, performance: 3.9 },
    { month: 'Apr', satisfaction: 4.4, engagement: 4.2, performance: 4.3 },
    { month: 'May', satisfaction: 4.5, engagement: 4.3, performance: 4.4 },
    { month: 'Jun', satisfaction: 4.6, engagement: 4.4, performance: 4.5 },
  ];

  const departmentData = departments?.map(dept => ({
    name: dept.department_name,
    students: Math.floor(Math.random() * 200) + 50,
    satisfaction: Math.floor(Math.random() * 100) + 70
  })) || [];

  const feedbackTrends = [
    { month: 'Jan', positive: 65, neutral: 25, negative: 10 },
    { month: 'Feb', positive: 70, neutral: 22, negative: 8 },
    { month: 'Mar', positive: 68, neutral: 24, negative: 8 },
    { month: 'Apr', positive: 73, neutral: 20, negative: 7 },
    { month: 'May', positive: 75, neutral: 18, negative: 7 },
    { month: 'Jun', positive: 78, neutral: 16, negative: 6 },
  ];

  // Updated student enrollment data with realistic distribution
  const studentEnrollmentData = [
    { name: 'Active Students', value: 85, color: COLORS.secondary },
    { name: 'On Leave', value: 8, color: COLORS.accent },
    { name: 'Graduated', value: 5, color: COLORS.primary },
    { name: 'Inactive', value: 2, color: COLORS.danger }
  ];

  const recentActivities = [
    { type: 'feedback', message: 'New course evaluation submitted for CSE301', time: '2 hours ago', icon: MessageSquare },
    { type: 'enrollment', message: '15 new students enrolled this week', time: '1 day ago', icon: Users },
    { type: 'course', message: 'EEE201 capacity increased to 45 students', time: '2 days ago', icon: BookOpen },
    { type: 'performance', message: 'Q2 performance reports generated', time: '3 days ago', icon: TrendingUp },
  ];

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
          title="Avg Satisfaction"
          value="4.5/5"
          change="+0.3 from last semester"
          changeType="positive"
          icon={Star}
          gradient="gradient-destructive"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Performance Trends */}
        <ChartContainer title="Performance Trends" description="Monthly satisfaction and engagement metrics">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="satisfaction" 
                stroke={COLORS.primary} 
                strokeWidth={3}
                dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                name="Satisfaction"
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke={COLORS.secondary} 
                strokeWidth={3}
                dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 4 }}
                name="Engagement"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Student Enrollment Status with corrected data */}
        <ChartContainer title="Student Enrollment Status" description="Current distribution of student enrollment">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studentEnrollmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {studentEnrollmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentage']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Department Performance */}
        <ChartContainer title="Department Performance" description="Student count and satisfaction by department">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Bar dataKey="students" fill={COLORS.primary} name="Students" radius={[4, 4, 0, 0]} />
              <Bar dataKey="satisfaction" fill={COLORS.secondary} name="Satisfaction" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Feedback Trends */}
        <ChartContainer title="Feedback Sentiment Trends" description="Distribution of positive, neutral, and negative feedback">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={feedbackTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="positive" 
                stackId="1" 
                stroke={COLORS.secondary} 
                fill={COLORS.secondary}
                fillOpacity={0.8}
                name="Positive"
              />
              <Area 
                type="monotone" 
                dataKey="neutral" 
                stackId="1" 
                stroke={COLORS.accent} 
                fill={COLORS.accent}
                fillOpacity={0.8}
                name="Neutral"
              />
              <Area 
                type="monotone" 
                dataKey="negative" 
                stackId="1" 
                stroke={COLORS.danger} 
                fill={COLORS.danger}
                fillOpacity={0.8}
                name="Negative"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Recent Activities */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Recent System Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <activity.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
