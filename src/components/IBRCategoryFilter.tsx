// src/components/IBRCategoryFilter.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Building2,
  Shield,
  BarChart3,
  Award,
  Settings,
  CheckCircle,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  count: number;
}

interface IBRCategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function IBRCategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: IBRCategoryFilterProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => onCategoryChange("all")}
        >
          <CheckCircle className="h-4 w-4 mr-3" />
          Toutes les catégories
          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {categories.reduce((sum, cat) => sum + cat.count, 0)}
          </span>
        </Button>

        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="w-full justify-start h-auto py-3"
              onClick={() => onCategoryChange(category.id)}
            >
              <div className="flex items-start w-full">
                <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-left flex-1">
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {category.description}
                  </div>
                </div>
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                  {category.count}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
