import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
  Save,
  Clock,
  Calendar,
  Mail,
  Phone,
  Euro,
  AlertCircle,
  CheckCircle2,
  Building,
  Settings as SettingsIcon,
} from "lucide-react";
import { professionalSettingsService } from "@/services/professionalSettings";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

const ParametresPage = () => {
  const { user } = useAuth();
  const [parametres, setParametres] = useState(null);
  const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false);
  const [messageSucces, setMessageSucces] = useState("");
  const [messageErreur, setMessageErreur] = useState("");
  const [chargement, setChargement] = useState(true);

  const joursSemaine = [
    { key: "lundi", label: "Lundi", dbKey: "horairesLundi" },
    { key: "mardi", label: "Mardi", dbKey: "horairesMardi" },
    { key: "mercredi", label: "Mercredi", dbKey: "horairesMercredi" },
    { key: "jeudi", label: "Jeudi", dbKey: "horairesJeudi" },
    { key: "vendredi", label: "Vendredi", dbKey: "horairesVendredi" },
    { key: "samedi", label: "Samedi", dbKey: "horairesSamedi" },
    { key: "dimanche", label: "Dimanche", dbKey: "horairesDimanche" },
  ];

  // Charger les paramètres au montage du composant
  useEffect(() => {
    chargerParametres();
  }, []);

  const chargerParametres = async () => {
    try {
      setChargement(true);
      const settings = await professionalSettingsService.getSettings();

      if (settings) {
        setParametres(settings);
      } else {
        // Créer des paramètres par défaut si aucun n'existe
        await professionalSettingsService.createDefaultSettings();
        const newSettings = await professionalSettingsService.getSettings();
        setParametres(newSettings);
      }
    } catch (error) {
      console.error("Erreur chargement paramètres:", error);
      setMessageErreur("Erreur lors du chargement des paramètres");
      setTimeout(() => setMessageErreur(""), 5000);
    } finally {
      setChargement(false);
    }
  };

  const sauvegarderParametres = async () => {
    if (!parametres) return;

    try {
      setSauvegardeEnCours(true);
      setMessageErreur("");

      await professionalSettingsService.saveSettings(parametres);

      setMessageSucces("Paramètres sauvegardés avec succès !");
      setTimeout(() => setMessageSucces(""), 3000);
    } catch (error) {
      console.error("Erreur sauvegarde paramètres:", error);
      setMessageErreur("Erreur lors de la sauvegarde des paramètres");
      setTimeout(() => setMessageErreur(""), 5000);
    } finally {
      setSauvegardeEnCours(false);
    }
  };

  const mettreAJourHoraire = (jourKey, champ, valeur) => {
    setParametres((prev) => ({
      ...prev,
      [jourKey]: {
        ...prev[jourKey],
        [champ]: valeur,
      },
    }));
  };

  const ajouterJourFerme = () => {
    const nouvelleDate = new Date().toISOString().split("T")[0];
    setParametres((prev) => ({
      ...prev,
      joursFermes: [
        ...(prev.joursFermes || []),
        { date: nouvelleDate, label: "Nouveau jour fermé" },
      ],
    }));
  };

  const mettreAJourJourFerme = (index, champ, valeur) => {
    setParametres((prev) => {
      const nouveauxJours = [...(prev.joursFermes || [])];
      nouveauxJours[index] = {
        ...nouveauxJours[index],
        [champ]: valeur,
      };
      return { ...prev, joursFermes: nouveauxJours };
    });
  };

  const supprimerJourFerme = (index) => {
    setParametres((prev) => ({
      ...prev,
      joursFermes: (prev.joursFermes || []).filter((_, i) => i !== index),
    }));
  };

  const mettreAJourChamp = (champ, valeur) => {
    setParametres((prev) => ({
      ...prev,
      [champ]: valeur,
    }));
  };

  if (chargement) {
    return <LoadingSpinner text="Chargement des paramètres" />;
  }

  if (!parametres) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Impossible de charger les paramètres
          </h2>
          <p className="text-gray-600 mb-4">
            Une erreur est survenue lors du chargement de vos paramètres.
          </p>
          <Button onClick={chargerParametres}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-[#6B8E23]/10 text-[#556B2F]">
              <SettingsIcon size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#8B4513]">
                Paramètres Professionnels
              </h1>
              <p className="text-lg text-gray-600">
                Gérez vos horaires, délais et conditions commerciales
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {messageErreur && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-800">{messageErreur}</span>
          </div>
        )}

        {messageSucces && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="text-green-600" size={20} />
            <span className="text-green-800">{messageSucces}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section Horaires d'ouverture */}
            <Card className="p-6 border-[#D3D3D3]">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-[#556B2F]" size={24} />
                <h2 className="text-2xl font-bold text-[#8B4513]">
                  Horaires d'ouverture
                </h2>
              </div>

              <div className="space-y-4">
                {joursSemaine.map((jour) => {
                  const horaire = parametres[jour.dbKey] || {
                    ouvert: false,
                    debut: "",
                    fin: "",
                  };
                  return (
                    <div
                      key={jour.key}
                      className="flex items-center justify-between p-4 border border-[#D3D3D3] rounded-lg hover:bg-[#6B8E23]/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={horaire.ouvert || false}
                          onCheckedChange={(ouvert) =>
                            mettreAJourHoraire(jour.dbKey, "ouvert", ouvert)
                          }
                          className="data-[state=checked]:bg-[#556B2F]"
                        />
                        <Label className="font-medium w-24 text-gray-900">
                          {jour.label}
                        </Label>
                      </div>

                      {horaire.ouvert && (
                        <div className="flex flex-col md:flex-row items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Label className="text-[#8B4513]">De</Label>
                            <Input
                              type="time"
                              value={horaire.debut || ""}
                              onChange={(e) =>
                                mettreAJourHoraire(
                                  jour.dbKey,
                                  "debut",
                                  e.target.value
                                )
                              }
                              className="w-24 md:w-32 border-[#D3D3D3] focus:border-[#556B2F]"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-[#8B4513]">À</Label>
                            <Input
                              type="time"
                              value={horaire.fin || ""}
                              onChange={(e) =>
                                mettreAJourHoraire(
                                  jour.dbKey,
                                  "fin",
                                  e.target.value
                                )
                              }
                              className="w-24 md:w-32 border-[#D3D3D3] focus:border-[#556B2F]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Section Jours fermés */}
            <Card className="p-6 border-[#D3D3D3]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="text-[#556B2F]" size={24} />
                  <h2 className="text-2xl font-bold text-[#8B4513]">
                    Jours fermés exceptionnels
                  </h2>
                </div>
                <Button 
                  onClick={ajouterJourFerme} 
                  variant="outline"
                  className="border-[#556B2F] text-[#556B2F] hover:bg-[#6B8E23]/10"
                >
                  + Ajouter
                </Button>
              </div>

              <div className="space-y-3">
                {(parametres.joursFermes || []).map((jour, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-[#D3D3D3] rounded-lg hover:bg-[#6B8E23]/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Input
                        type="date"
                        value={jour.date || ""}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          mettreAJourJourFerme(index, "date", e.target.value)
                        }
                        className="w-40 border-[#D3D3D3] focus:border-[#556B2F]"
                      />
                      <Input
                        placeholder="Libellé (ex: Férié, Congés...)"
                        value={jour.label || ""}
                        onChange={(e) =>
                          mettreAJourJourFerme(index, "label", e.target.value)
                        }
                        className="flex-1 border-[#D3D3D3] focus:border-[#556B2F]"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => supprimerJourFerme(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
                {(parametres.joursFermes || []).length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Aucun jour fermé exceptionnel configuré
                  </p>
                )}
              </div>
            </Card>

            {/* Section Délais de réponse */}
            <Card className="p-6 border-[#D3D3D3]">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="text-[#556B2F]" size={24} />
                <h2 className="text-2xl font-bold text-[#8B4513]">
                  Délais de réponse maximum
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="block mb-3 font-medium text-[#8B4513]">
                    <Mail size={16} className="inline mr-2" />
                    Emails (heures)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="168"
                    value={parametres.delaiReponseEmail || 24}
                    onChange={(e) =>
                      mettreAJourChamp(
                        "delaiReponseEmail",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="text-lg border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium text-[#8B4513]">
                    <Phone size={16} className="inline mr-2" />
                    Téléphone (heures)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    value={parametres.delaiReponseTelephone || 2}
                    onChange={(e) =>
                      mettreAJourChamp(
                        "delaiReponseTelephone",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="text-lg border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium text-[#8B4513]">
                    <AlertCircle size={16} className="inline mr-2" />
                    Urgences (heures)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={parametres.delaiReponseUrgence || 4}
                    onChange={(e) =>
                      mettreAJourChamp(
                        "delaiReponseUrgence",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="text-lg border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-8">
            {/* Section Politique d'annulation */}
            <Card className="p-6 border-[#D3D3D3]">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="text-[#556B2F]" size={24} />
                <h2 className="text-2xl font-bold text-[#8B4513]">
                  Politique d'annulation
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block mb-3 font-medium text-[#8B4513]">
                    Délai d'annulation gratuit (heures)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="720"
                    value={parametres.delaiAnnulationGratuit || 48}
                    onChange={(e) =>
                      mettreAJourChamp(
                        "delaiAnnulationGratuit",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium text-[#8B4513]">
                    Frais d'annulation (%)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={parametres.fraisAnnulationPourcent || 15}
                    onChange={(e) =>
                      mettreAJourChamp(
                        "fraisAnnulationPourcent",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium text-[#8B4513]">
                    Conditions d'annulation
                  </Label>
                  <Textarea
                    value={parametres.conditionsAnnulation || ""}
                    onChange={(e) =>
                      mettreAJourChamp("conditionsAnnulation", e.target.value)
                    }
                    rows={4}
                    placeholder="Décrivez votre politique d'annulation..."
                    className="border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>
              </div>
            </Card>

            {/* Section Seuil de réservation */}
            <Card className="p-6 border-[#D3D3D3]">
              <div className="flex items-center gap-3 mb-6">
                <Euro className="text-[#556B2F]" size={24} />
                <h2 className="text-2xl font-bold text-[#8B4513]">
                  Seuil de réservation
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block mb-3 font-medium text-[#8B4513]">
                    Acompte requis (%)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={parametres.acomptePourcentage || 30}
                    onChange={(e) =>
                      mettreAJourChamp(
                        "acomptePourcentage",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium text-[#8B4513]">
                    Montant minimum (€)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={parametres.montantMinimum || 100}
                    onChange={(e) =>
                      mettreAJourChamp(
                        "montantMinimum",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium text-[#8B4513]">
                    Conditions de paiement
                  </Label>
                  <Textarea
                    value={parametres.conditionsPaiement || ""}
                    onChange={(e) =>
                      mettreAJourChamp("conditionsPaiement", e.target.value)
                    }
                    rows={3}
                    placeholder="Décrivez vos conditions de paiement..."
                    className="border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>
              </div>
            </Card>

            {/* Section Informations générales */}
            <Card className="p-6 border-[#D3D3D3]">
              <div className="flex items-center gap-3 mb-6">
                <Building className="text-[#556B2F]" size={24} />
                <h2 className="text-2xl font-bold text-[#8B4513]">
                  Informations générales
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block mb-2 text-sm font-medium text-[#8B4513]">
                    Nom de l'entreprise
                  </Label>
                  <Input
                    value={parametres.nomEntreprise || ""}
                    onChange={(e) =>
                      mettreAJourChamp("nomEntreprise", e.target.value)
                    }
                    className="border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>

                <div>
                  <Label className="block mb-2 text-sm font-medium text-[#8B4513]">
                    Email de contact
                  </Label>
                  <Input
                    type="email"
                    value={parametres.emailContact || ""}
                    onChange={(e) =>
                      mettreAJourChamp("emailContact", e.target.value)
                    }
                    className="border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>

                <div>
                  <Label className="block mb-2 text-sm font-medium text-[#8B4513]">
                    Téléphone
                  </Label>
                  <Input
                    value={parametres.telephone || ""}
                    onChange={(e) =>
                      mettreAJourChamp("telephone", e.target.value)
                    }
                    className="border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>

                <div>
                  <Label className="block mb-2 text-sm font-medium text-[#8B4513]">
                    Adresse
                  </Label>
                  <Textarea
                    value={parametres.adresse || ""}
                    onChange={(e) =>
                      mettreAJourChamp("adresse", e.target.value)
                    }
                    rows={2}
                    className="border-[#D3D3D3] focus:border-[#556B2F]"
                  />
                </div>
              </div>
            </Card>

            {/* Bouton de sauvegarde */}
            <Card className="p-6 bg-[#6B8E23]/10 border-[#556B2F]">
              <div className="text-center">
                <Button
                  onClick={sauvegarderParametres}
                  disabled={sauvegardeEnCours}
                  className="w-full py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 bg-[#556B2F] hover:bg-[#6B8E23] text-white"
                >
                  {sauvegardeEnCours ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={20} />
                      Sauvegarder les paramètres
                    </>
                  )}
                </Button>
                <p className="text-sm mt-3 text-gray-600">
                  Tous les changements seront appliqués immédiatement
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ParametresPage;