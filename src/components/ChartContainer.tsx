
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  description,
  children,
  className = ""
}: ChartContainerProps) {
  return (
    <Card className={`hover-lift animate-slide-up ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
