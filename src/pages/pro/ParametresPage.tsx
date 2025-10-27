"use client";

import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Save, Clock, Calendar, Mail, Phone, Euro, AlertCircle, CheckCircle2, Building, Users, Settings as SettingsIcon } from "lucide-react";

const ParametresPage = () => {
  const [parametres, setParametres] = useState({
    // Horaires d'ouverture
    horaires: {
      lundi: { ouvert: true, debut: "09:00", fin: "18:00" },
      mardi: { ouvert: true, debut: "09:00", fin: "18:00" },
      mercredi: { ouvert: true, debut: "09:00", fin: "18:00" },
      jeudi: { ouvert: true, debut: "09:00", fin: "18:00" },
      vendredi: { ouvert: true, debut: "09:00", fin: "17:00" },
      samedi: { ouvert: false, debut: "10:00", fin: "16:00" },
      dimanche: { ouvert: false, debut: "", fin: "" }
    },
    
    // Jours fermés exceptionnels
    joursFermes: [
      { date: "2024-01-01", label: "Nouvel An" },
      { date: "2024-12-25", label: "Noël" }
    ],
    
    // Délais de réponse
    delaisReponse: {
      email: 24,
      telephone: 2,
      urgence: 4
    },
    
    // Politique d'annulation
    politiqueAnnulation: {
      delaiGratuit: 48, // Heures
      fraisAnnulation: 15, // Pourcentage
      conditions: "Toute annulation intervenant moins de 48 heures avant le rendez-vous pourra être facturée à hauteur de 15% du montant de la prestation."
    },
    
    // Seuil de réservation
    seuilReservation: {
      acomptePourcentage: 30,
      montantMinimum: 100,
      conditionsPaiement: "Un acompte de 30% est requis pour confirmer toute réservation. Le solde est dû à la signature du contrat."
    },
    
    // Paramètres généraux
    general: {
      nomEntreprise: "Immobilier Pro",
      emailContact: "contact@immobilier-pro.fr",
      telephone: "01 23 45 67 89",
      adresse: "123 Avenue des Champs-Élysées, 75008 Paris"
    }
  });

  const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false);
  const [messageSucces, setMessageSucces] = useState("");

  const joursSemaine = [
    { key: "lundi", label: "Lundi" },
    { key: "mardi", label: "Mardi" },
    { key: "mercredi", label: "Mercredi" },
    { key: "jeudi", label: "Jeudi" },
    { key: "vendredi", label: "Vendredi" },
    { key: "samedi", label: "Samedi" },
    { key: "dimanche", label: "Dimanche" }
  ];

  const sauvegarderParametres = async () => {
    setSauvegardeEnCours(true);
    
    // Simulation sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSauvegardeEnCours(false);
    setMessageSucces("Paramètres sauvegardés avec succès !");
    
    setTimeout(() => setMessageSucces(""), 3000);
  };

  const ajouterJourFerme = () => {
    const nouvelleDate = new Date().toISOString().split('T')[0];
    setParametres(prev => ({
      ...prev,
      joursFermes: [
        ...prev.joursFermes,
        { date: nouvelleDate, label: "Nouveau jour fermé" }
      ]
    }));
  };

  const supprimerJourFerme = (index) => {
    setParametres(prev => ({
      ...prev,
      joursFermes: prev.joursFermes.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <SettingsIcon size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: '#0A0A0A' }}>
                Paramètres Professionnels
              </h1>
              <p className="text-lg" style={{ color: '#5A6470' }}>
                Gérez vos horaires, délais et conditions commerciales
              </p>
            </div>
          </div>
        </div>

        {/* Message de succès */}
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
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold" style={{ color: '#0A0A0A' }}>
                  Horaires d'ouverture
                </h2>
              </div>

              <div className="space-y-4">
                {joursSemaine.map((jour) => (
                  <div key={jour.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={parametres.horaires[jour.key].ouvert}
                        onCheckedChange={(ouvert) => 
                          setParametres(prev => ({
                            ...prev,
                            horaires: {
                              ...prev.horaires,
                              [jour.key]: { ...prev.horaires[jour.key], ouvert }
                            }
                          }))
                        }
                      />
                      <Label className="font-medium w-24" style={{ color: '#0A0A0A' }}>
                        {jour.label}
                      </Label>
                    </div>
                    
                    {parametres.horaires[jour.key].ouvert && (
                      <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label>De</Label>
                          <Input
                            type="time"
                            value={parametres.horaires[jour.key].debut}
                            onChange={(e) => 
                              setParametres(prev => ({
                                ...prev,
                                horaires: {
                                  ...prev.horaires,
                                  [jour.key]: { ...prev.horaires[jour.key], debut: e.target.value }
                                }
                              }))
                            }
                            className="w-24 md:w-32"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label>À</Label>
                          <Input
                            type="time"
                            value={parametres.horaires[jour.key].fin}
                            onChange={(e) => 
                              setParametres(prev => ({
                                ...prev,
                                horaires: {
                                  ...prev.horaires,
                                  [jour.key]: { ...prev.horaires[jour.key], fin: e.target.value }
                                }
                              }))
                            }
                             className="w-24 md:w-32"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Section Jours fermés */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold" style={{ color: '#0A0A0A' }}>
                    Jours fermés exceptionnels
                  </h2>
                </div>
                <Button onClick={ajouterJourFerme} variant="outline">
                  + Ajouter
                </Button>
              </div>

              <div className="space-y-3">
                {parametres.joursFermes.map((jour, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Input
                        type="date"
                        value={jour.date}
                        onChange={(e) => {
                          const nouveauxJours = [...parametres.joursFermes];
                          nouveauxJours[index].date = e.target.value;
                          setParametres(prev => ({ ...prev, joursFermes: nouveauxJours }));
                        }}
                        className="w-40"
                      />
                      <Input
                        placeholder="Libellé (ex: Férié, Congés...)"
                        value={jour.label}
                        onChange={(e) => {
                          const nouveauxJours = [...parametres.joursFermes];
                          nouveauxJours[index].label = e.target.value;
                          setParametres(prev => ({ ...prev, joursFermes: nouveauxJours }));
                        }}
                        className="flex-1"
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
              </div>
            </Card>

            {/* Section Délais de réponse */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold" style={{ color: '#0A0A0A' }}>
                  Délais de réponse maximum
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="block mb-3 font-medium" style={{ color: '#0A0A0A' }}>
                    <Mail size={16} className="inline mr-2" />
                    Emails (heures)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="168"
                    value={parametres.delaisReponse.email}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        delaisReponse: { ...prev.delaisReponse, email: parseInt(e.target.value) || 0 }
                      }))
                    }
                    className="text-lg"
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium" style={{ color: '#0A0A0A' }}>
                    <Phone size={16} className="inline mr-2" />
                    Téléphone (heures)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    value={parametres.delaisReponse.telephone}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        delaisReponse: { ...prev.delaisReponse, telephone: parseInt(e.target.value) || 0 }
                      }))
                    }
                    className="text-lg"
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium" style={{ color: '#0A0A0A' }}>
                    <AlertCircle size={16} className="inline mr-2" />
                    Urgences (heures)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={parametres.delaisReponse.urgence}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        delaisReponse: { ...prev.delaisReponse, urgence: parseInt(e.target.value) || 0 }
                      }))
                    }
                    className="text-lg"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-8">
            {/* Section Politique d'annulation */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold" style={{ color: '#0A0A0A' }}>
                  Politique d'annulation
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block mb-3 font-medium" style={{ color: '#0A0A0A' }}>
                    Délai d'annulation gratuit (heures)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="720"
                    value={parametres.politiqueAnnulation.delaiGratuit}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        politiqueAnnulation: { 
                          ...prev.politiqueAnnulation, 
                          delaiGratuit: parseInt(e.target.value) || 0 
                        }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium" style={{ color: '#0A0A0A' }}>
                    Frais d'annulation (%)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={parametres.politiqueAnnulation.fraisAnnulation}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        politiqueAnnulation: { 
                          ...prev.politiqueAnnulation, 
                          fraisAnnulation: parseInt(e.target.value) || 0 
                        }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium" style={{ color: '#0A0A0A' }}>
                    Conditions d'annulation
                  </Label>
                  <Textarea
                    value={parametres.politiqueAnnulation.conditions}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        politiqueAnnulation: { 
                          ...prev.politiqueAnnulation, 
                          conditions: e.target.value 
                        }
                      }))
                    }
                    rows={4}
                    placeholder="Décrivez votre politique d'annulation..."
                  />
                </div>
              </div>
            </Card>

            {/* Section Seuil de réservation */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Euro className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold" style={{ color: '#0A0A0A' }}>
                  Seuil de réservation
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block mb-3 font-medium" style={{ color: '#0A0A0A' }}>
                    Acompte requis (%)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={parametres.seuilReservation.acomptePourcentage}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        seuilReservation: { 
                          ...prev.seuilReservation, 
                          acomptePourcentage: parseInt(e.target.value) || 0 
                        }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium" style={{ color: '#0A0A0A' }}>
                    Montant minimum (€)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={parametres.seuilReservation.montantMinimum}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        seuilReservation: { 
                          ...prev.seuilReservation, 
                          montantMinimum: parseInt(e.target.value) || 0 
                        }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="block mb-3 font-medium" style={{ color: '#0A0A0A' }}>
                    Conditions de paiement
                  </Label>
                  <Textarea
                    value={parametres.seuilReservation.conditionsPaiement}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        seuilReservation: { 
                          ...prev.seuilReservation, 
                          conditionsPaiement: e.target.value 
                        }
                      }))
                    }
                    rows={3}
                    placeholder="Décrivez vos conditions de paiement..."
                  />
                </div>
              </div>
            </Card>

            {/* Section Informations générales */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Building className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold" style={{ color: '#0A0A0A' }}>
                  Informations générales
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block mb-2 text-sm font-medium">Nom de l'entreprise</Label>
                  <Input
                    value={parametres.general.nomEntreprise}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        general: { ...prev.general, nomEntreprise: e.target.value }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="block mb-2 text-sm font-medium">Email de contact</Label>
                  <Input
                    type="email"
                    value={parametres.general.emailContact}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        general: { ...prev.general, emailContact: e.target.value }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="block mb-2 text-sm font-medium">Téléphone</Label>
                  <Input
                    value={parametres.general.telephone}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        general: { ...prev.general, telephone: e.target.value }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="block mb-2 text-sm font-medium">Adresse</Label>
                  <Textarea
                    value={parametres.general.adresse}
                    onChange={(e) => 
                      setParametres(prev => ({
                        ...prev,
                        general: { ...prev.general, adresse: e.target.value }
                      }))
                    }
                    rows={2}
                  />
                </div>
              </div>
            </Card>

            {/* Bouton de sauvegarde */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="text-center">
                <Button
                  onClick={sauvegarderParametres}
                  disabled={sauvegardeEnCours}
                  className="w-full py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#0052FF', color: 'white' }}
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
                <p className="text-sm mt-3" style={{ color: '#5A6470' }}>
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