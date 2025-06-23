
import React, { useState } from "react";
import { FileText, Download, Calendar, Filter, TrendingUp, Users, BookOpen, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDepartments, useAcademicSemesters, useDashboardStats } from "@/hooks/useData";

const Reports = () => {
  const [reportType, setReportType] = useState("all");
  const [semester, setSemester] = useState("current");
  const [department, setDepartment] = useState("all");

  const { data: departments } = useDepartments();
  const { data: semesters } = useAcademicSemesters();
  const { data: stats } = useDashboardStats();

  const reportTypes = [
    { id: "lecturer-performance", name: "Lecturer Performance Report", icon: Users, description: "Detailed analysis of lecturer ratings and feedback" },
    { id: "course-evaluation", name: "Course Evaluation Report", icon: BookOpen, description: "Comprehensive course performance metrics" },
    { id: "feedback-summary", name: "Feedback Summary Report", icon: MessageSquare, description: "Aggregated student feedback analysis" },
    { id: "department-overview", name: "Department Overview Report", icon: TrendingUp, description: "Department-wide performance statistics" },
  ];

  const recentReports = [
    { name: "Fall 2024 Lecturer Performance", type: "lecturer-performance", date: "2024-12-15", status: "completed" },
    { name: "Course Evaluation Summary", type: "course-evaluation", date: "2024-12-10", status: "completed" },
    { name: "Student Feedback Analysis", type: "feedback-summary", date: "2024-12-05", status: "processing" },
    { name: "Department Comparison", type: "department-overview", date: "2024-12-01", status: "completed" },
  ];

  const generateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId} for department: ${department}, semester: ${semester}`);
    alert(`Report generation started for ${reportId}`);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Reports & Analytics</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Generate comprehensive reports and analyze institutional performance
        </p>
      </div>

      {/* Report Filters */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="lecturer-performance">Lecturer Performance</SelectItem>
                <SelectItem value="course-evaluation">Course Evaluation</SelectItem>
                <SelectItem value="feedback-summary">Feedback Summary</SelectItem>
                <SelectItem value="department-overview">Department Overview</SelectItem>
              </SelectContent>
            </Select>

            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
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
                <SelectValue placeholder="Department" />
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

            <Button className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTypes.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <report.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground text-sm sm:text-base">{report.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => generateReport(report.id)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Generate</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-foreground text-sm sm:text-base">{report.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={report.status === "completed" ? "default" : "secondary"}>
                      {report.status}
                    </Badge>
                    {report.status === "completed" && (
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Report Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">47</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Reports Generated</p>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">12</div>
              <p className="text-xs sm:text-sm text-muted-foreground">This Month</p>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{stats?.totalFeedback || 0}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Feedback</p>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{departments.length}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Departments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
