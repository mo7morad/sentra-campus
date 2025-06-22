
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
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="animate-pulse space-y-4 sm:space-y-6">
          <div className="h-6 sm:h-8 bg-muted rounded w-48 sm:w-64"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 sm:h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {currentSemester 
              ? `Current: ${currentSemester.semester_name} ${currentSemester.academic_year}`
              : "Campus Management Information System Overview"
            }
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <MetricCard
          title="Total Lecturers"
          value={stats?.totalLecturers || 0}
          icon={Users}
          change="+5% from last month"
          changeType="positive"
          className="hover-lift"
        />
        <MetricCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={GraduationCap}
          change="+12% from last month"
          changeType="positive"
          className="hover-lift"
        />
        <MetricCard
          title="Active Courses"
          value={stats?.totalCourses || 0}
          icon={BookOpen}
          change="+3% from last month"
          changeType="positive"
          className="hover-lift"
        />
        <MetricCard
          title="Feedback Received"
          value={stats?.totalFeedback || 0}
          icon={MessageSquare}
          change="+8% from last month"
          changeType="positive"
          className="hover-lift"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="animate-slide-up hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Average Rating</span>
                <span className="font-semibold text-sm sm:text-base">{stats?.avgRating || 0}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Response Rate</span>
                <span className="font-semibold text-sm sm:text-base">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Active Departments</span>
                <span className="font-semibold text-sm sm:text-base">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">This Semester</span>
                <span className="font-semibold text-sm sm:text-base">
                  {currentSemester?.semester_name || "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <ChartContainer
          title="Department Overview"
          description="Students and courses by department"
          className="animate-slide-up hover-lift"
        >
          <div className="w-full h-64 sm:h-80 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="students" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="courses" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>

      {/* Quick Actions */}
      <Card className="animate-slide-up hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Building className="w-4 h-4 sm:w-5 sm:h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium text-sm sm:text-base">View Feedback</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Review latest feedback submissions</p>
            </div>
            <div className="p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium text-sm sm:text-base">Generate Reports</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Create detailed analytics reports</p>
            </div>
            <div className="p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer sm:col-span-2 lg:col-span-1">
              <h4 className="font-medium text-sm sm:text-base">Manage Courses</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Add or update course information</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
