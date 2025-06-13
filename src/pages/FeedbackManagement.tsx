
import React, { useState } from "react";
import { MessageSquare, Filter, Calendar, User, BookOpen, Star, AlertTriangle, CheckCircle } from "lucide-react";
import { ChartContainer } from "@/components/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const feedbackData = [
  {
    id: 1,
    student: "Anonymous Student #1247",
    course: "Data Structures & Algorithms",
    lecturer: "Dr. Sarah Johnson",
    rating: 5,
    date: "2024-06-10",
    sentiment: "positive",
    category: "teaching_quality",
    comment: "Excellent teaching methods. Dr. Johnson explains complex concepts clearly and provides great examples. The assignments are challenging but fair.",
    aiAnalysis: {
      keywords: ["excellent", "clear", "challenging", "fair"],
      themes: ["Teaching Quality", "Clarity", "Assessment"],
      urgency: "low"
    },
    status: "reviewed"
  },
  {
    id: 2,
    student: "Anonymous Student #1589",
    course: "Circuit Design Fundamentals",
    lecturer: "Prof. Michael Chen",
    rating: 2,
    date: "2024-06-09",
    sentiment: "negative",
    category: "communication",
    comment: "Professor Chen is difficult to understand during lectures. The instructions for assignments are unclear and he doesn't respond to emails promptly. Very frustrating experience.",
    aiAnalysis: {
      keywords: ["difficult", "unclear", "unresponsive", "frustrating"],
      themes: ["Communication", "Responsiveness", "Instruction Quality"],
      urgency: "high"
    },
    status: "pending"
  },
  {
    id: 3,
    student: "Anonymous Student #1832",
    course: "Digital Marketing Strategy",
    lecturer: "Dr. Emily Williams",
    rating: 4,
    date: "2024-06-08",
    sentiment: "positive",
    category: "course_content",
    comment: "Good course content with practical examples. Sometimes the pace is a bit fast, but overall very informative and relevant to current industry trends.",
    aiAnalysis: {
      keywords: ["good", "practical", "fast pace", "informative", "relevant"],
      themes: ["Course Content", "Pacing", "Industry Relevance"],
      urgency: "low"
    },
    status: "reviewed"
  },
  {
    id: 4,
    student: "Anonymous Student #1456",
    course: "Machine Learning Applications",
    lecturer: "Prof. David Brown",
    rating: 5,
    date: "2024-06-07",
    sentiment: "positive",
    category: "engagement",
    comment: "Professor Brown is incredibly knowledgeable and passionate about the subject. His enthusiasm is contagious and makes even difficult topics interesting. Great use of real-world projects.",
    aiAnalysis: {
      keywords: ["knowledgeable", "passionate", "enthusiastic", "interesting", "real-world"],
      themes: ["Expertise", "Engagement", "Practical Application"],
      urgency: "low"
    },
    status: "reviewed"
  }
];

const sentimentStats = {
  positive: 68,
  neutral: 22,
  negative: 10
};

const categoryStats = [
  { name: "Teaching Quality", count: 45, percentage: 32 },
  { name: "Communication", count: 28, percentage: 20 },
  { name: "Course Content", count: 35, percentage: 25 },
  { name: "Assessment", count: 20, percentage: 14 },
  { name: "Engagement", count: 12, percentage: 9 }
];

const FeedbackManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(feedbackData[0]);

  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesSearch = feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter;
    const matchesSentiment = sentimentFilter === "all" || feedback.sentiment === sentimentFilter;
    return matchesSearch && matchesStatus && matchesSentiment;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-success/10 text-success border-success/20";
      case "negative":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reviewed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground mb-2">Feedback Management</h2>
        <p className="text-muted-foreground">
          AI-powered analysis and management of student feedback submissions
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
                <p className="text-2xl font-bold text-foreground">2,847</p>
              </div>
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Positive</p>
                <p className="text-2xl font-bold text-success">{sentimentStats.positive}%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Needs Attention</p>
                <p className="text-2xl font-bold text-destructive">{sentimentStats.negative}%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold text-foreground">4.2/5</p>
              </div>
              <Star className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters and Feedback List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiment</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <ChartContainer title="Recent Feedback Submissions">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedFeedback.id === feedback.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedFeedback(feedback)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{feedback.course}</h4>
                        {getStatusIcon(feedback.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{feedback.lecturer}</p>
                      <p className="text-xs text-muted-foreground">{feedback.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < feedback.rating
                                ? "text-warning fill-warning"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <Badge className={getSentimentColor(feedback.sentiment)}>
                        {feedback.sentiment}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground line-clamp-2 mb-2">
                    {feedback.comment}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {feedback.aiAnalysis.keywords.slice(0, 3).map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    <Badge className={getUrgencyColor(feedback.aiAnalysis.urgency)}>
                      {feedback.aiAnalysis.urgency} priority
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ChartContainer>
        </div>

        {/* AI Analysis Panel */}
        <div className="space-y-4">
          <ChartContainer title="AI Analysis & Insights">
            <Tabs defaultValue="feedback" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="feedback" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Selected Feedback</h4>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {selectedFeedback.student}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {selectedFeedback.course}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {selectedFeedback.date}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {selectedFeedback.comment}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">AI Analysis</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Key Themes</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedFeedback.aiAnalysis.themes.map((theme, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Keywords</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedFeedback.aiAnalysis.keywords.map((keyword, idx) => (
                          <Badge key={idx} className="bg-secondary text-secondary-foreground text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Priority Level</p>
                      <Badge className={getUrgencyColor(selectedFeedback.aiAnalysis.urgency)}>
                        {selectedFeedback.aiAnalysis.urgency} priority
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Feedback Categories</h4>
                  <div className="space-y-2">
                    {categoryStats.map((category, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {category.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Sentiment Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-success">Positive</span>
                      <span className="text-sm font-medium">{sentimentStats.positive}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Neutral</span>
                      <span className="text-sm font-medium">{sentimentStats.neutral}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-destructive">Negative</span>
                      <span className="text-sm font-medium">{sentimentStats.negative}%</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;
