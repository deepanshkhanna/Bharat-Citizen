import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  UserRound,
  Globe,
  Eye,
  Save,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProfile, upsertProfile } from "@/server/api/profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Smart Bharat" },
      {
        name: "description",
        content:
          "Set up your civic profile, language, and accessibility preferences.",
      },
    ],
  }),
  component: ProfilePage,
});

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh",
  "Puducherry", "Andaman & Nicobar",
];

const AGE_GROUPS = ["Under 18", "18-25", "26-35", "36-45", "46-59", "60+"];

const CATEGORIES = [
  { value: "Student", label: "Student" },
  { value: "Farmer", label: "Farmer" },
  { value: "Senior Citizen", label: "Senior Citizen" },
  { value: "Job Seeker", label: "Job Seeker" },
  { value: "Woman Entrepreneur", label: "Woman Entrepreneur" },
  { value: "Small Business Owner", label: "Small Business Owner" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "ta", label: "தமிழ் (Tamil)" },
  { value: "te", label: "తెలుగు (Telugu)" },
  { value: "bn", label: "বাংলা (Bengali)" },
];

// Simple session ID for anonymous use
function getSessionId(): string {
  if (typeof window === "undefined") return "__ssr__";
  let id = localStorage.getItem("sb_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("sb_session_id", id);
  }
  return id;
}

function ProfilePage() {
  const [state, setState] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [occupation, setOccupation] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("en");
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const sessionId = getSessionId();
        const result = await getProfile({ data: { sessionId } });
        if (result.profile) {
          setState(result.profile.state ?? "");
          setAgeGroup(result.profile.ageGroup ?? "");
          setOccupation(result.profile.occupation ?? "");
          setCategory(result.profile.category ?? "");
          setLanguage(result.profile.language ?? "en");
          setLargeText(result.profile.largeText);
          setHighContrast(result.profile.highContrast);
        }
      } catch (error) {
        console.error("[profile] Load error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await upsertProfile({
        data: {
          sessionId: getSessionId(),
          state: state || undefined,
          ageGroup: ageGroup || undefined,
          occupation: occupation || undefined,
          category: category || undefined,
          language,
          largeText,
          highContrast,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("[profile] Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10 md:px-10 md:py-16">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-10 md:py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
          Personalization
        </p>
        <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Your Civic Profile
        </h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          Tell us about yourself so Smart Bharat can personalise
          recommendations and eligibility checks.
        </p>
      </header>

      <div className="mt-8 space-y-8">
        {/* Civic Profile Section */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">
              Civic Profile
            </h2>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">
                State
              </Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="state" className="h-12 rounded-xl">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Age Group */}
            <div className="space-y-2">
              <Label htmlFor="ageGroup" className="text-sm font-medium">
                Age Group
              </Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger id="ageGroup" className="h-12 rounded-xl">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_GROUPS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-sm font-medium">
                Occupation
              </Label>
              <Input
                id="occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Student, Teacher, Farmer"
                className="h-12 rounded-xl"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="h-12 rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Language Section */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-saffron/10 text-saffron">
              <Globe className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">
              Language
            </h2>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {LANGUAGES.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLanguage(l.value)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                    language === l.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-surface text-foreground hover:border-primary/30",
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Accessibility Section */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/10 text-success">
              <Eye className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">
              Accessibility
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Large Text</p>
                <p className="text-xs text-muted-foreground">
                  Increase text size across the app
                </p>
              </div>
              <Switch checked={largeText} onCheckedChange={setLargeText} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  High Contrast
                </p>
                <p className="text-xs text-muted-foreground">
                  Stronger color contrast for readability
                </p>
              </div>
              <Switch
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>

            <div className="flex items-center justify-between opacity-60">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Voice Assistance
                </p>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
              <Switch disabled />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full rounded-full py-6 text-base"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : saved ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Profile Saved!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
