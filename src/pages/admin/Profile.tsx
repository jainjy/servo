import React, { useState, useEffect, useRef } from "react";

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
import { useAuth } from "@/hooks/useAuth";
import UserService from "@/services/userService";
import { toast } from "sonner";
import {LocationPickerModal} from "@/components/location-picker-modal";
import { useNavigate } from "react-router-dom";

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

  const handlePasswordSubmit = async () => {
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
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
      <div className="flex justify-between flex-col md:flex-row items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Profil Utilisateur
          </h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et paramètres de compte
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="h-4 w-4" />
            Modifier le profil
          </Button>
        ) : (
          <div className="flex gap-2">
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar
                      className="h-32 w-32 cursor-pointer"
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
                    <label className="text-sm font-medium">Prénom</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={true} // Email non modifiable
                    placeholder="votre@email.com"
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    placeholder="+261 34 12 345 67"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Code postal</label>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Code postal"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ville</label>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Ville"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Votre adresse complète"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Complément d'adresse
                  </label>
                  <Input
                    value={formData.addressComplement}
                    onChange={(e) =>
                      handleInputChange("addressComplement", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Appartement, étage, etc."
                  />
                </div>

                {/* Nouvelles coordonnées GPS */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Coordonnées GPS
                    </h4>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLocationModalOpen(true)}
                        className="gap-2"
                      >
                        <MapPin className="h-3 w-3" />
                        Sur la carte
                      </Button>
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
                      />
                    </div>
                  </div>

                  {formData.latitude && formData.longitude && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700 border border-blue-200">
                      Position : {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
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
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Informations professionnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
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
                    <label className="text-sm font-medium">
                      Nom de l'entreprise
                    </label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Nom de votre société"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nom commercial
                    </label>
                    <Input
                      value={formData.commercialName}
                      onChange={(e) =>
                        handleInputChange("commercialName", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Nom commercial"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
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
                    <label className="text-sm font-medium">SIRET</label>
                    <Input
                      value={formData.siret}
                      onChange={(e) =>
                        handleInputChange("siret", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Numéro SIRET"
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
                      <h4 className="font-medium mb-2">Métiers</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.metiers.length > 0 ? (
                          user.metiers.map(({ metier }) => (
                            <Badge key={metier.id} variant="secondary">
                              {metier.libelle}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Aucun métier associé
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.services.length > 0 ? (
                          user.services.map(({ service }) => (
                            <Badge key={service.id} variant="outline">
                              {service.libelle}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Aucun service associé
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {user.status === "inactive" && (
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-medium text-blue-900 mb-2">
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
            {user.role=="professional"&&<Card className="border-red-200 bg-red-50">
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
            </Card>}
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
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
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
              disabled={isChangingPassword}
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
