// components/MiniProfileCompletion.tsx
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CompletionStats } from '@/services/profileCompletionService';

export const MiniProfileCompletion: React.FC<{ 
  percentage: number,
  showLabel?: boolean 
}> = ({ percentage, showLabel = true }) => {
  const getColorClass = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getLabel = (percentage: number) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Bon";
    if (percentage >= 40) return "Moyen";
    return "À améliorer";
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex-1">
        {showLabel && (
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">
              Complétion du profil
            </span>
            <span className={`text-xs font-bold ${
              percentage >= 80 ? 'text-green-600' : 
              percentage >= 60 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {percentage}%
            </span>
          </div>
        )}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getColorClass(percentage)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-1">
            <span className={`text-xs font-medium ${
              percentage >= 80 ? 'text-green-600' : 
              percentage >= 60 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {getLabel(percentage)}
            </span>
          </div>
        )}
      </div>
      {percentage < 100 && (
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      )}
    </div>
  );
};