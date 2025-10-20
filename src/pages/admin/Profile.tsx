import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Building, MapPin, Calendar, Edit2, Save, X, Camera, Shield, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthService, User as UserType } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    bio: ""
  });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        companyName: currentUser.companyName || "",
        address: "",
        bio: "Spécialiste en gestion immobilière et services."
      });
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    // Simuler une sauvegarde asynchrone, remplacer par appel API réel
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleCancel = () => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        companyName: currentUser.companyName || "",
        address: "",
        bio: "Spécialiste en gestion immobilière et services."
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'superadmin': return 'destructive';
      case 'admin': return 'default';
      case 'professional': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return <Shield className="h-4 w-4" />;
      case 'admin': return <Building className="h-4 w-4" />;
      case 'professional': return <Briefcase className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Utilisateur</h1>
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
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="professional">Informations professionnelles</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
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
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Changer la photo
                  </Button>
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
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="+261 34 12 345 67"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Votre adresse complète"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Décrivez-vous en quelques mots..."
                    className="w-full min-h-[100px] p-3 border rounded-md resize-none disabled:bg-muted"
                  />
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
                      <Badge variant={getRoleBadgeVariant(user.role)} className="mt-1 capitalize">
                        {user.role}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom de l'entreprise</label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Nom de votre société"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">SIRET / Numéro d'entreprise</label>
                    <Input
                      disabled={!isEditing}
                      placeholder="Numéro d'immatriculation"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p className="font-medium">Membre depuis</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Site web</label>
                    <Input
                      disabled={!isEditing}
                      placeholder="https://votre-site.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Spécialités</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Immobilier</Badge>
                      <Badge variant="outline">Services</Badge>
                      <Badge variant="outline">Consultation</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {user.role === 'professional' && (
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-900 mb-2">Statut professionnel</h4>
                  <p className="text-sm text-blue-700">
                    Votre profil professionnel est en attente de vérification. 
                    Une fois approuvé, vous pourrez publier des annonces et offrir vos services.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
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
                <Button className="w-full" variant="outline">
                  Changer le mot de passe
                </Button>
                <div className="text-sm text-muted-foreground">
                  <p>• Dernière modification : Il y a 30 jours</p>
                  <p>• Force : <span className="text-green-600">Fort</span></p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Paramètres de sécurité supplémentaires
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Authentification à deux facteurs</p>
                    <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité supplémentaire</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activer
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sessions actives</p>
                    <p className="text-sm text-muted-foreground">Gérez vos connexions</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Historique de vos actions sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Connexion", date: "Il y a 2 minutes", icon: "🔐" },
                  { action: "Modification du profil", date: "Il y a 1 heure", icon: "✏️" },
                  { action: "Consultation des statistiques", date: "Il y a 3 heures", icon: "📊" },
                  { action: "Validation d'annonce", date: "Il y a 5 heures", icon: "✅" },
                  { action: "Réponse à un message", date: "Il y a 1 jour", icon: "💬" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProfilePage;
