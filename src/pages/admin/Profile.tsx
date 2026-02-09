import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Shield,
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  Check,
  Trash2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import UserService from "@/services/userService";
import { toast } from "sonner";
import { LocationPickerModal } from "@/components/location-picker-modal";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { MiniProfileCompletion } from "@/components/MiniProfileCompletion";

interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: string;
  avatar: string | null;
  status: string;
  companyName: string | null;
  demandType: string | null;
  address: string | null;
  zipCode: string | null;
  city: string | null;
  addressComplement: string | null;
  commercialName: string | null;
  siret: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  metiers: Array<{
    metier: {
      id: number;
      libelle: string;
    };
  }>;
  services: Array<{
    service: {
      id: number;
      libelle: string;
    };
  }>;
}

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // États pour la modale de changement de mot de passe
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    maxLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    zipCode: "",
    city: "",
    addressComplement: "",
    commercialName: "",
    siret: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Utiliser le hook de complétion
  const { completion, refresh: refreshCompletion } = useProfileCompletion(user);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await UserService.getProfile();
      setUser(userData);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        companyName: userData.companyName || "",
        address: userData.address || "",
        zipCode: userData.zipCode || "",
        city: userData.city || "",
        addressComplement: userData.addressComplement || "",
        commercialName: userData.commercialName || "",
        siret: userData.siret || "",
        latitude: userData.latitude,
        longitude: userData.longitude,
      });
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      toast.error("Erreur lors du chargement du profil");
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Filtrer seulement les champs qui peuvent être modifiés
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        companyName: formData.companyName,
        address: formData.address,
        zipCode: formData.zipCode,
        city: formData.city,
        addressComplement: formData.addressComplement,
        commercialName: formData.commercialName,
        siret: formData.siret,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      await UserService.updateProfile(updateData);
      await fetchUserProfile(); // Recharger les données
      setIsEditing(false);
      
      // Rafraîchir la complétion
      refreshCompletion();
      
      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        companyName: user.companyName || "",
        address: user.address || "",
        zipCode: user.zipCode || "",
        city: user.city || "",
        addressComplement: user.addressComplement || "",
        commercialName: user.commercialName || "",
        siret: user.siret || "",
        latitude: user.latitude,
        longitude: user.longitude,
      });
    }
    setIsEditing(false);
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return;
    }

    // Créer une URL temporaire pour la prévisualisation
    const preview = URL.createObjectURL(file);
    setPendingAvatar({ file, preview });
  };

  // Nouvelle fonction pour confirmer l'upload
  const handleConfirmAvatar = async () => {
    if (!pendingAvatar || !user) return;

    setIsUploading(true);
    try {
      const response = await UserService.uploadAvatar(pendingAvatar.file);
      await UserService.updateProfile({ avatar: response.url });
      await fetchUserProfile(); // Recharger les données

      // Nettoyer l'URL temporaire
      URL.revokeObjectURL(pendingAvatar.preview);
      setPendingAvatar(null);

      // Rafraîchir la complétion
      refreshCompletion();
      
      toast.success("Avatar mis à jour avec succès");
    } catch (error: any) {
      console.error("Erreur lors de l'upload:", error);
      toast.error(error.message || "Erreur lors de l'upload de l'avatar");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Fonction pour annuler l'upload
  const handleCancelAvatar = () => {
    if (pendingAvatar) {
      URL.revokeObjectURL(pendingAvatar.preview);
      setPendingAvatar(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  // Fonctions pour la modale de changement de mot de passe
  const handlePasswordChange = () => {
    setIsPasswordModalOpen(true);
  };

  // Fonction de validation des mots de passe
  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      maxLength: password.length <= 12,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/]/.test(password),
    };
  };

  const isPasswordValid = (password: string) => {
    const validation = validatePassword(password);
    return Object.values(validation).every((v) => v === true);
  };

  const PasswordRequirement = ({
    met,
    text,
  }: {
    met: boolean;
    text: string;
  }) => (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`w-3 h-3 rounded-full ${
          met ? "bg-green-500" : "bg-gray-300"
        }`}
      />
      <span className={met ? "text-green-600" : "text-gray-600"}>{text}</span>
    </div>
  );

  const handlePasswordSubmit = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (!isPasswordValid(passwordData.newPassword)) {
      toast.error(
        "Le mot de passe ne respecte pas les conditions requises (8-12 caractères, majuscule, minuscule, chiffre et caractère spécial)"
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    setIsChangingPassword(true);
    try {
      await UserService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      toast.success("Mot de passe modifié avec succès");
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordValidation({
        minLength: false,
        maxLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
    } catch (error: any) {
      console.error("Erreur lors du changement de mot de passe:", error);
      toast.error(error.message || "Erreur lors du changement de mot de passe");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "superadmin":
        return "destructive";
      case "admin":
        return "default";
      case "professional":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "superadmin":
        return <Shield className="h-4 w-4" />;
      case "admin":
        return <Building className="h-4 w-4" />;
      case "professional":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Fonction pour vérifier si un champ est complété
  const isFieldComplete = (value: any, minLength = 1): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length >= minLength;
    return true;
  };

  // Fonction pour obtenir le badge d'état d'un champ
  const getFieldStatusBadge = (value: any, minLength = 1) => {
    const isComplete = isFieldComplete(value, minLength);
    return isComplete ? (
      <Badge variant="outline" className="text-xs text-green-600 border-green-300">
        <CheckCircle className="w-3 h-3 mr-1" />
        Complété
      </Badge>
    ) : (
      <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
        <AlertCircle className="w-3 h-3 mr-1" />
        À compléter
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="text-center flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl">
        <img src="/loading.gif" alt="" className='w-24 h-24'/>
        <p className="mt-4 text-xl font-semibold text-gray-700">
          Chargement du profil...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec barre de progression */}
      <div className="flex justify-between flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Profil Utilisateur
          </h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et paramètres de compte
          </p>
        </div>
        
        {/* Barre de progression mini */}
        <div className="w-full md:w-auto">
          {completion && (
            <MiniProfileCompletion 
              percentage={completion.percentage} 
              showLabel={true}
            />
          )}
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2 mt-4 md:mt-0">
            <Edit2 className="h-4 w-4" />
            Modifier le profil
          </Button>
        ) : (
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleCancel} className="gap-2">
              <X className="h-4 w-4" />
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        )}
      </div>

      {/* Section de progression détaillée */}
      {completion && (
        <Card className="border-blue-100 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Progression de votre profil
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-blue-700">
                    {completion.percentage}%
                  </div>
                  <Badge className={
                    completion.percentage >= 80 ? "bg-green-100 text-green-800" :
                    completion.percentage >= 60 ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }>
                    {completion.label}
                  </Badge>
                </div>
                <div className="mt-2">
                  <Progress 
                    value={completion.percentage} 
                    className="h-2"
                  />
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  {completion.completed}/{completion.total} points complétés
                </p>
              </div>
              
              {/* Recommandations rapides */}
              {completion.recommendations.length > 0 && completion.percentage < 100 && (
                <div className="md:w-1/2">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Recommandations
                  </h4>
                  <ul className="space-y-1">
                    {completion.recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto lg:grid-cols-3">
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="professional">
            Informations professionnelles
          </TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Carte Photo de profil */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photo de profil
                </CardTitle>
                <CardDescription>
                  {getFieldStatusBadge(user.avatar)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar
                      className="h-32 w-32 cursor-pointer border-2 border-gray-200"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {pendingAvatar ? (
                        <AvatarImage
                          src={pendingAvatar.preview}
                          alt="Prévisualisation"
                        />
                      ) : (
                        user.avatar && (
                          <AvatarImage
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                        )
                      )}
                      <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* Boutons de confirmation/annulation */}
                    {pendingAvatar ? (
                      <div className="absolute -bottom-2 -right-2 flex gap-1">
                        <button
                          onClick={handleConfirmAvatar}
                          disabled={isUploading}
                          className="bg-green-500 text-white rounded-full p-2 shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelAvatar}
                          disabled={isUploading}
                          className="bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute -bottom-2 -right-2 bg-white text-gray-900 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 border"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploading}
                  />

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {isUploading
                        ? "Upload en cours..."
                        : "Cliquez sur l'avatar pour changer"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, max 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carte Informations personnelles */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Ces informations sont visibles par les autres utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Prénom</label>
                      {!isEditing && getFieldStatusBadge(formData.firstName)}
                    </div>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Votre prénom"
                      className={isFieldComplete(formData.firstName) ? "border-green-300" : "border-amber-300"}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Nom</label>
                      {!isEditing && getFieldStatusBadge(formData.lastName)}
                    </div>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Votre nom"
                      className={isFieldComplete(formData.lastName) ? "border-green-300" : "border-amber-300"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    {!isEditing && getFieldStatusBadge(formData.email)}
                  </div>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={true} // Email non modifiable
                    placeholder="votre@email.com"
                    className="bg-muted border-green-300"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </label>
                    {!isEditing && getFieldStatusBadge(formData.phone, 5)}
                  </div>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    placeholder="+261 34 12 345 67"
                    className={isFieldComplete(formData.phone, 5) ? "border-green-300" : "border-amber-300"}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Code postal</label>
                      {!isEditing && getFieldStatusBadge(formData.zipCode)}
                    </div>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Code postal"
                      className={isFieldComplete(formData.zipCode) ? "border-green-300" : "border-amber-300"}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Ville</label>
                      {!isEditing && getFieldStatusBadge(formData.city)}
                    </div>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Ville"
                      className={isFieldComplete(formData.city) ? "border-green-300" : "border-amber-300"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Adresse
                    </label>
                    {!isEditing && getFieldStatusBadge(formData.address)}
                  </div>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Votre adresse complète"
                    className={isFieldComplete(formData.address) ? "border-green-300" : "border-amber-300"}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Complément d'adresse
                    </label>
                    {!isEditing && getFieldStatusBadge(formData.addressComplement)}
                  </div>
                  <Input
                    value={formData.addressComplement}
                    onChange={(e) =>
                      handleInputChange("addressComplement", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Appartement, étage, etc."
                    className={isFieldComplete(formData.addressComplement) ? "border-green-300" : "border-gray-300"}
                  />
                </div>

                {/* Nouvelles coordonnées GPS */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Coordonnées GPS
                    </h4>
                    {!isEditing ? (
                      getFieldStatusBadge(formData.latitude)
                    ) : (
                      <div className="flex items-center gap-2">
                        {getFieldStatusBadge(formData.latitude)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsLocationModalOpen(true)}
                          className="gap-2"
                        >
                          <MapPin className="h-3 w-3" />
                          Sur la carte
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Latitude</label>
                      <Input
                        type="number"
                        step="0.000001"
                        value={formData.latitude || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "latitude",
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        disabled={!isEditing}
                        placeholder="Ex: -20.8789"
                        className={isFieldComplete(formData.latitude) ? "border-green-300" : "border-amber-300"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Longitude</label>
                      <Input
                        type="number"
                        step="0.000001"
                        value={formData.longitude || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "longitude",
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        disabled={!isEditing}
                        placeholder="Ex: 55.4481"
                        className={isFieldComplete(formData.longitude) ? "border-green-300" : "border-amber-300"}
                      />
                    </div>
                  </div>

                  {formData.latitude && formData.longitude && (
                    <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700 border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Position définie : {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Informations professionnelles
                </CardTitle>
                {completion && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={
                      completion.percentage >= 80 ? "text-green-600 border-green-300" :
                      completion.percentage >= 60 ? "text-yellow-600 border-yellow-300" :
                      "text-red-600 border-red-300"
                    }>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {completion.percentage}%
                    </Badge>
                  </div>
                )}
              </div>
              <CardDescription>
                {user.role === "professional" 
                  ? "Informations pour votre activité professionnelle" 
                  : "Informations sur votre rôle"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                    {getRoleIcon(user.role)}
                    <div>
                      <p className="font-medium">Rôle</p>
                      <Badge
                        variant={getRoleBadgeVariant(user.role)}
                        className="mt-1 capitalize"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Nom de l'entreprise
                      </label>
                      {!isEditing && getFieldStatusBadge(formData.companyName || formData.commercialName)}
                    </div>
                    <Input
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Nom de votre société"
                      className={isFieldComplete(formData.companyName) ? "border-green-300" : "border-amber-300"}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Nom commercial
                      </label>
                      {!isEditing && getFieldStatusBadge(formData.commercialName)}
                    </div>
                    <Input
                      value={formData.commercialName}
                      onChange={(e) =>
                        handleInputChange("commercialName", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Nom commercial"
                      className={isFieldComplete(formData.commercialName) ? "border-green-300" : "border-gray-300"}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p className="font-medium">Membre depuis</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">SIRET</label>
                      {!isEditing && getFieldStatusBadge(formData.siret)}
                    </div>
                    <Input
                      value={formData.siret}
                      onChange={(e) =>
                        handleInputChange("siret", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Numéro SIRET"
                      className={isFieldComplete(formData.siret) ? "border-green-300" : "border-amber-300"}
                    />
                  </div>

                  {user.demandType && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Type de demande
                      </label>
                      <div className="p-2 border rounded-md bg-muted">
                        <Badge variant="outline" className="capitalize">
                          {user.demandType}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Métiers et services pour les professionnels */}
              {user.role === "professional" && (
                <div className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Métiers
                        </h4>
                        {!isEditing && getFieldStatusBadge(user.metiers && user.metiers.length > 0 ? true : false)}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.metiers.length > 0 ? (
                          user.metiers.map(({ metier }) => (
                            <Badge key={metier.id} variant="secondary" className="bg-blue-100 text-blue-800">
                              {metier.libelle}
                            </Badge>
                          ))
                        ) : (
                          <div className="p-3 border border-amber-200 rounded bg-amber-50">
                            <p className="text-sm text-amber-700">
                              Aucun métier associé. Ajoutez votre métier principal.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Services
                        </h4>
                        {!isEditing && getFieldStatusBadge(user.services && user.services.length >= 3 ? true : false)}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.services.length > 0 ? (
                          user.services.map(({ service }) => (
                            <Badge key={service.id} variant="outline" className="border-green-300 text-green-700">
                              {service.libelle}
                            </Badge>
                          ))
                        ) : (
                          <div className="p-3 border border-amber-200 rounded bg-amber-50">
                            <p className="text-sm text-amber-700">
                              Aucun service associé. Ajoutez au moins 3 services.
                            </p>
                          </div>
                        )}
                      </div>
                      {user.services.length > 0 && user.services.length < 3 && (
                        <div className="mt-2 p-2 bg-amber-50 rounded text-xs text-amber-700 border border-amber-200">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" />
                            Ajoutez {3 - user.services.length} service(s) pour optimiser votre profil
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {user.status === "inactive" && (
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Statut professionnel
                      </h4>
                      <p className="text-sm text-blue-700">
                        Votre profil professionnel est en attente de
                        vérification. Une fois approuvé, vous pourrez publier
                        des annonces et offrir vos services.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Mot de passe
                </CardTitle>
                <CardDescription>
                  Modifiez votre mot de passe régulièrement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handlePasswordChange}
                >
                  Changer le mot de passe
                </Button>
                <div className="text-sm text-muted-foreground">
                  <p>• Dernière modification : À déterminer</p>
                  <p>
                    • Force : <span className="text-green-600">Fort</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Nouvelle section - Suppression de compte */}
            {user.role === "professional" && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    Zone de danger
                  </CardTitle>
                  <CardDescription>
                    Actions irréversibles concernant votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg bg-white">
                    <h4 className="font-medium text-red-900 mb-2">
                      Supprimer votre compte
                    </h4>
                    <p className="text-sm text-red-700 mb-4">
                      La suppression de votre compte est permanente et irréversible. Toutes vos données, annonces et informations seront supprimées.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => navigate("/pro/delete-account")}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer mon compte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modale de changement de mot de passe */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Changer le mot de passe
            </DialogTitle>
            <DialogDescription>
              Entrez votre mot de passe actuel et votre nouveau mot de passe.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Votre mot de passe actuel"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    const newPass = e.target.value;
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: newPass,
                    }));
                    setPasswordValidation(validatePassword(newPass));
                  }}
                  placeholder="Votre nouveau mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg space-y-2 mt-2">
                <p className="text-xs font-medium text-gray-700">
                  Critères du mot de passe :
                </p>
                <PasswordRequirement
                  met={passwordValidation.minLength}
                  text="Au moins 8 caractères"
                />
                <PasswordRequirement
                  met={passwordValidation.maxLength}
                  text="Maximum 12 caractères"
                />
                <PasswordRequirement
                  met={passwordValidation.hasUpperCase}
                  text="Au moins une majuscule (A-Z)"
                />
                <PasswordRequirement
                  met={passwordValidation.hasLowerCase}
                  text="Au moins une minuscule (a-z)"
                />
                <PasswordRequirement
                  met={passwordValidation.hasNumber}
                  text="Au moins un chiffre (0-9)"
                />
                <PasswordRequirement
                  met={passwordValidation.hasSpecialChar}
                  text="Au moins un caractère spécial (!@#$%^&*...)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirmer le nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handlePasswordCancel}
              disabled={isChangingPassword}
            >
              Annuler
            </Button>
            <Button
              onClick={handlePasswordSubmit}
              disabled={isChangingPassword || !isPasswordValid(passwordData.newPassword)}
              className="gap-2"
            >
              {isChangingPassword ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Modification...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Modifier le mot de passe
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LocationPicker Modal */}
      <LocationPickerModal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
        latitude={formData.latitude}
        longitude={formData.longitude}
        onLocationChange={handleLocationChange}
      />
    </div>
  );
};

export default ProfilePage;