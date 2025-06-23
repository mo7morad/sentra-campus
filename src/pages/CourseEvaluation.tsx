
import React, { useState } from "react";
import { BookOpen, TrendingUp, Users, Star, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChartContainer } from "@/components/ChartContainer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useCourses, useDepartments, useFeedback, useAcademicSemesters } from "@/hooks/useData";

const CourseEvaluation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const { data: courses } = useCourses();
  const { data: departments } = useDepartments();
  const { data: semesters } = useAcademicSemesters();
  const { data: allFeedback } = useFeedback();

  // Process course data with real feedback
  const courseData = React.useMemo(() => {
    if (!courses || !allFeedback) return [];
    
    return courses.map(course => {
      const courseFeedback = allFeedback.filter(
        feedback => feedback.course_offerings?.courses?.id === course.id
      );
      
      const avgRating = courseFeedback.length > 0
        ? courseFeedback.reduce((sum, fb) => sum + (fb.overall_rating || 0), 0) / courseFeedback.length
        : 0;

      const avgTeaching = courseFeedback.length > 0
        ? courseFeedback.reduce((sum, fb) => sum + (fb.teaching_effectiveness || 0), 0) / courseFeedback.length
        : 0;

      const avgContent = courseFeedback.length > 0
        ? courseFeedback.reduce((sum, fb) => sum + (fb.course_content || 0), 0) / courseFeedback.length
        : 0;

      // Get unique lecturers for this course
      const lecturers = Array.from(new Set(
        courseFeedback.map(fb => 
          `${fb.course_offerings?.lecturers?.first_name} ${fb.course_offerings?.lecturers?.last_name}`
        ).filter(Boolean)
      ));

      const enrollmentCount = courseFeedback.length > 0 
        ? Math.max(...courseFeedback.map(fb => fb.course_offerings?.enrolled_count || 0))
        : 0;

      return {
        id: course.id,
        code: course.course_code,
        name: course.course_name,
        department: course.departments?.department_name || "Unknown",
        credits: course.credits,
        rating: Number(avgRating.toFixed(1)),
        teachingRating: Number(avgTeaching.toFixed(1)),
        contentRating: Number(avgContent.toFixed(1)),
        responseCount: courseFeedback.length,
        enrollmentCount,
        lecturers: lecturers.slice(0, 2), // Show max 2 lecturers
        trend: avgRating >= 4 ? "positive" : avgRating >= 3 ? "stable" : "negative"
      };
    });
  }, [courses, allFeedback]);

  const filteredCourses = courseData.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || course.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Calculate department performance from real data
  const departmentPerformance = React.useMemo(() => {
    if (!departments || !courseData) return [];
    
    return departments.map(dept => {
      const deptCourses = courseData.filter(course => course.department === dept.department_name);
      const avgRating = deptCourses.length > 0
        ? deptCourses.reduce((sum, course) => sum + course.rating, 0) / deptCourses.length
        : 0;
      
      return {
        name: dept.department_name,
        rating: Number(avgRating.toFixed(1)),
        courses: deptCourses.length,
        responses: deptCourses.reduce((sum, course) => sum + course.responseCount, 0)
      };
    }).filter(dept => dept.courses > 0); // Only show departments with courses
  }, [departments, courseData]);

  // Set default selected course
  const selectedCourse = selectedCourseId 
    ? courseData.find(c => c.id === selectedCourseId) 
    : courseData[0];

  // Course trend data for selected course
  const courseTrendData = React.useMemo(() => {
    if (!selectedCourse || !allFeedback || !semesters) return [];
    
    const courseFeedback = allFeedback.filter(
      feedback => feedback.course_offerings?.courses?.id === selectedCourse.id
    );

    // Group feedback by semester
    const semesterGroups = courseFeedback.reduce((acc, feedback) => {
      const semesterId = feedback.course_offerings?.semester_id;
      if (!semesterId) return acc;
      
      if (!acc[semesterId]) {
        acc[semesterId] = [];
      }
      acc[semesterId].push(feedback);
      return acc;
    }, {} as Record<number, typeof courseFeedback>);

    return Object.entries(semesterGroups).map(([semesterId, feedback]) => {
      const semester = semesters.find(s => s.id === parseInt(semesterId));
      const avgRating = feedback.reduce((sum, fb) => sum + (fb.overall_rating || 0), 0) / feedback.length;
      
      return {
        name: semester ? `${semester.semester_name} ${semester.academic_year}` : 'Unknown',
        rating: Number(avgRating.toFixed(1)),
        responses: feedback.length
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCourse, allFeedback, semesters]);

  if (!courses || !departments || !semesters) {
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
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Course Evaluation Analysis</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Comprehensive analysis of course performance and student satisfaction
        </p>
      </div>

      {/* Filters */}
      <Card className="animate-slide-up">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-col md:flex-row gap-4">
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
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.department_name}>
                    {dept.department_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id.toString()}>
                    {semester.semester_name} {semester.academic_year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Department Performance */}
      <ChartContainer
        title="Department Performance Overview"
        description="Average course ratings by department"
        className="animate-slide-up"
      >
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentPerformance} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
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
        {/* Course List */}
        <ChartContainer title="Course Rankings" className="animate-slide-up">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedCourse?.id === course.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">{course.code}</h4>
                        <Badge variant="outline" className="text-xs">{course.credits} credits</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.department}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${course.rating >= 4.5 ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
                        <span className="font-semibold text-foreground text-sm sm:text-base">{course.rating}</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        course.trend === 'positive' ? 'bg-success' : 
                        course.trend === 'stable' ? 'bg-warning' : 'bg-destructive'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {course.lecturers.map((lecturer, idx) => (
                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                        {lecturer}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">{course.responseCount} responses</span>
                    <span className="text-muted-foreground">{course.enrollmentCount} enrolled</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No courses found matching your criteria</p>
              </div>
            )}
          </div>
        </ChartContainer>

        {/* Course Trend Analysis */}
        <ChartContainer 
          title={selectedCourse ? `${selectedCourse.code} - Rating Trend` : "Course Trend Analysis"}
          description="Performance over time"
          className="animate-slide-up"
        >
          {selectedCourse && courseTrendData.length > 0 ? (
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={courseTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
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
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>{selectedCourse ? "No historical data available" : "Select a course to view trend analysis"}</p>
            </div>
          )}
        </ChartContainer>
      </div>

      {/* Detailed Course Info */}
      {selectedCourse && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {selectedCourse.code} - {selectedCourse.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Overall Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">Overall Rating</span>
                    <span className="font-semibold text-sm sm:text-base">{selectedCourse.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">Teaching Quality</span>
                    <span className="font-semibold text-sm sm:text-base">{selectedCourse.teachingRating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">Content Quality</span>
                    <span className="font-semibold text-sm sm:text-base">{selectedCourse.contentRating}/5</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Course Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">Credits</span>
                    <span className="font-semibold text-sm sm:text-base">{selectedCourse.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">Department</span>
                    <span className="font-semibold text-sm sm:text-base">{selectedCourse.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">Enrollment</span>
                    <span className="font-semibold text-sm sm:text-base">{selectedCourse.enrollmentCount}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Feedback Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">Total Responses</span>
                    <span className="font-semibold text-sm sm:text-base">{selectedCourse.responseCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">Response Rate</span>
                    <span className="font-semibold text-sm sm:text-base">
                      {selectedCourse.enrollmentCount > 0 
                        ? Math.round((selectedCourse.responseCount / selectedCourse.enrollmentCount) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">Trend</span>
                    <Badge variant={selectedCourse.trend === 'positive' ? 'default' : selectedCourse.trend === 'stable' ? 'secondary' : 'destructive'}>
                      {selectedCourse.trend}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseEvaluation;
