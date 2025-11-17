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
      <main className="min-h-screen pt-24 pb-16">
        {/* Header profil */}
        <section className="px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-black via-gray-400 to-blue-500 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,white/10,transparent_40%),radial-gradient(circle_at_80%_0%,white/5,transparent_35%)]" />
              <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="shrink-0 relative">
                    <div className="p-1 bg-white/20 rounded-full">
                      <Avatar
                        className="w-20 h-20 md:w-24 md:h-24 cursor-pointer"
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
                        <AvatarFallback className="bg-white/20 text-white text-xl font-semibold">
                          {uploadingAvatar ? (
                            <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            initials
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {pendingAvatar ? (
                      <div className="absolute -bottom-2 -right-2 flex gap-1">
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
                        className="absolute -bottom-2 -right-2 bg-white text-gray-900 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
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
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl md:text-3xl font-bold">
                        {form.firstName
                          ? `${form.firstName} ${form.lastName ?? ""}`.trim()
                          : user.email}
                      </h1>
                      <Badge
                        className={`${roleColor} text-white border-white/20`}
                      >
                        {roleLabel}
                      </Badge>
                    </div>
                    <p className="text-white/80 text-sm md:text-base flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                      {form.phone && (
                        <span className="inline-flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {form.phone}
                        </span>
                      )}
                      {user.role === "professional" && form.companyName && (
                        <span className="inline-flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          {form.companyName}
                        </span>
                      )}
                      {createdAt && (
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Inscrit le {createdAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                          onClick={handleCancel}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                        <Button
                          className="bg-white text-gray-900 hover:bg-white/90"
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                              Enregistrement...
                            </span>
                          ) : (
                            <span className="inline-flex items-center">
                              <Check className="w-4 h-4 mr-2" />
                              Enregistrer
                            </span>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu */}
        <section className="px-6 mt-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Informations personnelles
                  </CardTitle>
                  <CardDescription>
                    Vos informations de base et de contact.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prénom</Label>
                      <Input
                        value={form.firstName}
                        onChange={onChange("firstName")}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted/30" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input
                        value={form.lastName}
                        onChange={onChange("lastName")}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted/30" : ""}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={user.email}
                          readOnly
                          className="pl-9 bg-muted/30"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={form.phone}
                          onChange={onChange("phone")}
                          readOnly={!isEditing}
                          className={`pl-9 ${!isEditing ? "bg-muted/30" : ""}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Adresse</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={form.address}
                          onChange={onChange("address")}
                          readOnly={!isEditing}
                          className={`pl-9 ${!isEditing ? "bg-muted/30" : ""}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Code postal</Label>
                      <Input
                        value={form.zipCode}
                        onChange={onChange("zipCode")}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted/30" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ville</Label>
                      <Input
                        value={form.city}
                        onChange={onChange("city")}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted/30" : ""}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Complément d'adresse</Label>
                      <Input
                        value={form.addressComplement}
                        onChange={onChange("addressComplement")}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted/30" : ""}
                      />
                    </div>

                    {user.role === "professional" && (
                      <>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Nom de l'entreprise</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              value={form.companyName}
                              onChange={onChange("companyName")}
                              readOnly={!isEditing}
                              className={`pl-9 ${
                                !isEditing ? "bg-muted/30" : ""
                              }`}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Nom commercial</Label>
                          <Input
                            value={form.commercialName}
                            onChange={onChange("commercialName")}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-muted/30" : ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SIRET</Label>
                          <Input
                            value={form.siret}
                            onChange={onChange("siret")}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-muted/30" : ""}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Sécurité
                  </CardTitle>
                  <CardDescription>
                    Gérez vos paramètres de sécurité.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-1">
                      <Label>Mot de passe actuel</Label>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nouveau mot de passe</Label>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirmer</Label>
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
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={handlePasswordChange}
                      disabled={
                        changingPassword ||
                        !passwordData.currentPassword ||
                        !passwordData.newPassword
                      }
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
                </CardContent>
              </Card>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Raccourcis
                  </CardTitle>
                  <CardDescription>
                    Accédez rapidement à vos espaces.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleNavigation("/mon-compte/reservation")}
                  >
                    Mes réservations
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleNavigation("/mon-compte/demandes")}
                  >
                    Mes demandes de services
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleNavigation("/mon-compte/payement")}
                  >
                    Mes payements
                  </Button>
                  {/* Ajout des liens manquants */}
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleNavigation("/mon-compte/mes-commandes")}
                  >
                    Mes commandes
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleNavigation("/mon-compte/demandes-immobilier")}
                  >
                    Mes demandes immobilières
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleNavigation("/mon-compte/agenda")}
                  >
                    Mon Agenda
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Compte
                  </CardTitle>
                  <CardDescription>Informations générales.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Type de compte</span>
                    <Badge variant="outline">{roleLabel}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span>Statut</span>
                    <span className="text-green-600 font-medium">Actif</span>
                  </div>
                  {user.kycStatus && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span>Vérification</span>
                        <span className="font-medium capitalize">
                          {user.kycStatus}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
