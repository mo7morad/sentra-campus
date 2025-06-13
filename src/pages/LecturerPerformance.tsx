
import React, { useState } from "react";
import { Users, Star, TrendingUp, AlertTriangle, Search } from "lucide-react";
import { ChartContainer } from "@/components/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const lecturerData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    department: "Computer Science",
    rating: 4.8,
    totalFeedback: 127,
    courses: ["Data Structures", "Algorithms"],
    strengths: ["Clear Explanation", "Helpful", "Engaging"],
    concerns: [],
    trend: "positive"
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    department: "Engineering",
    rating: 3.2,
    totalFeedback: 89,
    courses: ["Circuit Design", "Electronics"],
    strengths: ["Knowledgeable"],
    concerns: ["Unclear Instructions", "Unresponsive"],
    trend: "negative"
  },
  {
    id: 3,
    name: "Dr. Emily Williams",
    department: "Business",
    rating: 4.5,
    totalFeedback: 156,
    courses: ["Marketing", "Strategy"],
    strengths: ["Practical Examples", "Interactive"],
    concerns: ["Fast Pace"],
    trend: "positive"
  },
  {
    id: 4,
    name: "Prof. David Brown",
    department: "Computer Science",
    rating: 4.9,
    totalFeedback: 203,
    courses: ["Machine Learning", "AI"],
    strengths: ["Excellent Teaching", "Inspiring", "Clear"],
    concerns: [],
    trend: "positive"
  }
];

const performanceMetrics = [
  { subject: "Teaching Quality", A: 85, B: 65, fullMark: 100 },
  { subject: "Communication", A: 90, B: 70, fullMark: 100 },
  { subject: "Responsiveness", A: 88, B: 45, fullMark: 100 },
  { subject: "Course Material", A: 92, B: 75, fullMark: 100 },
  { subject: "Engagement", A: 87, B: 60, fullMark: 100 },
  { subject: "Assessment", A: 89, B: 68, fullMark: 100 },
];

const LecturerPerformance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedL lecturer, setSelectedLecturer] = useState(lecturerData[0]);

  const filteredLecturers = lecturerData.filter(lecturer => {
    const matchesSearch = lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecturer.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || lecturer.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departmentRatings = lecturerData.reduce((acc, lecturer) => {
    if (!acc[lecturer.department]) {
      acc[lecturer.department] = { total: 0, count: 0, name: lecturer.department };
    }
    acc[lecturer.department].total += lecturer.rating;
    acc[lecturer.department].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number; name: string }>);

  const departmentChartData = Object.values(departmentRatings).map(dept => ({
    name: dept.name,
    rating: Number((dept.total / dept.count).toFixed(1))
  }));

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground mb-2">Lecturer Performance Analysis</h2>
        <p className="text-muted-foreground">
          Comprehensive evaluation of teaching effectiveness and student feedback
        </p>
      </div>

      {/* Filters */}
      <Card className="animate-slide-up">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search lecturers..."
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

      {/* Department Overview */}
      <ChartContainer
        title="Department Performance Overview"
        description="Average ratings across academic departments"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 5]} />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="rating" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lecturer List */}
        <ChartContainer title="Lecturer Rankings">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLecturers.map((lecturer) => (
              <div
                key={lecturer.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedLecturer.id === lecturer.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedLecturer(lecturer)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{lecturer.name}</h4>
                    <p className="text-sm text-muted-foreground">{lecturer.department}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${lecturer.rating >= 4.5 ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
                      <span className="font-semibold text-foreground">{lecturer.rating}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      lecturer.trend === 'positive' ? 'bg-success' : 'bg-destructive'
                    }`} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {lecturer.courses.map((course, idx) => (
                    <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                      {course}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{lecturer.totalFeedback} responses</span>
                  {lecturer.concerns.length > 0 && (
                    <span className="flex items-center gap-1 text-warning">
                      <AlertTriangle className="w-3 h-3" />
                      {lecturer.concerns.length} concern{lecturer.concerns.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Detailed Analysis */}
        <ChartContainer 
          title={`${selectedLecturer.name} - Performance Radar`}
          description="Multi-dimensional performance analysis"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceMetrics}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar
                name="Current Lecturer"
                dataKey="A"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Department Average"
                dataKey="B"
                stroke="hsl(var(--chart-3))"
                fill="hsl(var(--chart-3))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Detailed Lecturer Info */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            {selectedLecturer.name} - Detailed Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Strengths</h4>
              <div className="space-y-2">
                {selectedLecturer.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-sm text-foreground">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Areas for Improvement</h4>
              <div className="space-y-2">
                {selectedLecturer.concerns.length > 0 ? (
                  selectedLecturer.concerns.map((concern, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-sm text-foreground">{concern}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No major concerns identified</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LecturerPerformance;
