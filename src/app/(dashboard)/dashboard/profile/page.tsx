"use client";

import { useEffect, useState } from "react";
import { Mail, User, Building, Calendar, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Profile = {
  fullName: string;
  email: string;
  companyName: string;
  role: string;
  joinDate: string;
};

const emptyProfile: Profile = {
  fullName: "",
  email: "",
  companyName: "",
  role: "Admin",
  joinDate: new Date().toISOString()
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [formData, setFormData] = useState(profile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (!active) return;
        const nextProfile = {
          fullName: data.user.fullName,
          email: data.user.email,
          companyName: data.user.companyName,
          role: "Admin",
          joinDate: new Date().toISOString()
        };
        setProfile(nextProfile);
        setFormData(nextProfile);
      })
      .catch(() => {
        if (active) setError("Could not load your profile.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          companyName: formData.companyName
        })
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? "Could not save your profile.");
        return;
      }

      const nextProfile = {
        ...profile,
        fullName: data.user.fullName,
        email: data.user.email,
        companyName: data.user.companyName
      };
      setProfile(nextProfile);
      setFormData(nextProfile);
      setIsEditing(false);
    } catch {
      setError("Could not save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Profile, value: string) => {
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
              disabled={loading || saving}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  {saving ? "Saving" : "Save"}
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
            {error ? <p className="text-sm text-danger">{error}</p> : null}
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
                    value={formData.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    className="bg-background/70"
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile.companyName}</p>
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
