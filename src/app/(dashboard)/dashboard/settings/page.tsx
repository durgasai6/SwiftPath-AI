"use client";

import { useState } from "react";
import { Bell, Lock, Eye, Zap, Database, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      alerts: true,
      weekly: true,
      reports: false
    },
    privacy: {
      twoFactor: false,
      dataCollection: true
    },
    preferences: {
      theme: "dark",
      language: "en",
      autoAnalysis: true
    }
  });

  const handleToggle = (section: string, key: string, value: boolean) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section as keyof typeof settings],
        [key]: value
      }
    });
  };

  const handleSelect = (key: string, value: string) => {
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted">Manage your preferences and account security</p>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <Card className="border-white/10 bg-surface/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Alert Notifications</Label>
                <p className="text-sm text-muted">Get notified about critical supplier risks</p>
              </div>
              <Checkbox
                checked={settings.notifications.alerts}
                onCheckedChange={(checked) =>
                  handleToggle("notifications", "alerts", checked as boolean)
                }
              />
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted">Receive weekly analysis summaries</p>
                </div>
                <Checkbox
                  checked={settings.notifications.weekly}
                  onCheckedChange={(checked) =>
                    handleToggle("notifications", "weekly", checked as boolean)
                  }
                />
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Report Notifications</Label>
                  <p className="text-sm text-muted">Get notified when reports are ready</p>
                </div>
                <Checkbox
                  checked={settings.notifications.reports}
                  onCheckedChange={(checked) =>
                    handleToggle("notifications", "reports", checked as boolean)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="border-white/10 bg-surface/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted">Add an extra layer of security</p>
              </div>
              <Checkbox
                checked={settings.privacy.twoFactor}
                onCheckedChange={(checked) =>
                  handleToggle("privacy", "twoFactor", checked as boolean)
                }
              />
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Collection</Label>
                  <p className="text-sm text-muted">Help us improve with usage analytics</p>
                </div>
                <Checkbox
                  checked={settings.privacy.dataCollection}
                  onCheckedChange={(checked) =>
                    handleToggle("privacy", "dataCollection", checked as boolean)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-white/10 bg-surface/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle>Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={settings.preferences.theme} onValueChange={(v) => handleSelect("theme", v)}>
                <SelectTrigger className="bg-background/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={settings.preferences.language} onValueChange={(v) => handleSelect("language", v)}>
                  <SelectTrigger className="bg-background/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Analysis</Label>
                  <p className="text-sm text-muted">Automatically analyze new suppliers</p>
                </div>
                <Checkbox
                  checked={settings.preferences.autoAnalysis}
                  onCheckedChange={(checked) =>
                    handleToggle("preferences", "autoAnalysis", checked as boolean)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="border-white/10 bg-surface/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>API Keys</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-mono text-sm">sk_live_••••••••••••••••</Label>
                  <p className="text-xs text-muted">Created 2 months ago</p>
                </div>
                <Button size="sm" variant="outline">
                  Revoke
                </Button>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <Button size="sm" className="gap-2">
                <Zap className="h-4 w-4" />
                Generate New Key
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data */}
        <Card className="border-white/10 bg-surface/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Export Your Data</Label>
              <p className="text-sm text-muted mb-3">Download all your data in JSON format</p>
              <Button size="sm" variant="outline">
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/20 bg-red-950/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-500">Sign Out & Sessions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Active Sessions: 1</Label>
              <p className="text-sm text-muted mb-3">Sign out from all devices</p>
              <Button size="sm" variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-950/20">
                Sign Out All Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
