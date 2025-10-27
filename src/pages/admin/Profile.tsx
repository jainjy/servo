import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Building, MapPin, Calendar, Edit2, Save, X, Camera, Shield, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import UserService from "@/services/userService";
import { toast } from "sonner";

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
  });

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
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      toast.error('Erreur lors du chargement du profil');
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
      };

      await UserService.updateProfile(updateData);
      await fetchUserProfile(); // Recharger les données
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
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
      });
    }
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const response = await UserService.uploadAvatar(file);
      await UserService.updateProfile({ avatar: response.url });
      await fetchUserProfile(); // Recharger les données
      toast.success('Avatar mis à jour avec succès');
    } catch (error: any) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error(error.message || 'Erreur lors de l\'upload de l\'avatar');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = async () => {
    // Implémentation basique - à compléter avec un formulaire de changement de mot de passe
    toast.info('Fonctionnalité de changement de mot de passe à implémenter');
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between flex-col md:flex-row items-center">
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
        <TabsList className="grid w-full grid-cols-2 h-auto lg:grid-cols-3">
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="professional">Informations professionnelles</TabsTrigger>
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
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user.avatar || ""} />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`cursor-pointer w-full ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Button variant="outline" size="sm" className="w-full" disabled={isUploading}>
                      <Camera className="h-4 w-4 mr-2" />
                      {isUploading ? "Upload..." : "Changer la photo"}
                    </Button>
                  </label>
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
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="+261 34 12 345 67"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Code postal</label>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Code postal"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ville</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
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
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Votre adresse complète"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Complément d'adresse</label>
                  <Input
                    value={formData.addressComplement}
                    onChange={(e) => handleInputChange('addressComplement', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Appartement, étage, etc."
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
                    <label className="text-sm font-medium">Nom commercial</label>
                    <Input
                      value={formData.commercialName}
                      onChange={(e) => handleInputChange('commercialName', e.target.value)}
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
                        {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">SIRET</label>
                    <Input
                      value={formData.siret}
                      onChange={(e) => handleInputChange('siret', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Numéro SIRET"
                    />
                  </div>

                  {user.demandType && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type de demande</label>
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
              {user.role === 'professional' && (
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
                          <p className="text-sm text-muted-foreground">Aucun métier associé</p>
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
                          <p className="text-sm text-muted-foreground">Aucun service associé</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {user.status === 'inactive' && (
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-medium text-blue-900 mb-2">Statut professionnel</h4>
                      <p className="text-sm text-blue-700">
                        Votre profil professionnel est en attente de vérification. 
                        Une fois approuvé, vous pourrez publier des annonces et offrir vos services.
                      </p>
                    </div>
                  )}
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
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handlePasswordChange}
                >
                  Changer le mot de passe
                </Button>
                <div className="text-sm text-muted-foreground">
                  <p>• Dernière modification : À déterminer</p>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info('Fonctionnalité à venir')}
                  >
                    Activer
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sessions actives</p>
                    <p className="text-sm text-muted-foreground">Gérez vos connexions</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info('Fonctionnalité à venir')}
                  >
                    Voir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProfilePage;