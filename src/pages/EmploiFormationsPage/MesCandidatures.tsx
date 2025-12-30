// src/components/candidatures/MesCandidatures.jsx
import React, { useState, useEffect } from 'react';
import { useCandidatures } from '@/hooks/useCandidatures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  Download,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MesCandidatures = () => {
  const { getMesCandidatures, isLoading } = useCandidatures();
  const [candidatures, setCandidatures] = useState([]);
  const [activeTab, setActiveTab] = useState('toutes');

  useEffect(() => {
    loadCandidatures();
  }, []);

  const loadCandidatures = async () => {
    const result = await getMesCandidatures();
    if (result.success) {
      setCandidatures(result.candidatures);
    }
  };

  const getIconByType = (type) => {
    switch (type) {
      case 'formation': return BookOpen;
      case 'emploi': return Briefcase;
      case 'alternance': return GraduationCap;
      default: return Briefcase;
    }
  };

  const getStatutBadge = (statut) => {
    const configs = {
      'en_attente': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      'en_revue': { label: 'En revue', color: 'bg-blue-100 text-blue-800' },
      'entretien': { label: 'Entretien', color: 'bg-purple-100 text-purple-800' },
      'acceptee': { label: 'Acceptée', color: 'bg-green-100 text-green-800' },
      'refusee': { label: 'Refusée', color: 'bg-red-100 text-red-800' },
      'annulee': { label: 'Annulée', color: 'bg-gray-100 text-gray-800' }
    };
    const config = configs[statut] || configs.en_attente;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const filteredCandidatures = candidatures.filter(candidature => {
    if (activeTab === 'toutes') return true;
    return candidature.offreType === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#556B2F]">Mes Candidatures</h1>
        <Button onClick={loadCandidatures} disabled={isLoading}>
          Actualiser
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="toutes">Toutes ({candidatures.length})</TabsTrigger>
          <TabsTrigger value="formation">Formations</TabsTrigger>
          <TabsTrigger value="emploi">Emplois</TabsTrigger>
          <TabsTrigger value="alternance">Alternances</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <p>Chargement...</p>
          ) : filteredCandidatures.length > 0 ? (
            filteredCandidatures.map((candidature) => {
              const Icon = getIconByType(candidature.offreType);
              const date = new Date(candidature.createdAt).toLocaleDateString('fr-FR');
              
              return (
                <Card key={candidature.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#556B2F] to-[#6B8E23] flex items-center justify-center text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{candidature.titreOffre}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatutBadge(candidature.statut)}
                              <span className="text-sm text-gray-500">
                                Postulé le {date}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-2 md:mt-0">
                            <Badge variant="outline" className="capitalize">
                              {candidature.offreType}
                            </Badge>
                          </div>
                        </div>
                        
                        {candidature.messageMotivation && (
                          <p className="text-gray-600 mt-2 line-clamp-2">
                            {candidature.messageMotivation}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {candidature.cvUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={candidature.cvUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-1" />
                                CV
                              </a>
                            </Button>
                          )}
                          
                          {candidature.lettreMotivationUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={candidature.lettreMotivationUrl} target="_blank" rel="noopener noreferrer">
                                <Mail className="h-4 w-4 mr-1" />
                                Lettre de motivation
                              </a>
                            </Button>
                          )}
                          
                          {candidature.dateEntretien && (
                            <Button size="sm" variant="outline">
                              <Clock className="h-4 w-4 mr-1" />
                              Entretien le {new Date(candidature.dateEntretien).toLocaleDateString('fr-FR')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Aucune candidature
                </h3>
                <p className="text-gray-500">
                  Vous n'avez pas encore postulé à des offres
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MesCandidatures;