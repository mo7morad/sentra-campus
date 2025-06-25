
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Star,
  GraduationCap,
  UserCheck,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { useDashboardStats, useDepartments, useFeedback, useStudents, useLecturers, useCourseOfferings } from "@/hooks/useData";

// Professional color palette for management dashboard
const COLORS = {
  primary: '#2563eb',
  secondary: '#10b981', 
  accent: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  indigo: '#6366f1',
  pink: '#ec4899',
  teal: '#14b8a6',
  slate: '#64748b',
  green: '#22c55e'
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.purple,
  COLORS.indigo,
  COLORS.pink,
  COLORS.teal,
  COLORS.green
];

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: departments } = useDepartments();
  const { data: feedback } = useFeedback();
  const { data: students } = useStudents();
  const { data: lecturers } = useLecturers();
  const { data: courseOfferings } = useCourseOfferings();

  // 1. Student Distribution by Department (Horizontal Bar Chart)
  const studentsByDepartment = useMemo(() => {
    if (!students || !departments) return [];
    
    const deptCounts = departments.map(dept => {
      const studentCount = students.filter(student => student.department_id === dept.id).length;
      return {
        name: dept.department_name.length > 20 
          ? dept.department_name.substring(0, 20) + '...' 
          : dept.department_name,
        fullName: dept.department_name,
        students: studentCount
      };
    }).filter(dept => dept.students > 0)
      .sort((a, b) => b.students - a.students);
    
    return deptCounts;
  }, [students, departments]);

  // 2. Students per Academic Year (Stacked Bar Chart)
  const studentsByYear = useMemo(() => {
    if (!students) return [];
    
    const yearCounts = students.reduce((acc, student) => {
      const year = student.current_year || 1;
      const status = student.student_status || 'Active';
      
      const yearKey = `Year ${year}`;
      if (!acc[yearKey]) {
        acc[yearKey] = { year: yearKey, Active: 0, Inactive: 0, Graduated: 0 };
      }
      
      if (status === 'Active') acc[yearKey].Active++;
      else if (status === 'Inactive') acc[yearKey].Inactive++;
      else if (status === 'Graduated') acc[yearKey].Graduated++;
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(yearCounts).sort((a: any, b: any) => a.year.localeCompare(b.year));
  }, [students]);

  // 3. Student Enrollment Status (Donut Chart)
  const enrollmentStatus = useMemo(() => {
    if (!students) return [];
    
    const statusCounts = students.reduce((acc, student) => {
      const status = student.student_status === 'Active' ? 'Active' : 'Inactive';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const total = students.length;
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: Math.round((count / total) * 100),
      color: status === 'Active' ? COLORS.secondary : COLORS.danger
    }));
  }, [students]);

  // 4. Lecturer Involvement (Grouped Bar Chart)
  const lecturerInvolvement = useMemo(() => {
    if (!lecturers || !courseOfferings) return [];
    
    const lecturerCourses = lecturers.map(lecturer => {
      const activeCourses = courseOfferings.filter(
        offering => offering.lecturer_id === lecturer.id && offering.is_active
      ).length;
      
      return {
        name: `${lecturer.first_name} ${lecturer.last_name}`.length > 15 
          ? `${lecturer.first_name} ${lecturer.last_name}`.substring(0, 15) + '...'
          : `${lecturer.first_name} ${lecturer.last_name}`,
        fullName: `${lecturer.first_name} ${lecturer.last_name}`,
        courses: activeCourses,
        department: lecturer.departments?.department_name || 'Unknown'
      };
    }).filter(lecturer => lecturer.courses > 0)
      .sort((a, b) => b.courses - a.courses)
      .slice(0, 10); // Top 10 most involved lecturers
    
    return lecturerCourses;
  }, [lecturers, courseOfferings]);

  // 5. Course Enrollment Trends (Line Chart)
  const enrollmentTrends = useMemo(() => {
    if (!courseOfferings) return [];
    
    const semesterData = courseOfferings.reduce((acc, offering) => {
      const semester = offering.academic_semesters?.semester_name || 'Unknown';
      const year = offering.academic_semesters?.academic_year || '2024';
      const key = `${semester} ${year}`;
      
      if (!acc[key]) {
        acc[key] = { semester: key, enrollment: 0, courses: 0 };
      }
      
      acc[key].enrollment += offering.enrolled_count || 0;
      acc[key].courses += 1;
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(semesterData)
      .sort((a: any, b: any) => a.semester.localeCompare(b.semester))
      .slice(-6); // Last 6 semesters
  }, [courseOfferings]);

  // 6. Feedback Sentiment Trend (Stacked Area Chart)
  const feedbackSentiment = useMemo(() => {
    if (!feedback) return [];
    
    const monthlyData = feedback.reduce((acc, item) => {
      if (!item.created_at || !item.overall_rating) return acc;
      
      const date = new Date(item.created_at);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      if (!acc[month]) {
        acc[month] = { month, Positive: 0, Neutral: 0, Negative: 0 };
      }
      
      const rating = item.overall_rating;
      if (rating >= 4) acc[month].Positive++;
      else if (rating >= 3) acc[month].Neutral++;
      else acc[month].Negative++;
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(monthlyData)
      .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  }, [feedback]);

  // 7. Department Overview Data
  const departmentOverview = useMemo(() => {
    if (!departments || !students || !courseOfferings || !feedback) return [];
    
    return departments.map(dept => {
      const deptStudents = students.filter(s => s.department_id === dept.id);
      const deptCourses = courseOfferings.filter(co => 
        co.courses?.department_id === dept.id && co.is_active
      );
      const deptFeedback = feedback.filter(f => 
        f.course_offerings?.courses?.department_id === dept.id
      );
      
      const avgRating = deptFeedback.length > 0 
        ? deptFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / deptFeedback.length
        : 0;
      
      return {
        id: dept.id,
        name: dept.department_name,
        students: deptStudents.length,
        courses: deptCourses.length,
        feedback: deptFeedback.length,
        avgRating: Math.round(avgRating * 10) / 10
      };
    }).filter(dept => dept.students > 0 || dept.courses > 0);
  }, [departments, students, courseOfferings, feedback]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-2">University Management Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of students, courses, lecturers, and feedback analytics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Active enrollments</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">Course offerings</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Lecturers</CardTitle>
            <GraduationCap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLecturers || 0}</div>
            <p className="text-xs text-muted-foreground">Faculty members</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgRating || 0}/5</div>
            <p className="text-xs text-muted-foreground">Course feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Student Distribution by Department */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Student Distribution by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentsByDepartment} layout="horizontal" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#64748b" 
                  fontSize={11}
                  width={90}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any, name: any) => [value, 'Students']}
                  labelFormatter={(label: any) => {
                    const dept = studentsByDepartment.find(d => d.name === label);
                    return dept?.fullName || label;
                  }}
                />
                <Bar dataKey="students" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2. Students per Academic Year */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              Students per Academic Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentsByYear} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="Active" stackId="a" fill={COLORS.secondary} />
                <Bar dataKey="Inactive" stackId="a" fill={COLORS.danger} />
                <Bar dataKey="Graduated" stackId="a" fill={COLORS.slate} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Student Enrollment Status */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-accent" />
              Student Enrollment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={enrollmentStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {enrollmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value} students (${props.payload.percentage}%)`,
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
          </CardContent>
        </Card>

        {/* 4. Lecturer Involvement */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple" />
              Top Lecturer Course Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lecturerInvolvement} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={10}
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
                  formatter={(value: any) => [value, 'Courses']}
                  labelFormatter={(label: any) => {
                    const lecturer = lecturerInvolvement.find(l => l.name === label);
                    return lecturer?.fullName || label;
                  }}
                />
                <Bar dataKey="courses" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 5. Course Enrollment Trends */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo" />
              Course Enrollment Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="semester" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any, name: any) => [
                    value,
                    name === 'enrollment' ? 'Total Enrollment' : 'Courses Offered'
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="enrollment" 
                  stroke={COLORS.indigo} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.indigo, strokeWidth: 2, r: 4 }}
                  name="Enrollment"
                />
                <Line 
                  type="monotone" 
                  dataKey="courses" 
                  stroke={COLORS.teal} 
                  strokeWidth={2}
                  dot={{ fill: COLORS.teal, strokeWidth: 2, r: 3 }}
                  name="Courses"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 6. Feedback Sentiment Trend */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-pink" />
              Feedback Sentiment Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={feedbackSentiment} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="positive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="neutral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="negative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Positive"
                  stackId="1"
                  stroke={COLORS.secondary}
                  fill="url(#positive)"
                />
                <Area
                  type="monotone"
                  dataKey="Neutral"
                  stackId="1"
                  stroke={COLORS.accent}
                  fill="url(#neutral)"
                />
                <Area
                  type="monotone"
                  dataKey="Negative"
                  stackId="1"
                  stroke={COLORS.danger}
                  fill="url(#negative)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 7. Department Overview Cards */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Department Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentOverview.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{dept.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Students</span>
                  <span className="font-semibold text-primary">{dept.students}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Courses</span>
                  <span className="font-semibold text-secondary">{dept.courses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Feedback</span>
                  <span className="font-semibold text-accent">{dept.feedback}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Rating</span>
                  <span className="font-semibold text-purple">{dept.avgRating}/5</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
