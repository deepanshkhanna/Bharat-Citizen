export const popularForCitizens = ["pm-scholarship", "ayushman-bharat", "pm-kisan"];

export const popularServices = [
  { key: "scholarships", label: "Scholarships", icon: "GraduationCap" },
  { key: "health", label: "Health Schemes", icon: "Stethoscope" },
  { key: "housing", label: "Housing", icon: "Home" },
  { key: "farmer", label: "Farmer Benefits", icon: "Sprout" },
  { key: "senior", label: "Senior Support", icon: "UserRound" },
] as const;

export const recentActivity = [
  {
    title: "PM Scholarship Scheme",
    meta: "Viewed recently",
    tone: "neutral" as const,
  },
  {
    title: "Complaint BR-2026-104",
    meta: "Under Review",
    tone: "info" as const,
  },
  {
    title: "Eligibility Check",
    meta: "High Match",
    tone: "success" as const,
  },
];
