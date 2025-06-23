
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useAcademicSemesters, useCurrentSemester } from "@/hooks/useData";
import { Button } from "@/components/ui/button";

interface AcademicNavigatorProps {
  onSemesterChange?: (semesterId: string) => void;
  selectedSemesterId?: string;
}

export const AcademicNavigator = ({ onSemesterChange, selectedSemesterId }: AcademicNavigatorProps) => {
  const { data: semesters } = useAcademicSemesters();
  const { data: currentSemester } = useCurrentSemester();
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  useEffect(() => {
    if (selectedSemesterId) {
      setSelectedSemester(selectedSemesterId);
    } else if (currentSemester && !selectedSemester) {
      setSelectedSemester(currentSemester.id.toString());
    }
  }, [currentSemester, selectedSemesterId]);

  if (!semesters || !currentSemester) {
    return (
      <Card className="animate-slide-up">
        <CardContent className="p-4">
          <div className="animate-pulse h-16 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const activeSemester = semesters.find(s => s.id.toString() === selectedSemester) || currentSemester;
  const currentIndex = semesters.findIndex(s => s.id.toString() === selectedSemester);
  const previousSemester = currentIndex > 0 ? semesters[currentIndex - 1] : null;
  const nextSemester = currentIndex < semesters.length - 1 ? semesters[currentIndex + 1] : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSemesterChange = (newSemesterId: string) => {
    setSelectedSemester(newSemesterId);
    onSemesterChange?.(newSemesterId);
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && previousSemester) {
      handleSemesterChange(previousSemester.id.toString());
    } else if (direction === 'next' && nextSemester) {
      handleSemesterChange(nextSemester.id.toString());
    }
  };

  return (
    <Card className="animate-slide-up hover-lift">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          Academic Navigator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Semester Display */}
          <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">
                  {activeSemester.semester_name} {activeSemester.academic_year}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(activeSemester.start_date)} - {formatDate(activeSemester.end_date)}
                </p>
              </div>
            </div>
            {activeSemester.is_current && (
              <Badge variant="default" className="bg-primary">Current</Badge>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {previousSemester && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleNavigation('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
              )}
              
              {nextSemester && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleNavigation('next')}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Semester Selector */}
            <Select 
              value={selectedSemester} 
              onValueChange={handleSemesterChange}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{semester.semester_name} {semester.academic_year}</span>
                      {semester.is_current && (
                        <Badge variant="secondary" className="ml-2 text-xs">Current</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats for Selected Semester */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">{semesters.length}</div>
              <p className="text-xs text-muted-foreground">Total Semesters</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {new Date(activeSemester.end_date).getTime() > Date.now() ? 'Active' : 'Completed'}
              </div>
              <p className="text-xs text-muted-foreground">Period</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {Math.max(0, Math.ceil((new Date(activeSemester.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
              </div>
              <p className="text-xs text-muted-foreground">Days Remaining</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
