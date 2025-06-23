
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, MessageSquare, TrendingUp, GraduationCap, Building } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ChartContainer } from "@/components/ChartContainer";
import { useDashboardStats, useCurrentSemester, useDepartments, useCourses, useStudents, useLecturers, useCourseOfferings, useFeedback } from "@/hooks/useData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import { AcademicNavigator } from "@/components/AcademicNavigator";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: currentSemester } = useCurrentSemester();
  const { data: departments } = useDepartments();
  const { data: courses } = useCourses();
  const { data: students } = useStudents();
  const { data: lecturers } = useLecturers();
  const { data: courseOfferings } = useCourseOfferings();
  const { data: feedback } = useFeedback();
  
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");

  // Filter data based on selected semester
  const filteredData = useMemo(() => {
    const semesterId = selectedSemesterId || currentSemester?.id.toString();
    if (!semesterId) return { courseOfferings: [], feedback: [] };

    const semesterOfferings = courseOfferings?.filter(
      offering => offering.academic_semesters?.id?.toString() === semesterId
    ) || [];

    const semesterFeedback = feedback?.filter(
      fb => fb.course_offerings?.academic_semesters?.id?.toString() === semesterId
    ) || [];

    return {
      courseOfferings: semesterOfferings,
      feedback: semesterFeedback
    };
  }, [courseOfferings, feedback, selectedSemesterId, currentSemester]);

  // Generate department data from filtered course offerings
  const departmentData = useMemo(() => {
    if (!departments || !students || !filteredData.courseOfferings) return [];
    
    return departments.map(dept => {
      const deptStudents = students.filter(student => student.department_id === dept.id);
      const deptOfferings = filteredData.courseOfferings.filter(
        offering => offering.courses?.departments?.id === dept.id
      );
      
      return {
        name: dept.department_name,
        students: deptStudents.length,
        courses: deptOfferings.length
      };
    }).sort((a, b) => b.students - a.students).slice(0, 8);
  }, [departments, students, filteredData.courseOfferings]);

  // Generate enrollment status data from real student data
  const enrollmentStatusData = useMemo(() => {
    if (!students) return [];
    
    const statusCounts = students.reduce((acc, student) => {
      const status = student.student_status || 'Active';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: Math.round((count / students.length) * 100)
    }));
  }, [students]);

  // Calculate semester-specific stats
  const semesterStats = useMemo(() => {
    const activeLecturers = lecturers?.filter(l => l.is_active).length || 0;
    const totalStudents = students?.length || 0;
    const activeCourses = filteredData.courseOfferings.length;
    const totalFeedback = filteredData.feedback.length;
    
    const avgRating = filteredData.feedback.length > 0
      ? filteredData.feedback.reduce((sum, fb) => sum + (fb.overall_rating || 0), 0) / filteredData.feedback.length
      : 0;

    return {
      totalLecturers: activeLecturers,
      totalStudents,
      totalCourses: activeCourses,
      totalFeedback,
      avgRating: Math.round(avgRating * 10) / 10
    };
  }, [lecturers, students, filteredData]);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'feedback':
        navigate('/feedback-management');
        break;
      case 'reports':
        navigate('/reports');
        break;
      case 'courses':
        navigate('/course-evaluation');
        break;
      default:
        break;
    }
  };

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemesterId(semesterId);
  };

  if (!currentSemester) {
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
            Campus Management Information System Overview
          </p>
        </div>
      </div>

      {/* Academic Navigator */}
      <AcademicNavigator 
        onSemesterChange={handleSemesterChange}
        selectedSemesterId={selectedSemesterId}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <MetricCard
          title="Total Lecturers"
          value={semesterStats.totalLecturers}
          icon={Users}
          change="+5% from last month"
          changeType="positive"
        />
        <MetricCard
          title="Total Students"
          value={semesterStats.totalStudents}
          icon={GraduationCap}
          change="+12% from last month"
          changeType="positive"
        />
        <MetricCard
          title="Active Courses"
          value={semesterStats.totalCourses}
          icon={BookOpen}
          change="+3% from last month"
          changeType="positive"
        />
        <MetricCard
          title="Feedback Received"
          value={semesterStats.totalFeedback}
          icon={MessageSquare}
          change="+8% from last month"
          changeType="positive"
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
                <span className="font-semibold text-sm sm:text-base">{semesterStats.avgRating}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Total Departments</span>
                <span className="font-semibold text-sm sm:text-base">{departments?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Active Lecturers</span>
                <span className="font-semibold text-sm sm:text-base">
                  {lecturers?.filter(l => l.is_active).length || 0}
                </span>
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

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartContainer
          title="Student Enrollment Status"
          description="Distribution of student status"
          className="animate-slide-up hover-lift"
        >
          <div className="w-full h-64 sm:h-80 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enrollmentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {enrollmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Quick Actions */}
        <Card className="animate-slide-up hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Building className="w-4 h-4 sm:w-5 sm:h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div 
                className="p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-all cursor-pointer hover:shadow-md hover:border-primary/50"
                onClick={() => handleQuickAction('feedback')}
              >
                <h4 className="font-medium text-sm sm:text-base">View Feedback</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Review {semesterStats.totalFeedback} feedback submissions
                </p>
              </div>
              <div 
                className="p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-all cursor-pointer hover:shadow-md hover:border-primary/50"
                onClick={() => handleQuickAction('reports')}
              >
                <h4 className="font-medium text-sm sm:text-base">Generate Reports</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Create analytics for {departments?.length || 0} departments
                </p>
              </div>
              <div 
                className="p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-all cursor-pointer hover:border-primary/50"
                onClick={() => handleQuickAction('courses')}
              >
                <h4 className="font-medium text-sm sm:text-base">Manage Courses</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Update {semesterStats.totalCourses} active courses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
