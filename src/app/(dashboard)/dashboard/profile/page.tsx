"use client";

import { useState } from "react";
import { Mail, User, Building, Calendar, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Demo User",
    email: "demo@swiftpath.com",
    company: "Demo Company",
    role: "Admin",
    joinDate: "2024-01-15"
  });

  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="text-muted">Manage your account information and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-2 border-white/10 bg-surface/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Account Information</CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="bg-background/70"
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    type="email"
                    className="bg-background/70"
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Company
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    className="bg-background/70"
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile.company}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Badge variant="secondary" className="w-fit">
                  {profile.role}
                </Badge>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <Label className="flex items-center gap-2 text-muted">
                <Calendar className="h-4 w-4" />
                Member Since
              </Label>
              <p className="mt-2 text-foreground font-medium">
                {new Date(profile.joinDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-white/10 bg-surface/80">
          <CardHeader>
            <CardTitle className="text-lg">Account Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted">Suppliers Monitored</p>
              <p className="text-2xl font-bold text-primary">247</p>
            </div>
            <div>
              <p className="text-sm text-muted">Active Alerts</p>
              <p className="text-2xl font-bold text-orange-500">12</p>
            </div>
            <div>
              <p className="text-sm text-muted">Risk Assessment Score</p>
              <p className="text-2xl font-bold text-green-500">7.8/10</p>
            </div>
            <div>
              <p className="text-sm text-muted">API Calls (This Month)</p>
              <p className="text-2xl font-bold text-blue-500">3,245</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-500/20 bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-950/20">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
