// MissionIBR.tsx
import React, { useState } from 'react';
import { 
  ClipboardList, 
  Building, 
  Wrench, 
  Calculator, 
  Leaf, 
  HardHat, 
  Zap,
  CheckCircle2,
  FileText,
  BarChart3,
  Target,
  Users,
  Lightbulb,
  TrendingUp,
  Briefcase,
  Award,
  Clock,
  DollarSign,
  Filter,
  Download,
  Share2,
  ChevronRight
} from 'lucide-react';

// Types pour TypeScript
interface MissionItem {
  id: number;
  text: string;
  icon: React.ReactNode;
}

interface MissionCategory {
  id: number;
  title: string;
  icon: React.ReactNode;
  items: MissionItem[];
  stats: {
    totalProjects: number;
    successRate: number;
    revenue: string;
    duration: string;
  };
}

// Données complètes des missions avec statistiques
const missionData: MissionCategory[] = [
  {
    id: 1,
    title: "Études préalables & faisabilité",
    icon: <ClipboardList className="w-6 h-6" />,
    stats: {
      totalProjects: 156,
      successRate: 92,
      revenue: "45K€",
      duration: "3-4 semaines"
    },
    items: [
      { id: 1, text: "Analyse du site et du contexte (PLU, PPR, contraintes ABF, réseaux, accès)", icon: <Target className="w-4 h-4" /> },
      { id: 2, text: "Étude de faisabilité architecturale et technique", icon: <CheckCircle2 className="w-4 h-4" /> },
      { id: 3, text: "Estimation du coût et des enveloppes financières", icon: <Calculator className="w-4 h-4" /> },
      { id: 4, text: "Études thermiques initiales (besoins, potentiels, contraintes)", icon: <BarChart3 className="w-4 h-4" /> },
      { id: 5, text: "Études d'impact environnemental (si applicable)", icon: <Leaf className="w-4 h-4" /> },
      { id: 6, text: "Relevés, diagnostic et état des lieux (structure, réseaux, pathologies)", icon: <FileText className="w-4 h-4" /> }
    ]
  },
  {
    id: 2,
    title: "Études architecturales",
    icon: <Building className="w-6 h-6" />,
    stats: {
      totalProjects: 203,
      successRate: 94,
      revenue: "120K€",
      duration: "6-8 semaines"
    },
    items: [
      { id: 1, text: "Analyse du programme et élaboration des premières intentions", icon: <Lightbulb className="w-4 h-4" /> },
      { id: 2, text: "Production des plans : esquisse, APS, APD", icon: <FileText className="w-4 h-4" /> },
      { id: 3, text: "Vue d'ensemble du projet (plans, coupes, façades, 3D)", icon: <BarChart3 className="w-4 h-4" /> },
      { id: 4, text: "Dossier de demande de permis de construire", icon: <ClipboardList className="w-4 h-4" /> },
      { id: 5, text: "Plans d'exécution (DCE ou EXE selon ton rôle)", icon: <Wrench className="w-4 h-4" /> }
    ]
  },
  {
    id: 3,
    title: "Études structurelles",
    icon: <Wrench className="w-6 h-6" />,
    stats: {
      totalProjects: 178,
      successRate: 96,
      revenue: "85K€",
      duration: "4-5 semaines"
    },
    items: [
      { id: 1, text: "Calculs de structures (béton, bois, métal)", icon: <Calculator className="w-4 h-4" /> },
      { id: 2, text: "Dimensionnement des éléments porteurs", icon: <Target className="w-4 h-4" /> },
      { id: 3, text: "Plans d'armatures, plans de charpente, descentes de charges", icon: <FileText className="w-4 h-4" /> },
      { id: 4, text: "Études de renforcement structurel (réhabilitation)", icon: <Zap className="w-4 h-4" /> },
      { id: 5, text: "Modélisation (Robot, Arche, Advance Design, etc.)", icon: <BarChart3 className="w-4 h-4" /> }
    ]
  },
  {
    id: 4,
    title: "Économie de la construction",
    icon: <Calculator className="w-6 h-6" />,
    stats: {
      totalProjects: 234,
      successRate: 98,
      revenue: "65K€",
      duration: "2-3 semaines"
    },
    items: [
      { id: 1, text: "Estimation financière détaillée (DQE, estimatifs par lots)", icon: <Calculator className="w-4 h-4" /> },
      { id: 2, text: "Rédaction du CCTP", icon: <FileText className="w-4 h-4" /> },
      { id: 3, text: "Assistance à la consultation des entreprises (ACT)", icon: <Users className="w-4 h-4" /> },
      { id: 4, text: "Analyse des offres et mise en concurrence", icon: <BarChart3 className="w-4 h-4" /> }
    ]
  },
  {
    id: 5,
    title: "Ingénierie environnementale & performance",
    icon: <Leaf className="w-6 h-6" />,
    stats: {
      totalProjects: 145,
      successRate: 89,
      revenue: "75K€",
      duration: "5-6 semaines"
    },
    items: [
      { id: 1, text: "Études énergétiques et simulations thermiques (STD, FLJ)", icon: <BarChart3 className="w-4 h-4" /> },
      { id: 2, text: "Études d'optimisation environnementale (matériaux biosourcés, ACV)", icon: <Leaf className="w-4 h-4" /> }
    ]
  },
  {
    id: 6,
    title: "Suivi de chantier & direction de travaux",
    icon: <HardHat className="w-6 h-6" />,
    stats: {
      totalProjects: 189,
      successRate: 97,
      revenue: "150K€",
      duration: "Variable"
    },
    items: [
      { id: 1, text: "Visa des plans des entreprises", icon: <CheckCircle2 className="w-4 h-4" /> },
      { id: 2, text: "Contrôle de l'exécution sur site", icon: <Target className="w-4 h-4" /> },
      { id: 3, text: "Réunions de chantier & rédaction des comptes-rendus", icon: <Users className="w-4 h-4" /> },
      { id: 4, text: "Suivi des plannings et gestion des aléas", icon: <BarChart3 className="w-4 h-4" /> },
      { id: 5, text: "Réception des travaux & levée des réserves", icon: <CheckCircle2 className="w-4 h-4" /> }
    ]
  },
  {
    id: 7,
    title: "Spécialités possibles selon ton BET",
    icon: <Zap className="w-6 h-6" />,
    stats: {
      totalProjects: 112,
      successRate: 91,
      revenue: "55K€",
      duration: "3-4 semaines"
    },
    items: [
      { id: 1, text: "Études VRD (voiries, eaux pluviales, assainissement)", icon: <Wrench className="w-4 h-4" /> },
      { id: 2, text: "Relevé 2D/3D pour villas/logements existants", icon: <BarChart3 className="w-4 h-4" /> }
    ]
  }
];

