
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Building2,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Star,
  Calendar
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
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

// Professional color palette for dashboard
const COLORS = {
  primary: '#2563eb',
  secondary: '#10b981', 
  accent: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  indigo: '#6366f1',
  teal: '#14b8a6',
  slate: '#64748b'
};

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.purple, COLORS.indigo, COLORS.teal];

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: departments } = useDepartments();
  const { data: feedback } = useFeedback();
  const { data: students } = useStudents();
  const { data: lecturers } = useLecturers();
  const { data: courseOfferings } = useCourseOfferings();

  // Calculate key metrics
  const keyMetrics = useMemo(() => {
    const totalDepartments = departments?.length || 0;
    const activeCourses = courseOfferings?.filter(co => co.is_active)?.length || 0;
    const totalEnrollment = courseOfferings?.reduce((sum, co) => sum + (co.enrolled_count || 0), 0) || 0;
    const avgRating = feedback?.length > 0 
      ? feedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / feedback.length 
      : 0;

    return {
      totalStudents: stats?.totalStudents || 0,
      totalLecturers: stats?.totalLecturers || 0,
      totalDepartments,
      activeCourses,
      totalEnrollment,
      avgRating: Math.round(avgRating * 10) / 10,
      totalFeedback: feedback?.length || 0
    };
  }, [stats, departments, courseOfferings, feedback]);

  // Student distribution by department
  const studentsByDepartment = useMemo(() => {
    if (!students || !departments) return [];
    
    return departments.map(dept => {
      const studentCount = students.filter(student => student.department_id === dept.id).length;
      return {
        name: dept.department_name.length > 15 
          ? dept.department_name.substring(0, 15) + '...' 
          : dept.department_name,
        fullName: dept.department_name,
        students: studentCount,
        percentage: students.length > 0 ? Math.round((studentCount / students.length) * 100) : 0
      };
    }).filter(dept => dept.students > 0)
      .sort((a, b) => b.students - a.students);
  }, [students, departments]);

  // Student enrollment status
  const enrollmentStatus = useMemo(() => {
    if (!students) return [];
    
    const activeCount = students.filter(s => s.student_status === 'Active').length;
    const inactiveCount = students.length - activeCount;
    
    return [
      { name: 'Active', value: activeCount, color: COLORS.secondary },
      { name: 'Inactive', value: inactiveCount, color: COLORS.slate }
    ].filter(item => item.value > 0);
  }, [students]);

  // Course enrollment trends by semester
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
      .slice(-6);
  }, [courseOfferings]);

  // Lecturer workload analysis
  const lecturerWorkload = useMemo(() => {
    if (!lecturers || !courseOfferings) return [];
    
    return lecturers.map(lecturer => {
      const activeCourses = courseOfferings.filter(
        offering => offering.lecturer_id === lecturer.id && offering.is_active
      );
      
      const totalEnrollment = activeCourses.reduce((sum, course) => sum + (course.enrolled_count || 0), 0);
      
      return {
        name: `${lecturer.first_name} ${lecturer.last_name}`.length > 12 
          ? `${lecturer.first_name.charAt(0)}. ${lecturer.last_name}` 
          : `${lecturer.first_name} ${lecturer.last_name}`,
        fullName: `${lecturer.first_name} ${lecturer.last_name}`,
        courses: activeCourses.length,
        enrollment: totalEnrollment,
        department: lecturer.departments?.department_name || 'Unknown'
      };
    }).filter(lecturer => lecturer.courses > 0)
      .sort((a, b) => b.courses - a.courses)
      .slice(0, 8);
  }, [lecturers, courseOfferings]);

  // Feedback sentiment over time
  const feedbackTrends = useMemo(() => {
    if (!feedback) return [];
    
    const monthlyData = feedback.reduce((acc, item) => {
      if (!item.created_at || !item.overall_rating) return acc;
      
      const date = new Date(item.created_at);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      if (!acc[month]) {
        acc[month] = { month, Excellent: 0, Good: 0, Average: 0, Poor: 0 };
      }
      
      const rating = item.overall_rating;
      if (rating === 5) acc[month].Excellent++;
      else if (rating === 4) acc[month].Good++;
      else if (rating === 3) acc[month].Average++;
      else acc[month].Poor++;
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(monthlyData)
      .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6);
  }, [feedback]);

  if (statsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Management Dashboard</h1>
        <p className="text-muted-foreground">
          University system overview and key performance indicators
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{keyMetrics.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {keyMetrics.totalEnrollment.toLocaleString()} total enrollments
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lecturers</CardTitle>
            <GraduationCap className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{keyMetrics.totalLecturers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {keyMetrics.totalDepartments} departments
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Offerings</CardTitle>
            <BookOpen className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{keyMetrics.activeCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active courses
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-5 w-5 text-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{keyMetrics.avgRating}/5</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {keyMetrics.totalFeedback} feedback responses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Student Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Student Distribution by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentsByDepartment} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#64748b" 
                  fontSize={11}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any, name: any, props: any) => [
                    `${value} students (${props.payload.percentage}%)`,
                    props.payload.fullName
                  ]}
                />
                <Bar dataKey="students" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enrollment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Student Enrollment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={enrollmentStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {enrollmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    `${value} students`,
                    name
                  ]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Course Enrollment Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="semester" stroke="#64748b" fontSize={11} />
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
                  dataKey="enrollment" 
                  stroke={COLORS.primary} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                  name="Total Enrollment"
                />
                <Line 
                  type="monotone" 
                  dataKey="courses" 
                  stroke={COLORS.secondary} 
                  strokeWidth={2}
                  dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 3 }}
                  name="Courses Offered"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lecturer Workload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Lecturer Course Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lecturerWorkload}>
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
                  formatter={(value: any, name: any, props: any) => [
                    name === 'courses' ? `${value} courses` : `${value} students`,
                    name === 'courses' ? 'Active Courses' : 'Total Enrollment'
                  ]}
                  labelFormatter={(label: any) => {
                    const lecturer = lecturerWorkload.find(l => l.name === label);
                    return lecturer ? `${lecturer.fullName} (${lecturer.department})` : label;
                  }}
                />
                <Legend />
                <Bar dataKey="courses" fill={COLORS.accent} name="Courses" />
                <Bar dataKey="enrollment" fill={COLORS.indigo} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Feedback Quality Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={feedbackTrends}>
              <defs>
                <linearGradient id="excellent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="good" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="average" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="poor" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="Excellent"
                stackId="1"
                stroke={COLORS.secondary}
                fill="url(#excellent)"
              />
              <Area
                type="monotone"
                dataKey="Good"
                stackId="1"
                stroke={COLORS.primary}
                fill="url(#good)"
              />
              <Area
                type="monotone"
                dataKey="Average"
                stackId="1"
                stroke={COLORS.accent}
                fill="url(#average)"
              />
              <Area
                type="monotone"
                dataKey="Poor"
                stackId="1"
                stroke={COLORS.danger}
                fill="url(#poor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
