
import React, { useState } from "react";
import { FileText, Download, Calendar, Filter, TrendingUp, Users, BookOpen, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";

const Reports = () => {
  const [reportType, setReportType] = useState("all");
  const [semester, setSemester] = useState("current");
  const [department, setDepartment] = useState("all");

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
    console.log(`Generating report: ${reportId}`);
    alert(`Report generation started for ${reportId}`);
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h2>
        <p className="text-muted-foreground">
          Generate comprehensive reports and analyze institutional performance
        </p>
      </div>

      {/* Report Filters */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="lecturer-performance">Lecturer Performance</SelectItem>
                <SelectItem value="course-evaluation">Course Evaluation</SelectItem>
                <SelectItem value="feedback-summary">Feedback Summary</SelectItem>
              </SelectContent>
            </Select>

            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Semester</SelectItem>
                <SelectItem value="fall-2024">Fall 2024</SelectItem>
                <SelectItem value="spring-2024">Spring 2024</SelectItem>
                <SelectItem value="all">All Semesters</SelectItem>
              </SelectContent>
            </Select>

            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="computer-science">Computer Science</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="business">Business</SelectItem>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTypes.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <report.icon className="w-8 h-8 text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => generateReport(report.id)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Generate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-foreground">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={report.status === "completed" ? "default" : "secondary"}>
                      {report.status}
                    </Badge>
                    {report.status === "completed" && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
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
          <CardTitle>Report Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">47</div>
              <p className="text-sm text-muted-foreground">Reports Generated</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3.2GB</div>
              <p className="text-sm text-muted-foreground">Total Data</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">98%</div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
