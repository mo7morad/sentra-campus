
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, MessageSquare, TrendingUp, GraduationCap, Building } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ChartContainer } from "@/components/ChartContainer";
import { useDashboardStats, useCurrentSemester } from "@/hooks/useData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: currentSemester } = useCurrentSemester();

  // Sample chart data - in production this would come from your database
  const departmentData = [
    { name: "Computer Science", students: 45, courses: 8 },
    { name: "Engineering", students: 38, courses: 6 },
    { name: "Mathematics", students: 28, courses: 5 },
    { name: "Physics", students: 22, courses: 4 },
    { name: "English", students: 15, courses: 3 },
    { name: "Business", students: 32, courses: 5 },
  ];

  if (statsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            {currentSemester 
              ? `Current: ${currentSemester.semester_name} ${currentSemester.academic_year}`
              : "Campus Management Information System Overview"
            }
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Lecturers"
          value={stats?.totalLecturers || 0}
          icon={Users}
          change="+5% from last month"
          changeType="positive"
        />
        <MetricCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={GraduationCap}
          change="+12% from last month"
          changeType="positive"
        />
        <MetricCard
          title="Active Courses"
          value={stats?.totalCourses || 0}
          icon={BookOpen}
          change="+3% from last month"
          changeType="positive"
        />
        <MetricCard
          title="Feedback Received"
          value={stats?.totalFeedback || 0}
          icon={MessageSquare}
          change="+8% from last month"
          changeType="positive"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Rating</span>
                <span className="font-semibold">{stats?.avgRating || 0}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Response Rate</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Departments</span>
                <span className="font-semibold">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Semester</span>
                <span className="font-semibold">
                  {currentSemester?.semester_name || "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <ChartContainer
          title="Department Overview"
          description="Students and courses by department"
          className="animate-slide-up"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="students" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="courses" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Quick Actions */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium">View Feedback</h4>
              <p className="text-sm text-muted-foreground">Review latest feedback submissions</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium">Generate Reports</h4>
              <p className="text-sm text-muted-foreground">Create detailed analytics reports</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium">Manage Courses</h4>
              <p className="text-sm text-muted-foreground">Add or update course information</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
