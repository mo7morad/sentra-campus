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
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useDashboardStats, useDepartments, useFeedback, useStudents, useLecturers } from "@/hooks/useData";

// Executive color palette
const COLORS = {
  primary: '#1e40af',
  success: '#059669', 
  warning: '#d97706',
  danger: '#dc2626',
  purple: '#7c3aed',
  indigo: '#4f46e5',
  teal: '#0d9488',
  slate: '#475569',
  blue: '#2563eb',
  green: '#16a34a',
  orange: '#ea580c'
};

const CHART_COLORS = ['#1e40af', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0d9488'];

const Dashboard = () => {
  console.log("Executive Dashboard rendered");
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: departments } = useDepartments();
  const { data: feedback } = useFeedback();
  const { data: students } = useStudents();
  const { data: lecturers } = useLecturers();

  // Executive KPI calculations
  const calculateExecutiveMetrics = () => {
    if (!feedback || !stats || !students) return {
      satisfactionRate: 0,
      responseRate: 0,
      criticalIssues: 0,
      activeStudents: 0
    };
    
    const highRatings = feedback.filter(f => f.overall_rating && f.overall_rating >= 4).length;
    const satisfactionRate = feedback.length > 0 ? Math.round((highRatings / feedback.length) * 100) : 0;
    
    const expectedResponses = stats.totalStudents * 0.25; // 25% expected response rate
    const responseRate = Math.round((feedback.length / expectedResponses) * 100);
    
    const criticalIssues = feedback.filter(f => f.overall_rating && f.overall_rating <= 2).length;
    const activeStudents = students.filter(s => s.student_status === 'Active').length;
    
    return { satisfactionRate, responseRate, criticalIssues, activeStudents };
  };

  // Department performance for executive overview
  const getDepartmentPerformance = () => {
    if (!departments || !feedback) return [];
    
    return departments.map(dept => {
      const deptFeedback = feedback.filter(f => {
        const courseDepartmentId = f.course_offerings?.courses?.department_id;
        return courseDepartmentId === dept.id;
      });
      
      const avgRating = deptFeedback.length > 0 
        ? deptFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / deptFeedback.length
        : 0;
      
      const satisfaction = deptFeedback.length > 0 
        ? Math.round((deptFeedback.filter(f => f.overall_rating && f.overall_rating >= 4).length / deptFeedback.length) * 100)
        : 0;
      
      return {
        name: dept.department_name.length > 20 
          ? dept.department_name.substring(0, 20) + '...' 
          : dept.department_name,
        fullName: dept.department_name,
        rating: Math.round(avgRating * 10) / 10,
        satisfaction,
        responses: deptFeedback.length,
        status: satisfaction >= 80 ? 'excellent' : satisfaction >= 60 ? 'good' : 'needs-attention'
      };
    }).filter(dept => dept.responses > 0)
      .sort((a, b) => b.rating - a.rating);
  };

  // Student engagement trends
  const getEngagementTrends = () => {
    if (!feedback) return [];
    
    const monthlyData: { [key: string]: { responses: number, ratings: number[] } } = {};
    
    feedback.forEach(item => {
      if (item.created_at) {
        const date = new Date(item.created_at);
        const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        if (!monthlyData[month]) {
          monthlyData[month] = { responses: 0, ratings: [] };
        }
        
        monthlyData[month].responses++;
        if (item.overall_rating) {
          monthlyData[month].ratings.push(item.overall_rating);
        }
      }
    });
    
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        responses: data.responses,
        avgRating: data.ratings.length > 0 
          ? Math.round((data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length) * 10) / 10
          : 0,
        engagement: Math.min(Math.round((data.responses / 10) * 100), 100) // Normalize engagement
      }))
      .sort((a, b) => new Date(`${a.month} 01`).getTime() - new Date(`${b.month} 01`).getTime())
      .slice(-6);
  };

  // Quality distribution for institutional insights
  const getQualityDistribution = () => {
    if (!feedback || feedback.length === 0) return [];
    
    const categories = [
      { name: 'Excellent (5★)', min: 5, max: 5, color: COLORS.success },
      { name: 'Very Good (4★)', min: 4, max: 4, color: COLORS.blue },
      { name: 'Good (3★)', min: 3, max: 3, color: COLORS.warning },
      { name: 'Poor (2★)', min: 2, max: 2, color: COLORS.orange },
      { name: 'Critical (1★)', min: 1, max: 1, color: COLORS.danger }
    ];

    return categories.map(category => {
      const count = feedback.filter(f => 
        f.overall_rating && f.overall_rating >= category.min && f.overall_rating <= category.max
      ).length;
      
      return {
        name: category.name,
        value: count,
        percentage: Math.round((count / feedback.length) * 100),
        fill: category.color
      };
    }).filter(item => item.value > 0);
  };

  // Faculty performance summary
  const getFacultyOverview = () => {
    if (!lecturers || !feedback) return { performing: 0, developing: 0, critical: 0 };
    
    const lecturerMetrics = lecturers.map(lecturer => {
      const lecturerFeedback = feedback.filter(f => 
        f.course_offerings?.lecturer_id === lecturer.id
      );
      
      if (lecturerFeedback.length === 0) return null;
      
      const avgRating = lecturerFeedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / lecturerFeedback.length;
      return avgRating;
    }).filter(rating => rating !== null);
    
    const performing = lecturerMetrics.filter(r => r! >= 4).length;
    const developing = lecturerMetrics.filter(r => r! >= 3 && r! < 4).length;
    const critical = lecturerMetrics.filter(r => r! < 3).length;
    
    return { performing, developing, critical };
  };

  const executiveMetrics = calculateExecutiveMetrics();
  const departmentPerformance = getDepartmentPerformance();
  const engagementTrends = getEngagementTrends();
  const qualityDistribution = getQualityDistribution();
  const facultyOverview = getFacultyOverview();

  if (statsLoading) {
    return (
      <div className="space-y-8 animate-pulse p-8">
        <div className="h-10 bg-muted rounded w-96 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="space-y-8 p-8">
        {/* Executive Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
            Executive Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Strategic insights and institutional performance metrics for data-driven decision making
          </p>
        </div>

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Student Satisfaction"
            value={`${executiveMetrics.satisfactionRate}%`}
            change={`${stats?.avgRating || 0}/5.0 average rating`}
            changeType={executiveMetrics.satisfactionRate >= 75 ? "positive" : executiveMetrics.satisfactionRate >= 60 ? "neutral" : "negative"}
            icon={Star}
            gradient="from-yellow-500 to-orange-500"
          />
          <MetricCard
            title="Active Students"
            value={executiveMetrics.activeStudents.toLocaleString()}
            change={`${departments?.length || 0} departments`}
            changeType="neutral"
            icon={UserCheck}
            gradient="from-blue-500 to-indigo-600"
          />
          <MetricCard
            title="Response Rate"
            value={`${executiveMetrics.responseRate}%`}
            change={`${stats?.totalFeedback || 0} responses received`}
            changeType={executiveMetrics.responseRate >= 25 ? "positive" : "neutral"}
            icon={MessageSquare}
            gradient="from-green-500 to-teal-600"
          />
          <MetricCard
            title="Critical Issues"
            value={executiveMetrics.criticalIssues}
            change={executiveMetrics.criticalIssues === 0 ? "No critical issues" : "Requires attention"}
            changeType={executiveMetrics.criticalIssues === 0 ? "positive" : "negative"}
            icon={executiveMetrics.criticalIssues === 0 ? CheckCircle : AlertTriangle}
            gradient={executiveMetrics.criticalIssues === 0 ? "from-green-500 to-emerald-600" : "from-red-500 to-rose-600"}
          />
        </div>

        {/* Main Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Department Performance - Takes 2 columns */}
          <div className="xl:col-span-2">
            <ChartContainer 
              title="Department Performance Analysis" 
              description="Academic excellence and student satisfaction by department"
              className="h-[500px]"
            >
              <ResponsiveContainer width="100%" height={420}>
                <BarChart data={departmentPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
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
                      name === 'rating' ? `${value}/5.0` : `${value}%`,
                      name === 'rating' ? 'Average Rating' : 'Satisfaction Rate'
                    ]}
                    labelFormatter={(label) => {
                      const dept = departmentPerformance.find(d => d.name === label);
                      return dept?.fullName || label;
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="satisfaction" 
                    fill={COLORS.success} 
                    name="Satisfaction Rate"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="rating" 
                    fill={COLORS.primary} 
                    name="Average Rating"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Faculty Performance Summary */}
          <ChartContainer 
            title="Faculty Performance" 
            description="Teaching excellence distribution"
            className="h-[500px]"
          >
            <div className="space-y-6 p-4">
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500 shadow-sm">
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">High Performing</p>
                  <p className="text-3xl font-bold text-green-900">{facultyOverview.performing}</p>
                  <p className="text-xs text-green-700 mt-1">Rating ≥ 4.0</p>
                </div>
                <Award className="w-10 h-10 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500 shadow-sm">
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">Developing</p>
                  <p className="text-3xl font-bold text-yellow-900">{facultyOverview.developing}</p>
                  <p className="text-xs text-yellow-700 mt-1">Rating 3.0-3.9</p>
                </div>
                <Target className="w-10 h-10 text-yellow-600" />
              </div>
              
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border-l-4 border-red-500 shadow-sm">
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">Needs Support</p>
                  <p className="text-3xl font-bold text-red-900">{facultyOverview.critical}</p>
                  <p className="text-xs text-red-700 mt-1">Rating < 3.0</p>
                </div>
                <TrendingUp className="w-10 h-10 text-red-600" />
              </div>
              
              <div className="mt-8 p-4 bg-gradient-to-r from-slate-100 to-gray-100 rounded-lg text-center">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-lg">{stats?.totalLecturers || 0}</span>
                  <br />Total Faculty Members
                </p>
              </div>
            </div>
          </ChartContainer>
        </div>

        {/* Trends and Quality Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Engagement Trends */}
          <ChartContainer 
            title="Student Engagement Trends" 
            description="Response patterns and satisfaction over time"
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={engagementTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#responseGradient)"
                  name="Responses"
                />
                <Area 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke={COLORS.success}
                  fillOpacity={1}
                  fill="url(#engagementGradient)"
                  name="Engagement %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Quality Distribution */}
          <ChartContainer 
            title="Educational Quality Distribution" 
            description="Overall satisfaction ratings breakdown"
          >
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={qualityDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {qualityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name, props) => [
                    `${value} responses (${props.payload.percentage}%)`,
                    'Count'
                  ]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => {
                    const percentage = entry.payload?.percentage || 0;
                    return `${value} (${percentage}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Executive Summary */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              Institutional Excellence Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="inline-flex p-3 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors mb-4">
                  <Building2 className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Institutional Scale</h3>
                <p className="text-blue-200 text-sm leading-relaxed">
                  {departments?.length || 0} academic departments serving {executiveMetrics.activeStudents.toLocaleString()} active students with {stats?.totalCourses || 0} course offerings
                </p>
              </div>
              <div className="text-center group">
                <div className="inline-flex p-3 rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors mb-4">
                  <GraduationCap className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Academic Excellence</h3>
                <p className="text-green-200 text-sm leading-relaxed">
                  {executiveMetrics.satisfactionRate}% student satisfaction rate with {facultyOverview.performing} high-performing faculty members
                </p>
              </div>
              <div className="text-center group">
                <div className="inline-flex p-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors mb-4">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Feedback Engagement</h3>
                <p className="text-yellow-200 text-sm leading-relaxed">
                  {executiveMetrics.responseRate}% response rate with {stats?.totalFeedback || 0} total feedback submissions collected
                </p>
              </div>
              <div className="text-center group">
                <div className="inline-flex p-3 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors mb-4">
                  <Star className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Quality Assurance</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  {stats?.avgRating || 0}/5.0 overall rating with {executiveMetrics.criticalIssues === 0 ? 'no' : executiveMetrics.criticalIssues} critical issues requiring attention
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
