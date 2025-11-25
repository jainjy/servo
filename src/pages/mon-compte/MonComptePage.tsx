import { useEffect, useMemo, useState, useRef } from "react";
import { type User as AuthUser } from "@/types/type";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Building,
  Shield,
  User as UserIcon,
  Calendar,
  MapPin,
  Star,
  Edit3,
  X,
  Check,
  Camera,
  Lock,
  Box,
  Settings,
  Settings2,
  DollarSign,
  FileText,
  Calendar1,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AuthService from "@/services/authService";

export default function MonComptePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<
    { file: File; preview: string } | null
  >(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    bio: "",
    companyName: "",
    commercialName: "",
    siret: "",
    zipCode: "",
    city: "",
    addressComplement: "",
  });

  useEffect(() => {
    const u = AuthService.getCurrentUser();
    setUser(u);
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        bio: user.bio ?? "",
        companyName: user.companyName ?? "",
        commercialName: user.commercialName ?? "",
        siret: user.siret ?? "",
        zipCode: user.zipCode ?? "",
        city: user.city ?? "",
        addressComplement: user.addressComplement ?? "",
      });
    }
  }, [user]);

  const initials = useMemo(() => {
    if (!user) return "US";
    let base = "";
    if (user.firstName && user.firstName.trim()) base = user.firstName.trim();
    else if (user.email) base = user.email.split("@")[0];
    base = base.replace(/[^A-Za-z0-9]/g, "");
    const two = base.slice(0, 2).toUpperCase();
    if (two) return two;
    if (user.lastName) return user.lastName.slice(0, 2).toUpperCase();
    return "US";
  }, [user]);

  const roleLabel =
    user?.role === "admin"
      ? "Administrateur"
      : user?.role === "professional"
        ? "Professionnel"
        : "Utilisateur";

  const roleColor =
    user?.role === "admin"
      ? "bg-purple-600"
      : user?.role === "professional"
        ? "bg-blue-600"
        : "bg-gray-900";

  const createdAt = user?.createdAt ? new Date(user.createdAt) : null;

  const onChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isEditing) return;
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleCancel = () => {
    if (!user) return;
    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      address: user.address ?? "",
      bio: user.bio ?? "",
      companyName: user.companyName ?? "",
      commercialName: user.commercialName ?? "",
      siret: user.siret ?? "",
      zipCode: user.zipCode ?? "",
      city: user.city ?? "",
      addressComplement: user.addressComplement ?? "",
    });
    setIsEditing(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Préparer les données pour l'API
      const updateData = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,
        companyName:
          user.role === "professional"
            ? form.companyName.trim() || undefined
            : undefined,
        commercialName:
          user.role === "professional"
            ? form.commercialName.trim() || undefined
            : undefined,
        siret:
          user.role === "professional"
            ? form.siret.trim() || undefined
            : undefined,
        zipCode: form.zipCode.trim() || undefined,
        city: form.city.trim() || undefined,
        addressComplement: form.addressComplement.trim() || undefined,
      };

      // Appel API pour mettre à jour le profil
      const updatedUser = await AuthService.updateProfile(updateData);

      setUser(updatedUser);
      setIsEditing(false);

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Impossible d'enregistrer les modifications.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Le fichier doit être une image",
      });
      return;
    }

    // Vérifier la taille du fichier (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
      });
      return;
    }

    // Créer une URL temporaire pour la prévisualisation
    const preview = URL.createObjectURL(file);
    setPendingAvatar({ file, preview });
  };

  const handleConfirmAvatar = async () => {
    if (!pendingAvatar || !user) return;

    try {
      setUploadingAvatar(true);
      const uploadResult = await AuthService.uploadAvatar(pendingAvatar.file);
      const updatedUser = await AuthService.updateProfile({
        avatar: uploadResult.url,
      });

      setUser(updatedUser);
      setPendingAvatar(null);

      toast({
        title: "Avatar mis à jour",
        description: "Votre photo de profil a été changée avec succès",
      });

      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de changer l'avatar",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCancelAvatar = () => {
    if (pendingAvatar) {
      URL.revokeObjectURL(pendingAvatar.preview);
      setPendingAvatar(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
      });
      return;
    }

    try {
      setChangingPassword(true);

      await AuthService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Succès",
        description: "Mot de passe modifié avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de changer le mot de passe",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  if (!user) {
    return (
      <main className="min-h-[80vh] pt-28 px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Connexion requise</CardTitle>
              <CardDescription>
                Veuillez vous connecter pour accéder à votre profil.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Button onClick={() => handleNavigation("/login")}>
                Se connecter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNavigation("/register")}
              >
                Créer un compte
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
        {/* Couverture style Facebook */}
        <div className="h-64 relative">
          <div className="absolute flex justify-around inset-0 opacity-50 ">
            <img src="https://i.pinimg.com/1200x/c3/ef/8b/c3ef8ba8a70511021f9b3f0a50a852f7.jpg"
            className="w-64 h-64 overflow-hidden rounded-full"
            alt="" />
            <img src="https://i.pinimg.com/736x/43/b9/1c/43b91c953ebadc481316a2f9230ddf8a.jpg"
            className="w-64 h-64"
            alt="" />
            <img src="https://i.pinimg.com/1200x/c3/ef/8b/c3ef8ba8a70511021f9b3f0a50a852f7.jpg"
            className="w-64 h-64"
            alt="" />
          </div>
        </div>

        {/* Conteneur principal */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto -mt-28 relative z-10">
            {/* Grille 2 colonnes : Gauche (Profil) + Droite (Édition) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* COLONNE GAUCHE - Profil et infos */}
              <div className="lg:col-span-1 space-y-6">
                {/* Section Profil */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* En-tête du profil */}
                  <div className="px-6 py-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        <div className="p-1 bg-purple-400 rounded-full shadow-lg">
                          <Avatar
                            className="w-32 h-32 cursor-pointer border-4 border-white"
                            onClick={handleAvatarClick}
                          >
                            {pendingAvatar ? (
                              <AvatarImage src={pendingAvatar.preview} alt="Prévisualisation" />
                            ) : (
                              user.avatar && (
                                <AvatarImage
                                  src={user.avatar}
                                  alt={`${user.firstName} ${user.lastName}`}
                                />
                              )
                            )}
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-3xl font-semibold">
                              {uploadingAvatar ? (
                                <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                initials
                              )}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        {pendingAvatar ? (
                          <div className="absolute -bottom-2 -right-2 flex gap-2">
                            <button
                              onClick={handleConfirmAvatar}
                              disabled={uploadingAvatar}
                              className="bg-green-500 text-white rounded-full p-2 shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelAvatar}
                              disabled={uploadingAvatar}
                              className="bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={handleAvatarClick}
                            disabled={uploadingAvatar}
                            className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleAvatarChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>

                      {/* Nom et badges */}
                      <h1 className="text-2xl font-bold text-gray-900 text-center">
                        {form.firstName
                          ? `${form.firstName} ${form.lastName ?? ""}`.trim()
                          : user.email}
                      </h1>
                      <Badge className={`${roleColor} text-white text-sm py-1 px-3 mt-2`}>
                        {roleLabel}
                      </Badge>
                    </div>

                    <Separator className="my-4" />

                    {/* Infos principales */}
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Email</p>
                        <p className="text-gray-900 font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          {user.email}
                        </p>
                      </div>
                      {user.phone && (
                        <div>
                          <p className="text-gray-500 mb-1">Téléphone</p>
                          <p className="text-gray-900 font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            {user.phone}
                          </p>
                        </div>
                      )}
                      {user.city && (
                        <div>
                          <p className="text-gray-500 mb-1">Localisation</p>
                          <p className="text-gray-900 font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            {user.city} {user.zipCode && `(${user.zipCode})`}
                          </p>
                        </div>
                      )}
                      {createdAt && (
                        <div>
                          <p className="text-gray-500 mb-1">Inscrit le</p>
                          <p className="text-gray-900 font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            {createdAt.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Raccourcis */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    Raccourcis
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left hover:bg-blue-50 border-gray-200"
                      onClick={() => handleNavigation("/mon-compte/mes-commandes")}
                    >
                      <Box /> Mes commandes
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left hover:bg-blue-50 border-gray-200"
                      onClick={() => handleNavigation("/mon-compte/reservation")}
                    >
                      <Calendar /> Mes réservations
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left hover:bg-blue-50 border-gray-200"
                      onClick={() => handleNavigation("/mon-compte/demandes")}
                    >
                      <Settings2 /> Demandes de services
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left hover:bg-blue-50 border-gray-200"
                      onClick={() => handleNavigation("/mon-compte/demandes-immobilier")}
                    >
                      🏠 Demandes immobilières
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left hover:bg-blue-50 border-gray-200"
                      onClick={() => handleNavigation("/mon-compte/payement")}
                    >
                      <DollarSign /> Mes paiements
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left hover:bg-blue-50 border-gray-200"
                      onClick={() => handleNavigation("/mon-compte/documents")}
                    >
                      <FileText /> Mes documents
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left hover:bg-blue-50 border-gray-200"
                      onClick={() => handleNavigation("/mon-compte/agenda")}
                    >
                      <Calendar1 /> Mon Agenda
                    </Button>
                  </div>
                </div>

                {/* Infos compte */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Compte
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Type</span>
                      <Badge className="bg-blue-600">{roleLabel}</Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Statut</span>
                      <span className="text-green-600 font-semibold">✓ Actif</span>
                    </div>
                    {user.kycStatus && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Vérification</span>
                          <span className="font-semibold capitalize text-orange-600">
                            {user.kycStatus}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* COLONNE DROITE - Formulaires d'édition */}
              <div className="lg:col-span-2 space-y-6">
                {/* En-tête avec boutons action */}
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Edit3 className="w-6 h-6 text-blue-600" />
                    {isEditing ? "Modifier mon profil" : "Mon profil"}
                  </h2>
                  <div className="flex items-center gap-2">
                    {!isEditing ? (
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="w-4 h-4" />
                        Modifier
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </span>
                          ) : (
                            <Check className="w-4 h-4 mr-2" />
                          )}
                          Enregistrer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations personnelles */}
                {isEditing ? (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-blue-600" />
                      Informations personnelles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">Prénom</Label>
                        <Input
                          value={form.firstName}
                          onChange={onChange("firstName")}
                          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">Nom</Label>
                        <Input
                          value={form.lastName}
                          onChange={onChange("lastName")}
                          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">Téléphone</Label>
                        <Input
                          value={form.phone}
                          onChange={onChange("phone")}
                          placeholder="Ex: +33 6 12 34 56 78"
                          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">Ville</Label>
                        <Input
                          value={form.city}
                          onChange={onChange("city")}
                          placeholder="Ex: Paris"
                          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">Code postal</Label>
                        <Input
                          value={form.zipCode}
                          onChange={onChange("zipCode")}
                          placeholder="Ex: 75001"
                          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">Complément d'adresse</Label>
                        <Input
                          value={form.addressComplement}
                          onChange={onChange("addressComplement")}
                          placeholder="Apt, Suite..."
                          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-gray-700 font-semibold">Adresse</Label>
                        <Input
                          value={form.address}
                          onChange={onChange("address")}
                          placeholder="Rue..."
                          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-gray-700 font-semibold">Bio / Descriptif</Label>
                        <Input
                          value={form.bio}
                          onChange={onChange("bio")}
                          placeholder="Dites-nous quelque chose sur vous..."
                          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Informations professionnelles */}
                {user.role === "professional" && isEditing && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      Informations professionnelles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-gray-700 font-semibold">Nom de l'entreprise</Label>
                        <Input
                          value={form.companyName}
                          onChange={onChange("companyName")}
                          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">Nom commercial</Label>
                        <Input
                          value={form.commercialName}
                          onChange={onChange("commercialName")}
                          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">SIRET</Label>
                        <Input
                          value={form.siret}
                          onChange={onChange("siret")}
                          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sécurité et mot de passe */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    Sécurité et mot de passe
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Changez votre mot de passe régulièrement pour sécuriser votre compte.
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-semibold">Mot de passe actuel</Label>
                      <Input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        placeholder="••••••••"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-semibold">Nouveau mot de passe</Label>
                      <Input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder="••••••••"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-semibold">Confirmer le mot de passe</Label>
                      <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="••••••••"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handlePasswordChange}
                        disabled={
                          changingPassword ||
                          !passwordData.currentPassword ||
                          !passwordData.newPassword
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {changingPassword ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Mise à jour...
                          </span>
                        ) : (
                          "Mettre à jour le mot de passe"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
