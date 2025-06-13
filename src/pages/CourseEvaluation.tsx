
import React, { useState } from "react";
import { BookOpen, TrendingUp, TrendingDown, AlertTriangle, Search } from "lucide-react";
import { ChartContainer } from "@/components/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from "recharts";

const courseData = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    code: "CS201",
    department: "Computer Science",
    lecturer: "Dr. Sarah Johnson",
    students: 85,
    rating: 4.8,
    difficulty: 4.2,
    workload: 3.8,
    satisfaction: 4.6,
    recommendations: 92,
    issues: [],
    trend: "positive"
  },
  {
    id: 2,
    name: "Circuit Design Fundamentals",
    code: "EE301",
    department: "Engineering",
    lecturer: "Prof. Michael Chen",
    students: 67,
    rating: 3.1,
    difficulty: 4.5,
    workload: 4.8,
    satisfaction: 2.9,
    recommendations: 45,
    issues: ["Unclear instructions", "Heavy workload", "Poor organization"],
    trend: "negative"
  },
  {
    id: 3,
    name: "Digital Marketing Strategy",
    code: "BUS401",
    department: "Business",
    lecturer: "Dr. Emily Williams",
    students: 124,
    rating: 4.3,
    difficulty: 2.8,
    workload: 3.2,
    satisfaction: 4.1,
    recommendations: 78,
    issues: ["Too theoretical"],
    trend: "stable"
  },
  {
    id: 4,
    name: "Machine Learning Applications",
    code: "CS401",
    department: "Computer Science",
    lecturer: "Prof. David Brown",
    students: 96,
    rating: 4.9,
    difficulty: 4.1,
    workload: 4.0,
    satisfaction: 4.8,
    recommendations: 97,
    issues: [],
    trend: "positive"
  }
];

const semesterTrends = [
  { semester: "Fall 2023", avgRating: 3.8, satisfaction: 75 },
  { semester: "Spring 2024", avgRating: 4.0, satisfaction: 78 },
  { semester: "Summer 2024", avgRating: 4.1, satisfaction: 80 },
  { semester: "Fall 2024", avgRating: 4.2, satisfaction: 82 },
];

const CourseEvaluation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(courseData[0]);

  const filteredCourses = courseData.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || course.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const scatterData = courseData.map(course => ({
    x: course.difficulty,
    y: course.satisfaction,
    name: course.name,
    students: course.students
  }));

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-success";
    if (rating >= 3.5) return "text-warning";
    return "text-destructive";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "negative":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground mb-2">Course Evaluation Analysis</h2>
        <p className="text-muted-foreground">
          Comprehensive assessment of course effectiveness and student satisfaction
        </p>
      </div>

      {/* Filters */}
      <Card className="animate-slide-up">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <ChartContainer
        title="Course Quality Trends"
        description="Overall course ratings and satisfaction over time"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={semesterTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" />
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
              dataKey="avgRating"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }}
              name="Average Rating"
            />
            <Line
              type="monotone"
              dataKey="satisfaction"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2 }}
              name="Satisfaction %"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course List */}
        <ChartContainer title="Course Performance Overview">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedCourse.id === course.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedCourse(course)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{course.name}</h4>
                      {getTrendIcon(course.trend)}
                    </div>
                    <p className="text-sm text-muted-foreground">{course.code} • {course.lecturer}</p>
                    <p className="text-xs text-muted-foreground">{course.students} students</p>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getRatingColor(course.rating)}`}>
                      {course.rating}/5
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {course.recommendations}% recommend
                    </div>
                  </div>
                </div>
                
                {course.issues.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {course.issues.slice(0, 2).map((issue, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
                        {issue}
                      </Badge>
                    ))}
                    {course.issues.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.issues.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Difficulty: {course.difficulty}/5</span>
                  <span>Workload: {course.workload}/5</span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Difficulty vs Satisfaction Scatter */}
        <ChartContainer
          title="Course Difficulty vs Satisfaction"
          description="Relationship between course difficulty and student satisfaction"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="x" 
                type="number" 
                domain={[1, 5]} 
                stroke="hsl(var(--muted-foreground))"
                name="Difficulty"
              />
              <YAxis 
                dataKey="y" 
                type="number" 
                domain={[1, 5]} 
                stroke="hsl(var(--muted-foreground))"
                name="Satisfaction"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-foreground">{data.name}</p>
                        <p className="text-sm text-muted-foreground">Difficulty: {data.x}</p>
                        <p className="text-sm text-muted-foreground">Satisfaction: {data.y}</p>
                        <p className="text-sm text-muted-foreground">Students: {data.students}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="y" fill="hsl(var(--chart-1))" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Detailed Course Analysis */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            {selectedCourse.name} - Detailed Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRatingColor(selectedCourse.rating)}`}>
                {selectedCourse.rating}/5
              </div>
              <p className="text-sm text-muted-foreground">Overall Rating</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {selectedCourse.recommendations}%
              </div>
              <p className="text-sm text-muted-foreground">Would Recommend</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {selectedCourse.students}
              </div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Course Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Difficulty Level</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-chart-3 h-2 rounded-full" 
                        style={{ width: `${(selectedCourse.difficulty / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedCourse.difficulty}/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Workload</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-chart-4 h-2 rounded-full" 
                        style={{ width: `${(selectedCourse.workload / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedCourse.workload}/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Satisfaction</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-chart-2 h-2 rounded-full" 
                        style={{ width: `${(selectedCourse.satisfaction / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedCourse.satisfaction}/5</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Issues & Concerns
                {selectedCourse.issues.length > 0 && (
                  <AlertTriangle className="inline w-4 h-4 ml-2 text-warning" />
                )}
              </h4>
              <div className="space-y-2">
                {selectedCourse.issues.length > 0 ? (
                  selectedCourse.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-sm text-foreground">{issue}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No major issues identified</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseEvaluation;
