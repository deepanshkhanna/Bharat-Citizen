import { useState } from "react";
import {
  Camera,
  MapPin,
  FileText,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ISSUE_TYPES = [
  { value: "Road", label: "Road", icon: "🛣️" },
  { value: "Water", label: "Water", icon: "💧" },
  { value: "Electricity", label: "Electricity", icon: "⚡" },
  { value: "Sanitation", label: "Sanitation", icon: "🧹" },
  { value: "Public Safety", label: "Public Safety", icon: "🛡️" },
] as const;

type ComplaintFormData = {
  issueType: string;
  location: string;
  description: string;
  photo: string | null;
};

export function ComplaintForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (data: ComplaintFormData) => void;
  isSubmitting: boolean;
}) {
  const [issueType, setIssueType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!issueType) newErrors.issueType = "Please select an issue type";
    if (!location.trim()) newErrors.location = "Please enter the location";
    if (!description.trim()) newErrors.description = "Please describe the issue";
    if (description.length > 2000)
      newErrors.description = "Description must be under 2000 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "Photo must be under 5MB" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setPhotoName(file.name);
      setErrors((prev) => {
        const { photo: _, ...rest } = prev;
        return rest;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ issueType, location, description, photo });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Issue Type */}
      <div className="space-y-2">
        <Label htmlFor="issueType" className="text-sm font-medium">
          Issue Type
        </Label>
        <Select value={issueType} onValueChange={setIssueType}>
          <SelectTrigger id="issueType" className="h-12 rounded-xl">
            <SelectValue placeholder="Select issue type" />
          </SelectTrigger>
          <SelectContent>
            {ISSUE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                <span className="flex items-center gap-2">
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.issueType && (
          <p className="text-xs text-destructive">{errors.issueType}</p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">
          Location
        </Label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Sector 15, Gurugram, Haryana"
            className="h-12 rounded-xl pl-10"
          />
        </div>
        {errors.location && (
          <p className="text-xs text-destructive">{errors.location}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail..."
          className="min-h-[120px] rounded-xl resize-none"
          maxLength={2000}
        />
        <div className="flex items-center justify-between">
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-muted-foreground">
            {description.length}/2000
          </p>
        </div>
      </div>

      {/* Photo Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Photo (optional)</Label>
        <label
          htmlFor="photo-upload"
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-surface/60 px-4 py-4 transition-colors hover:border-primary/40"
        >
          <Camera className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {photoName ?? "Upload a photo of the issue"}
          </span>
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />
        {errors.photo && (
          <p className="text-xs text-destructive">{errors.photo}</p>
        )}
        {photo && (
          <div className="mt-2 overflow-hidden rounded-xl border border-border">
            <img
              src={photo}
              alt="Uploaded issue"
              className="h-40 w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full py-6 text-base"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Submit Complaint
          </>
        )}
      </Button>
    </form>
  );
}
