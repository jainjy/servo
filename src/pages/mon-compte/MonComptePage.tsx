import { useEffect, useMemo, useState } from "react";
import { AuthService, type User as AuthUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Building, Shield, User as UserIcon, Calendar, MapPin, Star, Edit3, X, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import { toast } from "@/hooks/use-toast";
import Footer from "@/components/layout/Footer";

export default function MonComptePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    bio: "",
    companyName: "",
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

  const roleLabel = user?.role === "admin" 
    ? "Administrateur" 
    : user?.role === "professional" 
    ? "Professionnel" 
    : "Utilisateur";
  
  const roleColor = user?.role === "admin" 
    ? "bg-purple-600" 
    : user?.role === "professional" 
    ? "bg-blue-600" 
    : "bg-gray-900";
  
  const createdAt = user?.createdAt ? new Date(user.createdAt) : null;

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      const token = AuthService.getToken() || "";
      const updated: AuthUser = {
        ...user,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,
        bio: form.bio.trim() || undefined,
        companyName: user.role === "professional" ? (form.companyName.trim() || undefined) : user.companyName,
      };
      AuthService.setAuthData(updated, token);
      setUser(updated);
      setIsEditing(false);
      toast({ 
        title: "Profil mis à jour", 
        description: "Vos informations ont été enregistrées." 
      });
    } catch (e) {
      toast({ 
        title: "Erreur", 
        description: "Impossible d'enregistrer les modifications." 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNavigation = (path: string) => {
    // Navigation simple avec window.location
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
              <Button variant="outline" onClick={() => handleNavigation("/register")}>
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
        {/* Header global */}
     

        {/* Header profil */}
        <section className="px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-black via-gray-400 to-blue-500 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,white/10,transparent_40%),radial-gradient(circle_at_80%_0%,white/5,transparent_35%)]" />
              <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="shrink-0">
                    <div className="p-1 bg-white/20 rounded-full">
                      <Avatar className="w-20 h-20 md:w-24 md:h-24">
                        <AvatarFallback className="bg-white/20 text-white text-xl font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl md:text-3xl font-bold">
                        {form.firstName ? `${form.firstName} ${form.lastName ?? ""}`.trim() : user.email}
                      </h1>
                      <Badge className={`${roleColor} text-white border-white/20`}>
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
                    <div className="space-y-2">
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
                    <div className="space-y-2 md:col-span-2">
                      <Label>Bio</Label>
                      <Input 
                        value={form.bio} 
                        onChange={onChange("bio")} 
                        readOnly={!isEditing} 
                        className={!isEditing ? "bg-muted/30" : ""} 
                      />
                    </div>

                    {user.role === "professional" && (
                      <div className="space-y-2 md:col-span-2">
                        <Label>Entreprise</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            value={form.companyName} 
                            onChange={onChange("companyName")} 
                            readOnly={!isEditing} 
                            className={`pl-9 ${!isEditing ? "bg-muted/30" : ""}`} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" /> 
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
                        value="********" 
                        readOnly 
                        className="bg-muted/30" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nouveau mot de passe</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirmer</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        disabled 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button disabled>Mise à jour</Button>
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
                    Mes demandes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => handleNavigation("/mon-compte/payement")}
                  >
                    Mes payements
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" /> 
                    Compte
                  </CardTitle>
                  <CardDescription>
                    Informations générales.
                  </CardDescription>
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
                        <span className="font-medium capitalize">{user.kycStatus}</span>
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