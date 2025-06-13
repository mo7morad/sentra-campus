
import React from "react";
import { Users, BookOpen, MessageSquare, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ChartContainer } from "@/components/ChartContainer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const performanceData = [
  { name: "Jan", satisfaction: 85, courses: 42 },
  { name: "Feb", satisfaction: 87, courses: 45 },
  { name: "Mar", satisfaction: 82, courses: 48 },
  { name: "Apr", satisfaction: 89, courses: 51 },
  { name: "May", satisfaction: 91, courses: 53 },
  { name: "Jun", satisfaction: 88, courses: 56 },
];

const departmentData = [
  { name: "Computer Science", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Engineering", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Business", value: 22, color: "hsl(var(--chart-3))" },
  { name: "Arts", value: 15, color: "hsl(var(--chart-4))" },
];

const recentFeedback = [
  { course: "Data Structures", lecturer: "Dr. Smith", rating: 4.8, status: "excellent" },
  { course: "Database Systems", lecturer: "Prof. Johnson", rating: 3.2, status: "needs-attention" },
  { course: "Web Development", lecturer: "Dr. Williams", rating: 4.5, status: "good" },
  { course: "Machine Learning", lecturer: "Prof. Brown", rating: 4.9, status: "excellent" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Monitor student feedback trends and institutional performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Feedback Responses"
          value="2,847"
          change="+12% from last month"
          changeType="positive"
          icon={MessageSquare}
          gradient="gradient-primary"
        />
        <MetricCard
          title="Active Lecturers"
          value="156"
          change="+3 new this semester"
          changeType="positive"
          icon={Users}
          gradient="gradient-success"
        />
        <MetricCard
          title="Courses Evaluated"
          value="89"
          change="5 pending review"
          changeType="neutral"
          icon={BookOpen}
          gradient="gradient-warning"
        />
        <MetricCard
          title="Average Satisfaction"
          value="4.2/5"
          change="+0.3 improvement"
          changeType="positive"
          icon={TrendingUp}
          gradient="gradient-success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Satisfaction Trends"
          description="Monthly student satisfaction and course completion rates"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
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
                dataKey="satisfaction"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Department Distribution"
          description="Feedback responses by academic department"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Recent Feedback Table */}
      <ChartContainer
        title="Recent Course Evaluations"
        description="Latest feedback submissions requiring attention"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Course</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Lecturer</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentFeedback.map((item, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{item.course}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.lecturer}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-foreground">{item.rating}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'excellent' 
                        ? 'bg-success/10 text-success' 
                        : item.status === 'good'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {item.status === 'excellent' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : item.status === 'needs-attention' ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <TrendingUp className="w-3 h-3" />
                      )}
                      {item.status === 'excellent' ? 'Excellent' : 
                       item.status === 'good' ? 'Good' : 'Needs Attention'}
                    </span>
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

export default Dashboard;
