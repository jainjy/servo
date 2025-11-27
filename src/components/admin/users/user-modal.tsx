// components/admin/users/user-modal.tsx
import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { LocationPickerModal } from "@/components/location-picker-modal";

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  mode: "create" | "edit";
  onSuccess?: () => void;
}

interface Metier {
  id: number;
  libelle: string;
}

interface Service {
  id: number;
  libelle: string;
}

export function UserModal({
  open,
  onOpenChange,
  user,
  mode,
  onSuccess,
}: UserModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    status: "active",
    companyName: "",
    demandType: "particulier",
    address: "",
    zipCode: "",
    city: "",
    userType: "",
    addressComplement: "",
    commercialName: "",
    siret: "",
    latitude: "",
    longitude: "",
    metiers: [] as number[],
    services: [] as number[],
  });
  const [metiers, setMetiers] = useState<Metier[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Charger les métiers et services au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metiersResponse, servicesResponse] = await Promise.all([
          api.get("/users/metiers/all"),
          api.get("/users/services/all"),
        ]);
        setMetiers(metiersResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };
    fetchData();
  }, []);

  // Mettre à jour le formulaire quand l'utilisateur change
  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        role: user.role || "user",
        status: user.status || "active",
        companyName: user.companyName || "",
        demandType: user.demandType || "particulier",
        address: user.address || "",
        zipCode: user.zipCode || "",
        city: user.city || "",
        addressComplement: user.addressComplement || "",
        commercialName: user.commercialName || "",
        siret: user.siret || "",
        latitude: user.latitude?.toString() || "",
        longitude: user.longitude?.toString() || "",
        metiers: user.metiers?.map((m: any) => m.id) || [],
        services: user.services?.map((s: any) => s.id) || [],
        userType: user.userType || "",
      });
    } else {
      // Réinitialiser le formulaire pour la création
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
        status: "active",
        companyName: "",
        demandType: "particulier",
        address: "",
        zipCode: "",
        city: "",
        addressComplement: "",
        commercialName: "",
        siret: "",
        latitude: "",
        longitude: "",
        metiers: [],
        services: [],
        userType: "",
      });
    }
  }, [user, mode]);
  // Ajouter cet useEffect pour gérer le cochage automatique des métiers
  useEffect(() => {
    if (formData.userType === "BIEN_ETRE" && metiers.length > 0) {
      const bienEtreMetiers = [
        "BoutiqueNaturels",
        "Podcasteur",
        "Thérapeute",
        "Masseur",
        "Formateur",
      ];
      const bienEtreMetierIds = metiers
        .filter((metier) => bienEtreMetiers.includes(metier.libelle))
        .map((metier) => metier.id);

      // Cocher seulement si les métiers ne sont pas déjà tous cochés
      if (
        bienEtreMetierIds.length > 0 &&
        !bienEtreMetierIds.every((id) => formData.metiers.includes(id))
      ) {
        setFormData((prev) => ({
          ...prev,
          metiers: [...new Set([...prev.metiers, ...bienEtreMetierIds])],
        }));
      }
    }
  }, [formData.userType, metiers]);

  // Modifier aussi la fonction getFilteredMetiers pour s'assurer qu'elle est cohérente
  const getFilteredMetiers = () => {
    if (formData.userType === "BIEN_ETRE") {
      const bienEtreMetiers = [
        "BoutiqueNaturels",
        "Podcasteur",
        "Thérapeute",
        "Masseur",
        "Formateur",
      ];
      return metiers.filter((metier) =>
        bienEtreMetiers.includes(metier.libelle)
      );
    }
    return metiers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      if (mode === "create") {
        await api.post("/users", submitData);
      } else {
        await api.put(`/users/${user?.id}`, submitData);
      }

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) return;

    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/users/${user.id}`);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(
        error.response?.data?.error ||
          "Une erreur est survenue lors de la suppression"
      );
    } finally {
      setLoading(false);
    }
  };

  const isProfessional = formData.role === "professional";
  const isUser = formData.role === "user";
  const filteredMetiers = getFilteredMetiers();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === "create"
              ? "Nouvel utilisateur"
              : "Modifier l'utilisateur"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "create"
              ? "Créer un nouveau compte utilisateur sur la plateforme"
              : "Modifier les informations de l'utilisateur"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Rôle et Statut */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">
                  Rôle *
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="professional">Professionnel</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-foreground">
                  Statut *
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Informations de base */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">
                  Prénom *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="bg-background border-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">
                  Nom *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="bg-background border-input"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-background border-input"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Téléphone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-background border-input"
              />
            </div>
            {/* Informations professionnelles */}
            {isProfessional && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="userType" className="text-foreground">
                    Type de professionnel *
                  </Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, userType: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="PRESTATAIRE">
                        Prestataire de services
                      </SelectItem>
                      <SelectItem value="VENDEUR">
                        Vendeur (Ameublement)
                      </SelectItem>
                      <SelectItem value="AGENCE">Agence immobilière</SelectItem>
                      <SelectItem value="BIEN_ETRE">
                        Professionnel du bien-être
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nom de l'entreprise *</Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="Nom de l'entreprise"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom commercial</Label>
                    <Input
                      value={formData.commercialName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commercialName: e.target.value,
                        })
                      }
                      placeholder="Nom commercial"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SIRET</Label>
                    <Input
                      value={formData.siret}
                      onChange={(e) =>
                        setFormData({ ...formData, siret: e.target.value })
                      }
                      placeholder="Numéro SIRET"
                    />
                  </div>
                </div>

                {/* Métiers */}
                <div className="space-y-2">
                  <Label>Métiers</Label>
                  {filteredMetiers.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-2 border border-border rounded-md">
                      {formData.userType === "BIEN_ETRE"
                        ? "Aucun métier disponible pour le bien-être"
                        : "Aucun métier disponible"}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {filteredMetiers.map((metier) => (
                        <label
                          key={metier.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={formData.metiers.includes(metier.id)}
                            onChange={(e) => {
                              const newMetiers = e.target.checked
                                ? [...formData.metiers, metier.id]
                                : formData.metiers.filter(
                                    (id) => id !== metier.id
                                  );
                              setFormData({ ...formData, metiers: newMetiers });
                            }}
                          />
                          <span className="text-sm">{metier.libelle}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Services */}
                {formData.userType != "BIEN_ETRE" && (
                  <div className="space-y-2">
                    <Label>Services</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {services.map((service) => (
                        <label
                          key={service.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service.id)}
                            onChange={(e) => {
                              const newServices = e.target.checked
                                ? [...formData.services, service.id]
                                : formData.services.filter(
                                    (id) => id !== service.id
                                  );
                              setFormData({
                                ...formData,
                                services: newServices,
                              });
                            }}
                          />
                          <span className="text-sm">{service.libelle}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            {isUser && (
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-foreground">
                  Type d'utilisateur
                </Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, userType: value })
                  }
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="CLIENT">Client particulier</SelectItem>
                    <SelectItem value="VENDEUR">Vendeur occasionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Adresse */}
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Adresse postale"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Code postal</Label>
                <Input
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  placeholder="Code postal"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Ville</Label>
                <Input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Ville"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Complément d'adresse</Label>
              <Input
                value={formData.addressComplement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    addressComplement: e.target.value,
                  })
                }
                placeholder="Complément d'adresse"
              />
            </div>
            {/* Coordonnées GPS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position géographique</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocationModalOpen(true)}
                  className="w-full justify-start border-input"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {formData.latitude && formData.longitude
                    ? `Position définie: ${parseFloat(
                        formData.latitude
                      ).toFixed(4)}, ${parseFloat(formData.longitude).toFixed(
                        4
                      )}`
                    : "Sélectionner sur la carte"}
                </Button>

                <LocationPickerModal
                  open={locationModalOpen}
                  onOpenChange={setLocationModalOpen}
                  latitude={
                    formData.latitude ? parseFloat(formData.latitude) : null
                  }
                  longitude={
                    formData.longitude ? parseFloat(formData.longitude) : null
                  }
                  onLocationChange={(lat, lng) => {
                    setFormData({
                      ...formData,
                      latitude: lat.toString(),
                      longitude: lng.toString(),
                    });
                  }}
                />
              </div>
            </div>
            {/* Mot de passe */}
            <div className="space-y-2">
              <Label>Mot de passe {mode === "create" && "*"}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Mot de passe"
                required={mode === "create"}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                className="mr-auto"
              >
                Supprimer
              </Button>
            )}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:ml-auto w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border w-full sm:w-auto"
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                disabled={loading}
              >
                {loading
                  ? "Chargement..."
                  : mode === "create"
                  ? "Créer"
                  : "Enregistrer"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
