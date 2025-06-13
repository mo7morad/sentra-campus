
import React, { useState } from "react";
import { Settings as SettingsIcon, User, Database, Shield, Bell, Palette, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const [settings, setSettings] = useState({
    // System Settings
    institutionName: "University of Technology",
    academicYear: "2024-2025",
    semester: "Fall 2024",
    feedbackDeadline: "2024-12-15",
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    urgentAlerts: true,
    
    // AI Analysis Settings
    sentimentAnalysis: true,
    autoTagging: true,
    trendDetection: true,
    anomalyDetection: false,
    
    // Privacy Settings
    anonymousResponses: true,
    dataRetention: "2-years",
    exportPermissions: "admin-only",
    
    // User Preferences
    theme: "system",
    language: "en",
    timezone: "UTC-8",
    dashboardLayout: "standard"
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground mb-2">System Settings</h2>
        <p className="text-muted-foreground">
          Configure system preferences and manage application settings
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai">AI & Analytics</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution Name</Label>
                  <Input
                    id="institution"
                    value={settings.institutionName}
                    onChange={(e) => handleSettingChange("institutionName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academic-year">Academic Year</Label>
                  <Select 
                    value={settings.academicYear} 
                    onValueChange={(value) => handleSettingChange("academicYear", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2026-2027">2026-2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Current Semester</Label>
                  <Select 
                    value={settings.semester} 
                    onValueChange={(value) => handleSettingChange("semester", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                      <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                      <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Feedback Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={settings.feedbackDeadline}
                    onChange={(e) => handleSettingChange("feedbackDeadline", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email alerts for important system events
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get instant browser notifications
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generated weekly summary reports
                  </p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => handleSettingChange("weeklyReports", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Urgent Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    High-priority notifications for critical issues
                  </p>
                </div>
                <Switch
                  checked={settings.urgentAlerts}
                  onCheckedChange={(checked) => handleSettingChange("urgentAlerts", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                AI & Analytics Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Sentiment Analysis</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically analyze feedback sentiment
                  </p>
                </div>
                <Switch
                  checked={settings.sentimentAnalysis}
                  onCheckedChange={(checked) => handleSettingChange("sentimentAnalysis", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-Tagging</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically categorize and tag feedback
                  </p>
                </div>
                <Switch
                  checked={settings.autoTagging}
                  onCheckedChange={(checked) => handleSettingChange("autoTagging", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Trend Detection</Label>
                  <p className="text-sm text-muted-foreground">
                    Identify patterns and trends in feedback data
                  </p>
                </div>
                <Switch
                  checked={settings.trendDetection}
                  onCheckedChange={(checked) => handleSettingChange("trendDetection", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Anomaly Detection</Label>
                  <p className="text-sm text-muted-foreground">
                    Detect unusual patterns or outliers
                  </p>
                </div>
                <Switch
                  checked={settings.anomalyDetection}
                  onCheckedChange={(checked) => handleSettingChange("anomalyDetection", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Anonymous Responses</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep student identities anonymous in feedback
                  </p>
                </div>
                <Switch
                  checked={settings.anonymousResponses}
                  onCheckedChange={(checked) => handleSettingChange("anonymousResponses", checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Data Retention Period</Label>
                <Select 
                  value={settings.dataRetention} 
                  onValueChange={(value) => handleSettingChange("dataRetention", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="2-years">2 Years</SelectItem>
                    <SelectItem value="3-years">3 Years</SelectItem>
                    <SelectItem value="5-years">5 Years</SelectItem>
                    <SelectItem value="indefinite">Indefinite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Export Permissions</Label>
                <Select 
                  value={settings.exportPermissions} 
                  onValueChange={(value) => handleSettingChange("exportPermissions", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin-only">Admin Only</SelectItem>
                    <SelectItem value="management">Management & Admin</SelectItem>
                    <SelectItem value="faculty">All Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance & Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => handleSettingChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => handleSettingChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select 
                  value={settings.timezone} 
                  onValueChange={(value) => handleSettingChange("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                    <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dashboard Layout</Label>
                <Select 
                  value={settings.dashboardLayout} 
                  onValueChange={(value) => handleSettingChange("dashboardLayout", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
