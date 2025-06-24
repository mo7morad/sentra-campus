
import React, { useState } from "react";
import { FileText, Download, Calendar, Filter, TrendingUp, Users, BookOpen, MessageSquare, BarChart3, PieChart, LineChart, Activity, FileBarChart, Eye, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDepartments, useAcademicSemesters, useDashboardStats } from "@/hooks/useData";

const Reports = () => {
  const [reportType, setReportType] = useState("all");
  const [semester, setSemester] = useState("current");
  const [department, setDepartment] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: departments } = useDepartments();
  const { data: semesters } = useAcademicSemesters();
  const { data: stats } = useDashboardStats();

  const reportCategories = [
    {
      id: "academic",
      name: "Academic Performance",
      icon: TrendingUp,
      color: "bg-blue-500",
      description: "Student outcomes, course effectiveness, and academic trends",
      reports: [
        { name: "Student Performance Analysis", type: "performance", estimated: "2-3 min", size: "1.2 MB" },
        { name: "Course Effectiveness Report", type: "course-effectiveness", estimated: "3-4 min", size: "2.1 MB" },
        { name: "Grade Distribution Analysis", type: "grade-distribution", estimated: "1-2 min", size: "0.8 MB" },
        { name: "Academic Trend Forecast", type: "trend-forecast", estimated: "4-5 min", size: "3.2 MB" }
      ]
    },
    {
      id: "faculty",
      name: "Faculty & Teaching",
      icon: Users,
      color: "bg-green-500",
      description: "Lecturer performance, teaching quality, and faculty analytics",
      reports: [
        { name: "Lecturer Performance Dashboard", type: "lecturer-performance", estimated: "2-3 min", size: "1.5 MB" },
        { name: "Teaching Quality Assessment", type: "teaching-quality", estimated: "3-4 min", size: "2.3 MB" },
        { name: "Faculty Workload Analysis", type: "workload-analysis", estimated: "2-3 min", size: "1.8 MB" },
        { name: "Professional Development Tracking", type: "development-tracking", estimated: "1-2 min", size: "0.9 MB" }
      ]
    },
    {
      id: "feedback",
      name: "Student Feedback",
      icon: MessageSquare,
      color: "bg-purple-500",
      description: "Feedback analysis, sentiment tracking, and response insights",
      reports: [
        { name: "Comprehensive Feedback Analysis", type: "feedback-analysis", estimated: "3-4 min", size: "2.8 MB" },
        { name: "Sentiment Trends Report", type: "sentiment-trends", estimated: "2-3 min", size: "1.6 MB" },
        { name: "Response Rate Analytics", type: "response-analytics", estimated: "1-2 min", size: "0.7 MB" },
        { name: "Feedback Action Items", type: "action-items", estimated: "2-3 min", size: "1.3 MB" }
      ]
    },
    {
      id: "operational",
      name: "Operational Insights",
      icon: BarChart3,
      color: "bg-orange-500",
      description: "Resource utilization, enrollment trends, and institutional metrics",
      reports: [
        { name: "Enrollment Trends & Projections", type: "enrollment-trends", estimated: "3-4 min", size: "2.5 MB" },
        { name: "Resource Utilization Report", type: "resource-utilization", estimated: "2-3 min", size: "1.9 MB" },
        { name: "Department Performance Comparison", type: "department-comparison", estimated: "4-5 min", size: "3.1 MB" },
        { name: "Capacity Planning Analysis", type: "capacity-planning", estimated: "3-4 min", size: "2.7 MB" }
      ]
    }
  ];

  const recentReports = [
    { 
      name: "Q4 2024 Academic Performance Summary", 
      category: "Academic Performance", 
      date: "2024-12-20", 
      status: "completed",
      downloads: 23,
      size: "2.4 MB"
    },
    { 
      name: "Fall 2024 Faculty Excellence Report", 
      category: "Faculty & Teaching", 
      date: "2024-12-18", 
      status: "completed",
      downloads: 15,
      size: "1.8 MB"
    },
    { 
      name: "Student Satisfaction Insights", 
      category: "Student Feedback", 
      date: "2024-12-15", 
      status: "processing",
      downloads: 0,
      size: "Pending"
    },
    { 
      name: "Enrollment Capacity Analysis", 
      category: "Operational Insights", 
      date: "2024-12-12", 
      status: "completed",
      downloads: 31,
      size: "3.1 MB"
    }
  ];

  const quickStats = [
    { label: "Reports Generated", value: "147", change: "+12 this month", icon: FileBarChart },
    { label: "Data Points Analyzed", value: "25.6K", change: "+2.3K this week", icon: Activity },
    { label: "Active Insights", value: "89", change: "+5 new insights", icon: Eye },
    { label: "Avg Generation Time", value: "2.8min", change: "-0.4min faster", icon: Clock }
  ];

  const generateReport = (reportType: string, category: string) => {
    console.log(`Generating ${reportType} report in ${category} category`);
    // Simulate report generation with loading state
    const notification = `📊 Generating ${reportType} report... This may take a few minutes.`;
    alert(notification);
  };

  if (!departments || !semesters) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h2>
        <p className="text-muted-foreground">
          Generate comprehensive insights and data-driven reports for informed decision making
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Report Generation</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="insights">Quick Insights</TabsTrigger>
        </TabsList>

        {/* Report Generation Tab */}
        <TabsContent value="overview" className="space-y-6">
          
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Report Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Semester</SelectItem>
                    {semesters.map((sem) => (
                      <SelectItem key={sem.id} value={sem.id.toString()}>
                        {sem.semester_name} {sem.academic_year}
                      </SelectItem>
                    ))}
                    <SelectItem value="all">All Semesters</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Range
                </Button>

                <Button className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${category.color} rounded-lg`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.reports.map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{report.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {report.estimated}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ~{report.size}
                            </span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => generateReport(report.type, category.name)}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-3 h-3" />
                          Generate
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recent Reports Tab */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <p className="text-sm text-muted-foreground">
                Access and download your previously generated reports
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <h4 className="font-semibold text-foreground">{report.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground">{report.category}</span>
                          <span className="text-sm text-muted-foreground">{report.date}</span>
                          {report.status === "completed" && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {report.downloads} downloads
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={report.status === "completed" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{report.size}</span>
                      {report.status === "completed" && (
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <Download className="w-3 h-3" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Insights Tab */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800">Excellent Progress</h4>
                    <p className="text-sm text-green-700">Overall student satisfaction increased by 8.3% this semester</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Engagement Growth</h4>
                    <p className="text-sm text-blue-700">Course participation rates up 12% across all departments</p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800">Quality Improvement</h4>
                    <p className="text-sm text-purple-700">Teaching effectiveness scores reached highest levels</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Action Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800">Attention Needed</h4>
                    <p className="text-sm text-yellow-700">3 courses have below-average feedback scores</p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800">Resource Planning</h4>
                    <p className="text-sm text-orange-700">2 departments approaching capacity limits</p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800">Urgent Review</h4>
                    <p className="text-sm text-red-700">Response rates dropped in EEE department</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
