
import React, { useState } from "react";
import { Users, Star, TrendingUp, AlertTriangle, Search } from "lucide-react";
import { ChartContainer } from "@/components/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useDepartments, useLecturers, useFeedbackByLecturer, useFeedback } from "@/hooks/useData";

const LecturerPerformance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedLecturerId, setSelectedLecturerId] = useState<string>("");

  const { data: departments } = useDepartments();
  const { data: lecturers } = useLecturers();
  const { data: allFeedback } = useFeedback();

  // Process lecturer data with real feedback
  const lecturerData = React.useMemo(() => {
    if (!lecturers || !allFeedback) return [];
    
    return lecturers.map(lecturer => {
      const lecturerFeedback = allFeedback.filter(
        feedback => feedback.course_offerings?.lecturer_id === lecturer.id
      );
      
      const avgRating = lecturerFeedback.length > 0
        ? lecturerFeedback.reduce((sum, fb) => sum + (fb.overall_rating || 0), 0) / lecturerFeedback.length
        : 0;

      // Get courses from course offerings
      const courses = Array.from(new Set(
        lecturerFeedback.map(fb => fb.course_offerings?.courses?.course_name).filter(Boolean)
      ));

      // Analyze feedback for strengths and concerns
      const positiveComments = lecturerFeedback.filter(fb => (fb.overall_rating || 0) >= 4);
      const negativeComments = lecturerFeedback.filter(fb => (fb.overall_rating || 0) <= 2);

      return {
        id: lecturer.id,
        name: `${lecturer.first_name} ${lecturer.last_name}`,
        department: lecturer.departments?.department_name || "Unknown",
        rating: Number(avgRating.toFixed(1)),
        totalFeedback: lecturerFeedback.length,
        courses: courses.slice(0, 3), // Show max 3 courses
        strengths: positiveComments.length > negativeComments.length 
          ? ["Highly Rated", "Positive Feedback"] 
          : positiveComments.length > 0 
          ? ["Good Performance"] 
          : [],
        concerns: negativeComments.length > positiveComments.length 
          ? ["Needs Improvement", "Low Ratings"] 
          : negativeComments.length > 0 
          ? ["Some Concerns"] 
          : [],
        trend: avgRating >= 4 ? "positive" : "negative"
      };
    });
  }, [lecturers, allFeedback]);

  const filteredLecturers = lecturerData.filter(lecturer => {
    const matchesSearch = lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecturer.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || lecturer.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Calculate department ratings from real data
  const departmentRatings = React.useMemo(() => {
    if (!departments || !lecturerData) return [];
    
    return departments.map(dept => {
      const deptLecturers = lecturerData.filter(lecturer => lecturer.department === dept.department_name);
      const avgRating = deptLecturers.length > 0
        ? deptLecturers.reduce((sum, lecturer) => sum + lecturer.rating, 0) / deptLecturers.length
        : 0;
      
      return {
        name: dept.department_name,
        rating: Number(avgRating.toFixed(1))
      };
    }).filter(dept => dept.rating > 0); // Only show departments with data
  }, [departments, lecturerData]);

  // Set default selected lecturer
  const selectedLecturer = selectedLecturerId 
    ? lecturerData.find(l => l.id === selectedLecturerId) 
    : lecturerData[0];

  // Performance metrics based on real data for selected lecturer
  const performanceMetrics = React.useMemo(() => {
    if (!selectedLecturer || !allFeedback) return [];
    
    const lecturerFeedback = allFeedback.filter(
      feedback => feedback.course_offerings?.lecturer_id === selectedLecturer.id
    );

    if (lecturerFeedback.length === 0) {
      return [
        { subject: "Teaching Quality", A: 0, B: 65, fullMark: 5 },
        { subject: "Communication", A: 0, B: 70, fullMark: 5 },
        { subject: "Responsiveness", A: 0, B: 45, fullMark: 5 },
        { subject: "Course Material", A: 0, B: 75, fullMark: 5 },
        { subject: "Engagement", A: 0, B: 60, fullMark: 5 },
        { subject: "Assessment", A: 0, B: 68, fullMark: 5 },
      ];
    }

    const avgTeaching = lecturerFeedback.reduce((sum, fb) => sum + (fb.teaching_effectiveness || 0), 0) / lecturerFeedback.length;
    const avgCommunication = lecturerFeedback.reduce((sum, fb) => sum + (fb.communication || 0), 0) / lecturerFeedback.length;
    const avgAvailability = lecturerFeedback.reduce((sum, fb) => sum + (fb.availability || 0), 0) / lecturerFeedback.length;
    const avgContent = lecturerFeedback.reduce((sum, fb) => sum + (fb.course_content || 0), 0) / lecturerFeedback.length;
    const avgOverall = lecturerFeedback.reduce((sum, fb) => sum + (fb.overall_rating || 0), 0) / lecturerFeedback.length;

    return [
      { subject: "Teaching Quality", A: (avgTeaching * 20), B: 65, fullMark: 100 },
      { subject: "Communication", A: (avgCommunication * 20), B: 70, fullMark: 100 },
      { subject: "Responsiveness", A: (avgAvailability * 20), B: 45, fullMark: 100 },
      { subject: "Course Material", A: (avgContent * 20), B: 75, fullMark: 100 },
      { subject: "Engagement", A: (avgOverall * 20), B: 60, fullMark: 100 },
      { subject: "Assessment", A: (avgOverall * 20), B: 68, fullMark: 100 },
    ];
  }, [selectedLecturer, allFeedback]);

  if (!departments || !lecturers) {
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
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Lecturer Performance Analysis</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Comprehensive evaluation of teaching effectiveness and student feedback
        </p>
      </div>

      {/* Filters */}
      <Card className="animate-slide-up">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-col md:flex-row gap-4">
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
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.department_name}>
                    {dept.department_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Department Overview */}
      <ChartContainer
        title="Department Performance Overview"
        description="Average ratings across academic departments"
        className="animate-slide-up"
      >
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentRatings} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
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
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 5]} fontSize={10} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
              <Bar dataKey="rating" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Lecturer List */}
        <ChartContainer title="Lecturer Rankings" className="animate-slide-up">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLecturers.length > 0 ? (
              filteredLecturers.map((lecturer) => (
                <div
                  key={lecturer.id}
                  className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedLecturer?.id === lecturer.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedLecturerId(lecturer.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm sm:text-base">{lecturer.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{lecturer.department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${lecturer.rating >= 4.5 ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
                        <span className="font-semibold text-foreground text-sm sm:text-base">{lecturer.rating}</span>
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
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">{lecturer.totalFeedback} responses</span>
                    {lecturer.concerns.length > 0 && (
                      <span className="flex items-center gap-1 text-warning">
                        <AlertTriangle className="w-3 h-3" />
                        {lecturer.concerns.length} concern{lecturer.concerns.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No lecturers found matching your criteria</p>
              </div>
            )}
          </div>
        </ChartContainer>

        {/* Detailed Analysis */}
        <ChartContainer 
          title={selectedLecturer ? `${selectedLecturer.name} - Performance Radar` : "Performance Analysis"}
          description="Multi-dimensional performance analysis"
          className="animate-slide-up"
        >
          {selectedLecturer ? (
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceMetrics}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
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
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Select a lecturer to view detailed analysis</p>
            </div>
          )}
        </ChartContainer>
      </div>

      {/* Detailed Lecturer Info */}
      {selectedLecturer && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {selectedLecturer.name} - Detailed Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Strengths</h4>
                <div className="space-y-2">
                  {selectedLecturer.strengths.length > 0 ? (
                    selectedLecturer.strengths.map((strength, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <span className="text-xs sm:text-sm text-foreground">{strength}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground">No feedback data available</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Areas for Improvement</h4>
                <div className="space-y-2">
                  {selectedLecturer.concerns.length > 0 ? (
                    selectedLecturer.concerns.map((concern, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-warning" />
                        <span className="text-xs sm:text-sm text-foreground">{concern}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground">No major concerns identified</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LecturerPerformance;
