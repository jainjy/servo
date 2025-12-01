import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Clock, TrendingUp, Home, Package, Wrench, Building, Zap } from 'lucide-react';
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

interface Suggestion {
  text: string;
  type: 'history' | 'trending' | 'popular' | 'property' | 'product' | 'service' | 'metier' | 'current';
  category?: string;
  count?: number;
  date?: number;
}

interface AutoSuggestInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const AutoSuggestInput: React.FC<AutoSuggestInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Rechercher...",
  disabled = false
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Récupérer l'historique local
  const getLocalHistory = (): Suggestion[] => {
    try {
      const raw = localStorage.getItem("hero-search-history");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) 
        ? parsed.map((item: any) => ({
            text: item.q,
            type: 'history',
            date: item.date
          })).slice(0, 10)
        : [];
    } catch {
      return [];
    }
  };

  // Charger les tendances au démarrage
  useEffect(() => {
    if (value.length === 0) {
      loadTrendingSuggestions();
    }
  }, []);

  const loadTrendingSuggestions = async () => {
    try {
      const response = await api.get('/suggestions/trending?limit=8');
      
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        const trendingSuggestions: Suggestion[] = response.data.suggestions.map((item: any) => ({
          text: item.text || item.query,
          type: 'trending',
          count: item.count
        }));
        
        // Mélanger avec l'historique local
        const history = getLocalHistory().slice(0, 4);
        const combined = [...trendingSuggestions, ...history]
          .slice(0, 10);
        
        setSuggestions(combined);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Erreur chargement tendances:", error);
    }
  };

  // Récupérer les suggestions depuis l'API
  const fetchSuggestions = useCallback(async (query: string) => {
    // Pour les requêtes vides, montrer tendances + historique
    if (query.length === 0) {
      const history = getLocalHistory();
      const trending = await loadTrendingSuggestions();
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/suggestions', {
        query,
        userId: localStorage.getItem("user-id") || undefined,
        limit: 12
      });

      const allSuggestions: Suggestion[] = [];

      // Ajouter la requête actuelle
      allSuggestions.push({
        text: query,
        type: 'current'
      });

      // Ajouter les suggestions de la base de données
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        allSuggestions.push(...response.data.suggestions);
      }

      // Ajouter l'historique local pertinent
      const history = getLocalHistory();
      const relevantHistory = history.filter(suggestion => 
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3);
      
      allSuggestions.push(...relevantHistory);

      // Limiter et afficher
      const limitedSuggestions = allSuggestions.slice(0, 10);
      setSuggestions(limitedSuggestions);
      
    } catch (error) {
      console.error("Erreur suggestions:", error);
      
      // Fallback: historique local
      const history = getLocalHistory();
      const filteredHistory = history.filter(suggestion => 
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      
      setSuggestions([
        {
          text: query,
          type: 'current'
        },
        ...filteredHistory.slice(0, 5)
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce pour éviter trop d'appels API
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (value.length > 0) {
        fetchSuggestions(value);
      } else {
        loadTrendingSuggestions();
      }
    }, 200);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value, fetchSuggestions]);

  // Gérer les clics en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const selectedSuggestion = suggestions[selectedIndex];
          onChange(selectedSuggestion.text);
          onSearch(selectedSuggestion.text);
          setShowSuggestions(false);
        } else {
          onSearch(value);
          setShowSuggestions(false);
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      
      case 'Tab':
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          const selectedSuggestion = suggestions[selectedIndex];
          onChange(selectedSuggestion.text);
          setShowSuggestions(false);
        }
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onChange(suggestion.text);
    onSearch(suggestion.text);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const getIconForType = (type: Suggestion['type']) => {
    switch (type) {
      case 'history':
        return <Clock className="h-4 w-4" />;
      case 'trending':
      case 'popular':
        return <TrendingUp className="h-4 w-4" />;
      case 'property':
        return <Home className="h-4 w-4" />;
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'service':
        return <Wrench className="h-4 w-4" />;
      case 'metier':
        return <Building className="h-4 w-4" />;
      case 'current':
        return <Search className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: Suggestion['type']) => {
    switch (type) {
      case 'history':
        return 'Historique';
      case 'trending':
        return 'Tendance';
      case 'popular':
        return 'Populaire';
      case 'property':
        return 'Immobilier';
      case 'product':
        return 'Produit';
      case 'service':
        return 'Service';
      case 'metier':
        return 'Métier';
      case 'current':
        return 'Rechercher';
      default:
        return 'Suggestion';
    }
  };

  const getTypeColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'history':
        return 'bg-blue-100 text-blue-700';
      case 'trending':
        return 'bg-orange-100 text-orange-700';
      case 'popular':
        return 'bg-green-100 text-green-700';
      case 'property':
        return 'bg-purple-100 text-purple-700';
      case 'product':
        return 'bg-pink-100 text-pink-700';
      case 'service':
        return 'bg-teal-100 text-teal-700';
      case 'metier':
        return 'bg-indigo-100 text-indigo-700';
      case 'current':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            onChange(newValue);
            setSelectedIndex(-1);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-10 pr-12 h-12 text-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
          autoComplete="off"
        />
        
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="p-3 border-b bg-gray-50 sticky top-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {value.length === 0 ? 'Tendances et historique' : 'Suggestions'}
              </span>
              <span className="text-xs text-gray-500">
                {suggestions.length} résultats
              </span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.text}-${index}-${suggestion.type}`}
                className={`w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 ${
                  index === selectedIndex ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className={`p-2 rounded-lg ${getTypeColor(suggestion.type)}`}>
                  {getIconForType(suggestion.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-left truncate">
                    {suggestion.text}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(suggestion.type)}`}>
                      {getTypeLabel(suggestion.type)}
                    </span>
                    {suggestion.count && (
                      <span className="text-xs text-gray-500">
                        {suggestion.count} recherches
                      </span>
                    )}
                    {suggestion.category && (
                      <span className="text-xs text-gray-500">
                        {suggestion.category}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-2 border-t bg-gray-50 text-xs text-gray-500 sticky bottom-0">
            <div className="flex items-center justify-between">
              <span>↑↓ Naviguer • ↵ Sélectionner • Esc Fermer</span>
              <span>Données en direct</span>
            </div>
          </div>
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && value.length >= 2 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-gray-500 text-center">
            Aucune suggestion trouvée dans la base de données.
          </p>
        </div>
      )}
    </div>
  );
};