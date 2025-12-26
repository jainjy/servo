import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  validatePassword,
  validatePasswordStrong,
  PASSWORD_CONFIG,
  PASSWORD_ERRORS,
  getPasswordStrengthLabel,
} from "@/utils/passwordValidator";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showStrengthIndicator?: boolean;
  showRequirements?: boolean;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Composant Input pour les mots de passe avec validation
 * Affiche des indicateurs de force et des exigences
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder = "Entrez votre mot de passe",
  value,
  onChange,
  error,
  showStrengthIndicator = false,
  showRequirements = false,
  required = false,
  autoComplete = "password",
  disabled = false,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const basicValidation = validatePassword(value);
  const strongValidation = validatePasswordStrong(value);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`pr-10 ${
            error
              ? "border-red-500 focus:border-red-500"
              : basicValidation.valid
                ? "border-green-500 focus:border-green-500"
                : "border-gray-300"
          } ${className}`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Afficher l'erreur ou le message de validation */}
      {error ? (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      ) : value && basicValidation.valid ? (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          Mot de passe valide
        </div>
      ) : value && !basicValidation.valid ? (
        <div className="flex items-center gap-2 text-amber-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {basicValidation.error}
        </div>
      ) : null}

      {/* Indicateur de force */}
      {showStrengthIndicator && value && (
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">
                Force du mot de passe
              </span>
              <span
                className={`text-xs font-semibold ${
                  getPasswordStrengthLabel(strongValidation.strength).color
                }`}
              >
                {getPasswordStrengthLabel(strongValidation.strength).label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  strongValidation.strength === 0
                    ? "w-0"
                    : strongValidation.strength === 1
                      ? "w-1/5 bg-red-500"
                      : strongValidation.strength === 2
                        ? "w-2/5 bg-orange-500"
                        : strongValidation.strength === 3
                          ? "w-3/5 bg-yellow-500"
                          : strongValidation.strength === 4
                            ? "w-4/5 bg-lime-500"
                            : "w-full bg-green-500"
                }`}
              />
            </div>
          </div>

          {/* Exigences non satisfaites */}
          {strongValidation.errors.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">
                Pour améliorer la force:
              </p>
              <ul className="space-y-1">
                {strongValidation.errors.map((error, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Afficher les exigences */}
      {showRequirements && value && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-blue-900">
            Exigences du mot de passe:
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div
                className={`w-2 h-2 rounded-full ${
                  value.length >= PASSWORD_CONFIG.MIN_LENGTH
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
              <span
                className={
                  value.length >= PASSWORD_CONFIG.MIN_LENGTH
                    ? "text-green-700"
                    : "text-gray-600"
                }
              >
                Au moins {PASSWORD_CONFIG.MIN_LENGTH} caractères
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