// Composant Statistiques Globales
const GlobalStats: React.FC = () => {
  const overallStats = {
    totalMissions: missionData.reduce((acc, cat) => acc + cat.stats.totalProjects, 0),
    avgSuccessRate: Math.round(missionData.reduce((acc, cat) => acc + cat.stats.successRate, 0) / missionData.length),
    activeProjects: 24,
    totalRevenue: "850K€"
  };

  return (
    <div className="bg-white border border-blue-100 p-6 mb-8 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Tableau de Bord Professionnel</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-blue-100 rounded-lg p-4 hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Missions</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{overallStats.totalMissions}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex items-center mt-3 text-blue-600 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% ce trimestre
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-lg p-4 hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Taux de Réussite</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{overallStats.avgSuccessRate}%</p>
            </div>
            <Award className="w-8 h-8 text-teal-600" />
          </div>
          <div className="flex items-center mt-3 text-teal-600 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +5% vs objectif
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-lg p-4 hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Projets Actifs</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{overallStats.activeProjects}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
          <div className="flex items-center mt-3 text-blue-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            En cours
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-lg p-4 hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Chiffre d'Affaires</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{overallStats.totalRevenue}</p>
            </div>
            <DollarSign className="w-8 h-8 text-teal-500" />
          </div>
          <div className="flex items-center mt-3 text-teal-600 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +18% cette année
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour une catégorie de mission
const MissionCategoryCard: React.FC<{ 
  category: MissionCategory;
  isExpanded: boolean;
  onToggle: (id: number) => void;
}> = ({ category, isExpanded, onToggle }) => {
  return (
    <div className="bg-white border border-blue-100 rounded-xl p-6 hover:border-teal-300 transition-colors shadow-sm hover:shadow-md">
      <div 
         className="flex items-start justify-between w-full text-left"
  onClick={(e) => {
    e.stopPropagation();
    onToggle(category.id);
  }}
      >
        <div className="flex items-start space-x-4 flex-1">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mt-1">
            {category.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">{category.title}</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-semibold text-slate-800">{category.stats.totalProjects}</p>
                <p className="text-xs text-slate-500 mt-1">Projets</p>
                <p className="text-xs text-teal-600 font-medium">{category.stats.successRate}% réussite</p>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-800">{category.items.length}</p>
                <p className="text-xs text-slate-500 mt-1">missions</p>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-800">{category.stats.revenue}</p>
                <p className="text-xs text-slate-500 mt-1">C.A.</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-800">{category.stats.duration}</p>
                <p className="text-xs text-slate-500 mt-1">Durée</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <ChevronRight className={`w-5 h-5 text-blue-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-blue-100">
          <div className="grid gap-3">
            {category.items.map((item) => (
              <div key={item.id} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-teal-50 transition-colors">
                <div className="text-blue-500 mt-0.5">
                  {item.icon}
                </div>
                <span className="text-slate-700 text-sm leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant principal
const MissionIBR: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});


 const handleToggleCategory = (id: number) => {
  setExpanded(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-slate-800 mb-2">
            Missions d'IBR
          </h2>
        </div>

        {/* Statistiques Globales */}
        <GlobalStats />

        {/* Grille des missions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {missionData.map((category) => (
            <MissionCategoryCard 
  key={category.id} 
  category={category}
  isExpanded={!!expanded[category.id]}
  onToggle={handleToggleCategory}
/>

          ))}
        </div>
      </div>
    </div>
  );
};

export default MissionIBR;