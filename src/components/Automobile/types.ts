// components/automobile/types.ts

import { LucideIcon } from "lucide-react";

export interface MainService {
  id: number;
  title: string;
  icon: LucideIcon;
  description: string;
  color: string;
  features: string[];
  image: string;
}

export interface Package {
  name: string;
  price: string;
  description: string;
  features: string[];
  color: string;
  popular: boolean;
}

export interface Testimonial {
  name: string;
  car: string;
  rating: number;
  comment: string;
  date: string;
}