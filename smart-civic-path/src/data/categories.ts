import {
  GraduationCap,
  Sprout,
  HeartHandshake,
  UserRound,
  Briefcase,
  Stethoscope,
  Home,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import type { Scheme } from "./schemes";

export type Category = {
  name: Scheme["category"];
  icon: LucideIcon;
  description: string;
};

export const categories: Category[] = [
  { name: "Students", icon: GraduationCap, description: "Scholarships & study support" },
  { name: "Farmers", icon: Sprout, description: "Income, subsidy & insurance" },
  { name: "Women", icon: HeartHandshake, description: "Empowerment & savings" },
  { name: "Senior Citizens", icon: UserRound, description: "Pension & healthcare" },
  { name: "Business", icon: Briefcase, description: "MSME loans & subsidy" },
  { name: "Health", icon: Stethoscope, description: "Insurance & wellness" },
  { name: "Housing", icon: Home, description: "Homes & urban benefits" },
  { name: "Education", icon: BookOpen, description: "Skilling & scholarships" },
];
