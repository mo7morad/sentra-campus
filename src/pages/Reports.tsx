import React, { useState } from "react";
import { BarChart, Calendar, Download, TrendingUp, Filter } from "lucide-react";
import { ChartContainer } from "@/components/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

const departmentPerformance = [
  { name: "Computer Science", rating: 4.6, responses: 450, satisfaction: 89 },
  { name: "Engineering", rating: 3.8, responses: 320, satisfaction: 72 },
  { name: "Business", rating: 4.2, responses: 380, satisfaction: 84 },
  { name: "Mathematics", rating: 4.1, responses: 280, satisfaction: 78 },
  { name: "Physics", rating: 4.4, responses: 210, satisfaction: 86 },
];

const monthlyTrends = [
  { month: "Jan", rating: 4.1, responses: 180, issues: 12 },
  { month: "Feb", rating: 4.2, responses: 195, issues: 8 },
  { month: "Mar", rating: 4.0, responses: 220, issues: 15 },
  { month: "Apr", rating: 4.3, responses: 240, issues: 6 },
  { month: "May", rating: 4.4, responses: 260, issues: 4 },
  { month: "Jun", rating: 4.5, responses: 285, issues: 3 },
];

const lecturerDistribution = [
  { name: "Excellent (4.5+)", value: 45, color: "hsl(var(--chart-2))" },
  { name: "Good (3.5-4.4)", value: 38, color: "hsl(var(--chart-1))" },
  { name: "Average (2.5-3.4)", value: 12, color: "hsl(var(--chart-3))" },
  { name: "Below Average (<2.5)", value: 5, color: "hsl(var(--chart-4))" },
];

const Reports = () => {
  const [reportType, setReportType] = useState("overview");
  const [dateRange, setDateRange] = useState("semester");
  const [department, setDepartment] = useState("all");

  const generateReport = () => {
    // In a real application, this would generate and download a PDF report
    console.log("Generating report with filters:", { reportType, dateRange, department });
    alert("Report generation would be implemented here!");
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive reporting and data visualization for institutional insights
        </p>
      </div>

      {/* Report Controls */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-foreground">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Executive Overview</SelectItem>
                  <SelectItem value="department">Department Analysis</SelectItem>
                  <SelectItem value="lecturer">Lecturer Performance</SelectItem>
                  <SelectItem value="course">Course Evaluation</SelectItem>
                  <SelectItem value="trends">Trend Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-foreground">Time Period</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="semester">Current Semester</SelectItem>
                  <SelectItem value="year">Academic Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-foreground">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="eng">Engineering</SelectItem>
                  <SelectItem value="bus">Business</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateReport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
                <p className="text-2xl font-bold text-foreground">4.3/5</p>
                <p className="text-xs text-success">+0.2 vs last semester</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold text-foreground">78%</p>
                <p className="text-xs text-success">+5% vs last semester</p>
              </div>
              <BarChart className="w-8 h-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues Resolved</p>
                <p className="text-2xl font-bold text-foreground">94%</p>
                <p className="text-xs text-success">+8% vs last semester</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
                <p className="text-2xl font-bold text-foreground">82%</p>
                <p className="text-xs text-success">+6% vs last semester</p>
              </div>
              <Calendar className="w-8 h-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Department Performance Comparison"
          description="Rating and satisfaction metrics by department"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={departmentPerformance}>
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
              <Bar dataKey="rating" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Lecturer Performance Distribution"
          description="Distribution of lecturers by performance rating"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={lecturerDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {lecturerDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Monthly Trends Analysis"
          description="Rating trends and issue resolution over time"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }}
                name="Average Rating"
              />
              <Line
                type="monotone"
                dataKey="issues"
                stroke="hsl(var(--chart-4))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2 }}
                name="Unresolved Issues"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Response Volume Trends"
          description="Feedback submission patterns over time"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Area
                type="monotone"
                dataKey="responses"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Summary Table */}
      <ChartContainer
        title="Detailed Performance Summary"
        description="Comprehensive breakdown by department"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avg Rating</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Responses</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Satisfaction</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody>
              {departmentPerformance.map((dept, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{dept.name}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${
                      dept.rating >= 4.5 ? 'text-success' : 
                      dept.rating >= 3.5 ? 'text-warning' : 'text-destructive'
                    }`}>
                      {dept.rating}/5
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{dept.responses}</td>
                  <td className="py-3 px-4 text-muted-foreground">{dept.satisfaction}%</td>
                  <td className="py-3 px-4">
                    <TrendingUp className="w-4 h-4 text-success" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartContainer>
    </div>
  );
};

export default Reports;
