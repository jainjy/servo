import React, { useState } from 'react';
import { Bus, Info, ChevronRight, Search, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Données simulées des réseaux de bus de La Réunion
const networks = [
  {
    id: 'carjaune',
    name: 'Car Jaune',
    color: 'bg-yellow-400',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-900',
    description: "Réseau interurbain reliant les principales villes de l'île.",
    lines: [
      { id: 'O1', name: 'Ligne O1', from: 'St-Pierre', to: 'St-Denis', via: 'Route des Tamarins' },
      { id: 'O2', name: 'Ligne O2', from: 'St-Pierre', to: 'St-Denis', via: 'RN1 (Ancienne Route)' },
      { id: 'O3', name: 'Ligne O3', from: 'St-Paul', to: 'St-Denis', via: 'Plateau Caillou' },
      { id: 'O4', name: 'Ligne O4', from: 'St-Paul', to: 'St-Denis', via: 'Littoral' },
      { id: 'S1', name: 'Ligne S1', from: 'St-Benoît', to: 'St-Pierre', via: 'Plaine des Palmistes' },
      { id: 'S2', name: 'Ligne S2', from: 'St-Benoît', to: 'St-Pierre', via: 'Grand Brûlé' },
      { id: 'S3', name: 'Ligne S3', from: 'St-Joseph', to: 'St-Paul', via: 'Ligne des Bambous' },
      { id: 'S4', name: 'Ligne S4', from: 'St-Pierre', to: 'St-Paul', via: 'Hauts' },
      { id: 'S5', name: 'Ligne S5', from: 'Entre-Deux', to: 'St-Pierre', via: '' },
      { id: 'S6', name: 'Ligne S6', from: 'St-Joseph', to: 'Le Tampon', via: 'Petite-Île' },
      { id: 'E1', name: 'Ligne E1', from: 'St-Benoît', to: 'St-Denis', via: 'RN2' },
      { id: 'E2', name: 'Ligne E2', from: 'St-Benoît', to: 'St-Denis', via: 'Express' },
      { id: 'E3', name: 'Ligne E3', from: 'St-André', to: 'St-Denis', via: '' },
      { id: 'E4', name: 'Ligne E4', from: 'St-André', to: 'St-Denis', via: 'Express' },
      { id: 'T', name: 'Ligne T', from: 'Aéroport Roland Garros', to: 'St-Pierre / St-Denis', via: '' },
      { id: 'ZO', name: 'Ligne ZO', from: 'St-Denis', to: 'St-Pierre', via: 'Express' },
    ]
  },
  {
    id: 'citalis',
    name: 'Citalis',
  
    color: 'bg-orange-500',
    borderColor: 'border-orange-500',
    textColor: 'text-white',
    description: 'Réseau du Nord (Saint-Denis, Sainte-Marie, Sainte-Suzanne).',
    lines: [
      { id: '1', name: 'Ligne 1', from: 'Hôtel de Ville', to: 'Chaudron' },
      { id: '5', name: 'Ligne 5', from: 'Stade de l\'Est', to: 'Hôtel de Ville' },
      { id: '6', name: 'Ligne 6', from: 'Butor', to: 'La Montagne' },
      { id: '7', name: 'Ligne 7', from: 'Hôtel de Ville', to: 'Chaudron' },
      { id: '8', name: 'Ligne 8', from: 'Hôtel de Ville', to: 'Moufia' },
      { id: '10', name: 'Ligne 10', from: 'Hôtel de Ville', to: 'Chaudron' },
      { id: '11', name: 'Ligne 11', from: 'Victoire', to: 'Montgaillard' },
      { id: '12', name: 'Ligne 12', from: 'Bassin Couderc', to: 'Hôtel de Ville' },
      { id: '13', name: 'Ligne 13', from: 'Hôtel de Ville', to: 'Minimes' },
      { id: '15', name: 'Ligne 15', from: 'Stade de l\'Est', to: 'Parc Technor' },
      { id: '16', name: 'Ligne 16', from: 'Hôtel de Ville', to: 'La Bretagne' },
      { id: '31', name: 'Ligne 31', from: 'Quartier Français', to: 'Mairie du Chaudron' },
      { id: '32', name: 'Ligne 32', from: 'Quartier Français', to: 'St-Denis' },
    ]
  },
  {
    id: 'alterneo',
    name: 'Alternéo',
    color: 'bg-pink-600',
    borderColor: 'border-pink-600',
    textColor: 'text-white',
    description: 'Réseau du Sud (Saint-Pierre, Saint-Louis, etc.).',
    lines: [
      { id: '1', name: 'Ligne 1', from: 'St-Louis', to: 'St-Pierre' },
      { id: '2', name: 'Ligne 2', from: 'Petite-Ile', to: 'St-Pierre' },
      { id: '3', name: 'Ligne 3', from: 'Ravine des Cabris', to: 'St-Pierre' },
      { id: '4', name: 'Ligne 4', from: 'Bois d\'Olives', to: 'St-Pierre' },
      { id: '11', name: 'Ligne 11', from: 'Les Avirons', to: 'Etang-Salé' },
      { id: '12', name: 'Ligne 12', from: 'Etang-Salé', to: 'St-Louis' },
      { id: '20', name: 'Ligne 20', from: 'Cilaos', to: 'St-Louis' },
      { id: 'LITT', name: 'Littoral', from: 'St-Pierre', to: 'Etang-Salé' },
    ]
  },
  {
    id: 'karouest',
    name: 'Kar\'Ouest',
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    textColor: 'text-white',
    description: "Réseau de l'Ouest (Le Port, Saint-Paul, Saint-Leu...).",
    lines: [
      { id: '1', name: 'Ligne 1', from: 'Gare Routière St-Paul', to: 'Gare Routière Le Port' },
      { id: '2', name: 'Ligne 2', from: 'Gare St-Paul', to: 'La Possession' },
      { id: '3', name: 'Ligne 3', from: 'Gare St-Paul', to: 'St-Leu' },
      { id: '4', name: 'Ligne 4', from: 'St-Leu', to: 'Etang-Salé' },
      { id: '6', name: 'Ligne 6', from: 'Le Port', to: 'Dos d\'Ane' },
      { id: '8.5', name: 'Ligne 8.5', from: 'Gare St-Paul', to: 'St-Gilles-les-Bains' },
      { id: '9', name: 'Ligne 9', from: 'La Possession', to: 'Ste-Thérèse' },
    ]
  },
  {
    id: 'estival',
    name: 'Estival',
    color: 'bg-green-600',
    borderColor: 'border-green-600',
    textColor: 'text-white',
    description: 'Réseau de l\'Est (Saint-Benoît, Saint-André, Salazie...).',
    lines: [
      { id: '1', name: 'Ligne 1', from: 'Gare St-Benoît', to: 'Gare St-André' },
      { id: '2', name: 'Ligne 2', from: 'Gare St-Benoît', to: 'Ste-Rose' },
      { id: '3', name: 'Ligne 3', from: 'Gare St-André', to: 'Salazie' },
      { id: '4', name: 'Ligne 4', from: 'Gare St-André', to: 'Bras-Panon' },
      { id: '5', name: 'Ligne 5', from: 'Gare St-Benoît', to: 'Plaine des Palmistes' },
    ]
  },
  {
    id: 'carsud',
    name: 'CarSud',
    color: 'bg-red-600',
    borderColor: 'border-red-600',
    textColor: 'text-white',
    description: 'Réseau du Sud Sauvage (Le Tampon, St-Joseph, St-Philippe).',
    lines: [
      { id: 'STA', name: 'Ligne STA', from: 'Gare du Tampon', to: 'Université' },
      { id: 'STB', name: 'Ligne STB', from: 'Gare St-Pierre', to: 'Gare du Tampon' },
      { id: 'T01', name: 'Ligne T01', from: 'Trois-Mares', to: 'Gare du Tampon' },
      { id: 'S01', name: 'Ligne S01', from: 'St-Joseph', to: 'St-Philippe' },
      { id: 'S02', name: 'Ligne S02', from: 'St-Joseph', to: 'Plaine des Grègues' },
    ]
  }
];

export const BusRoutesView = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<typeof networks[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNetworks = networks.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.lines.some(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.from.toLowerCase().includes(searchTerm.toLowerCase()) || l.to.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#8B4513] flex items-center gap-2">
            <Bus className="h-6 w-6 text-[#556B2F]" />
            Réseaux de Bus - La Réunion
          </h2>
          <p className="text-gray-600">Consultez les lignes et horaires des différents réseaux de l'île</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#556B2F]" />
          <Input 
            placeholder="Rechercher un réseau, une ligne..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {selectedNetwork ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setSelectedNetwork(null)} className="pl-0 hover:pl-2 transition-all text-[#556B2F] hover:text-[#6B8E23]">
            ← Retour aux réseaux
          </Button>
          
          <Card className={`border-t-4 ${selectedNetwork.borderColor} bg-white`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded text-sm font-bold ${selectedNetwork.color} ${selectedNetwork.textColor}`}>
                  {selectedNetwork.name}
                </span>
                <span>Lignes disponibles</span>
              </CardTitle>
              <CardDescription>{selectedNetwork.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedNetwork.lines.map((line) => (
                  <Card key={line.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-gray-300 hover:border-l-[#556B2F]">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="font-bold text-lg">
                          {line.id}
                        </Badge>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="font-medium">{line.from}</span>
                        </div>
                        <div className="ml-1 border-l-2 border-dashed h-4 border-gray-300"></div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="font-medium">{line.to}</span>
                        </div>
                      </div>
                      {line.via && (
                        <p className="text-xs text-gray-500 mt-3">Via: {line.via}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNetworks.map((network) => (
            <Card 
              key={network.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => setSelectedNetwork(network)}
            >
              <div className={`h-2 w-full ${network.color}`}></div>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-[#8B4513]">{network.name}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {network.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bus className="h-4 w-4" />
                  <span>{network.lines.length} lignes principales</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {network.lines.slice(0, 3).map(line => (
                    <Badge key={line.id} variant="secondary" className="text-xs">
                      {line.id}
                    </Badge>
                  ))}
                  {network.lines.length > 3 && (
                    <Badge variant="secondary" className="text-xs">{network.lines.length - 3}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
    </div>
  );
};
