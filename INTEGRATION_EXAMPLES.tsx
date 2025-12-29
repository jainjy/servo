/**
 * EXEMPLE D'INTÉGRATION - Validation des Mots de Passe
 * 
 * Ce fichier montre comment intégrer la validation dans les pages d'authentification
 */

// ============================================================================
// EXEMPLE 1: SignupPage avec PasswordInput
// ============================================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./src/components/ui/button";
import { Input } from "./src/components/ui/input";
import { PasswordInput } from "./src/components/PasswordInput";
import { validatePassword, passwordsMatch } from "./src/utils/passwordValidator";
import AuthService from "./src/services/authService";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignupPageExample = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Valider prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    // Valider nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    // Valider email
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Email invalide";
    }

    // Valider mot de passe avec utilitaire
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.error || "Mot de passe invalide";
    }

    // Valider confirmation
    if (
      formData.password &&
      formData.confirmPassword &&
      !passwordsMatch(formData.password, formData.confirmPassword)
    ) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof SignupFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await AuthService.register({
        ...formData,
        userType: "user",
      });

      toast.success("Inscription réussie !");
      navigate(result.route || "/");
    } catch (error: any) {
      // L'erreur peut venir du backend si la validation serveur échoue
      toast.error(
        error.message || "Erreur lors de l'inscription"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Inscription</h1>

      {/* Prénom */}
      <div>
        <label className="block text-sm font-medium mb-1">Prénom</label>
        <Input
          type="text"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          placeholder="Jean"
          disabled={isSubmitting}
        />
        {errors.firstName && (
          <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
        )}
      </div>

      {/* Nom */}
      <div>
        <label className="block text-sm font-medium mb-1">Nom</label>
        <Input
          type="text"
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          placeholder="Dupont"
          disabled={isSubmitting}
        />
        {errors.lastName && (
          <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="jean@example.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Mot de passe - Utilisation du composant PasswordInput */}
      <PasswordInput
        label="Mot de passe"
        placeholder="Entrez un mot de passe sécurisé"
        value={formData.password}
        onChange={(value) => handleInputChange("password", value)}
        error={errors.password}
        showStrengthIndicator={true}
        showRequirements={true}
        required={true}
        disabled={isSubmitting}
      />

      {/* Confirmation du mot de passe */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Confirmer le mot de passe
        </label>
        <Input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          placeholder="Confirmez votre mot de passe"
          disabled={isSubmitting}
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm mt-1">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Bouton soumettre */}
      <Button
        type="submit"
        disabled={isSubmitting || !formData.password}
        className="w-full"
      >
        {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
};

// ============================================================================
// EXEMPLE 2: Formulaire de Changement de Mot de Passe
// ============================================================================

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordFormExample = () => {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Vérifier ancien mot de passe
    if (!formData.currentPassword) {
      newErrors.currentPassword = "L'ancien mot de passe est requis";
    }

    // Valider nouveau mot de passe
    const newPasswordValidation = validatePassword(formData.newPassword);
    if (!newPasswordValidation.valid) {
      newErrors.newPassword = newPasswordValidation.error || "Mot de passe invalide";
    }

    // Vérifier confirmation
    if (
      formData.newPassword &&
      formData.confirmPassword &&
      !passwordsMatch(formData.newPassword, formData.confirmPassword)
    ) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    try {
      setIsSubmitting(true);
      await AuthService.changePassword(
        formData.currentPassword,
        formData.newPassword
      );

      toast.success("Mot de passe changé avec succès !");
      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirection après 2 secondes
      setTimeout(() => setSuccess(false), 2000);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du changement de mot de passe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Changer le mot de passe</h1>

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded">
          ✅ Mot de passe changé avec succès !
        </div>
      )}

      {/* Ancien mot de passe */}
      <PasswordInput
        label="Mot de passe actuel"
        value={formData.currentPassword}
        onChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            currentPassword: value,
          }))
        }
        error={errors.currentPassword}
        required={true}
        disabled={isSubmitting}
      />

      {/* Nouveau mot de passe */}
      <PasswordInput
        label="Nouveau mot de passe"
        value={formData.newPassword}
        onChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            newPassword: value,
          }))
        }
        error={errors.newPassword}
        showStrengthIndicator={true}
        required={true}
        disabled={isSubmitting}
      />

      {/* Confirmation */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Confirmer le nouveau mot de passe
        </label>
        <Input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          placeholder="Confirmez le nouveau mot de passe"
          disabled={isSubmitting}
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm mt-1">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={
          isSubmitting || !formData.newPassword || !formData.currentPassword
        }
        className="w-full"
      >
        {isSubmitting ? "Mise à jour..." : "Changer le mot de passe"}
      </Button>
    </form>
  );
};

// ============================================================================
// EXEMPLE 3: Validation Simple (Sans Composant)
// ============================================================================

export const SimplePasswordValidationExample = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (value: string) => {
    setPassword(value);

    // Validation en temps réel
    const validation = validatePassword(value);
    if (!validation.valid) {
      setError(validation.error || "");
    } else {
      setError("");
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="password"
        value={password}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Entrez votre mot de passe"
        className={`w-full p-2 border rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

// ============================================================================
// EXEMPLE 4: Validation Renforcée (Optionnel)
// ============================================================================

import { validatePasswordStrong } from "./src/utils/passwordValidator";

export const StrongPasswordValidationExample = () => {
  const [password, setPassword] = useState("");
  const validation = validatePasswordStrong(password);

  return (
    <div className="space-y-3">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Entrez un mot de passe fort"
        className="w-full p-2 border border-gray-300 rounded"
      />

      {password && (
        <div className="space-y-2">
          {/* Indicateur de force */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Force:</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full transition-all ${
                  validation.strength === 0
                    ? "w-0"
                    : validation.strength === 1
                      ? "w-1/5 bg-red-500"
                      : validation.strength === 2
                        ? "w-2/5 bg-orange-500"
                        : validation.strength === 3
                          ? "w-3/5 bg-yellow-500"
                          : validation.strength === 4
                            ? "w-4/5 bg-lime-500"
                            : "w-full bg-green-500"
                }`}
              />
            </div>
            <span className="text-sm">
              {validation.strength}/5
            </span>
          </div>

          {/* Erreurs */}
          {validation.errors.length > 0 && (
            <div className="text-sm text-red-600">
              <p className="font-medium mb-1">Améliorations suggérées:</p>
              <ul className="list-disc list-inside space-y-1">
                {validation.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {validation.valid && (
            <p className="text-sm text-green-600">✅ Mot de passe valide!</p>
          )}
        </div>
      )}
    </div>
  );
};
