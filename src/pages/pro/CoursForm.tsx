// pages/pro/CourseForm.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CourseService } from '../../services/courseService';

// Définition du thème
const theme = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
};

// Types
interface CourseFormData {
  category: string;
  title: string;
  description: string;
  price: string;
  priceUnit: string;
  durationMinutes: string;
  maxParticipants: string;
  materialsIncluded: boolean;
  level: string;
  imageFile: File | null;
}

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

interface Course {
  id: string;
  category: string;
  title: string;
  description?: string;
  price: number;
  priceUnit: string;
  durationMinutes: number;
  maxParticipants: number;
  materialsIncluded: boolean;
  level: string;
  imageUrl?: string;
  availabilities: Availability[];
}

interface CourseFormProps {
  course?: Course | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Données constantes
const COURSE_CATEGORIES = [
  "Cuisine", "Décoration", "Bricolage", "Jardinage", "Feng Shui",
  "Recyclage Créatif", "Domotique", "Design & Aménagement", "Musique",
  "Sport & Fitness", "Soutien Scolaire Enfant", "Atelier Enfant", "Atelier Adulte"
];

const LEVELS = ["Débutant", "Intermédiaire", "Avancé", "Tous niveaux"];
const PRICE_UNITS = ["session", "heure", "mois", "forfait"];
const DAYS_OF_WEEK = [
  "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
];

const CourseForm: React.FC<CourseFormProps> = ({ course, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CourseFormData>({
    category: '',
    title: '',
    description: '',
    price: '',
    priceUnit: 'session',
    durationMinutes: '60',
    maxParticipants: '1',
    materialsIncluded: false,
    level: 'Tous niveaux',
    imageFile: null
  });

  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  // Initialiser le formulaire avec les données du cours en mode édition
  useEffect(() => {
    if (course) {
      setFormData({
        category: course.category || '',
        title: course.title || '',
        description: course.description || '',
        price: course.price?.toString() || '',
        priceUnit: course.priceUnit || 'session',
        durationMinutes: course.durationMinutes?.toString() || '60',
        maxParticipants: course.maxParticipants?.toString() || '1',
        materialsIncluded: course.materialsIncluded || false,
        level: course.level || 'Tous niveaux',
        imageFile: null
      });
      setAvailabilities(course.availabilities || []);
      setImagePreview(course.imageUrl || '');
    }
  }, [course]);

  const handleInputChange = (field: keyof CourseFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 5MB");
        return;
      }
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addAvailability = () => {
    setAvailabilities(prev => [...prev, {
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      isRecurring: true
    }]);
  };

  const updateAvailability = (index: number, field: keyof Availability, value: any) => {
    setAvailabilities(prev =>
      prev.map((avail, i) => i === index ? { ...avail, [field]: value } : avail)
    );
  };

  const removeAvailability = (index: number) => {
    setAvailabilities(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!formData.category || !formData.title || !formData.price) {
      setError("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setError("Le prix doit être un nombre positif");
      return false;
    }
    if (availabilities.length === 0) {
      setError("Veuillez ajouter au moins une disponibilité");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('professionalId', user.id);

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'imageFile' && value !== null) {
          if (key === 'durationMinutes' || key === 'maxParticipants') {
            formDataToSend.append(key, parseInt(value as string).toString());
          } else if (key === 'price') {
            formDataToSend.append(key, parseFloat(value as string).toString());
          } else if (key === 'materialsIncluded') {
            formDataToSend.append(key, value.toString());
          } else {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      formDataToSend.append('availabilities', JSON.stringify(availabilities));

      let response;
      if (course) {
        response = await CourseService.updateCourse(course.id, formDataToSend);
      } else {
        response = await CourseService.createCourse(formDataToSend);
      }

      if (response.data.success) {
        onSuccess();
      } else {
        throw new Error(response.data.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="border rounded-lg p-4" style={{ 
          backgroundColor: `${theme.secondaryText}10`,
          borderColor: theme.separator 
        }}>
          <p style={{ color: theme.secondaryText }}>{error}</p>
        </div>
      )}

      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
            Catégorie *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            style={{ 
              borderColor: theme.separator,
              backgroundColor: theme.lightBg,
              color: theme.logo 
            }}
            required
          >
            <option value="" style={{ color: theme.secondaryText }}>Sélectionnez une catégorie</option>
            {COURSE_CATEGORIES.map(category => (
              <option key={category} value={category} style={{ color: theme.logo }}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
            Titre du cours *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ex: Cours de pâtisserie française"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            style={{ 
              borderColor: theme.separator,
              backgroundColor: theme.lightBg,
              color: theme.logo 
            }}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Décrivez votre cours en détail..."
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
          style={{ 
            borderColor: theme.separator,
            backgroundColor: theme.lightBg,
            color: theme.logo 
          }}
        />
      </div>

      {/* Tarifs et durée */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
            Prix (€) *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            style={{ 
              borderColor: theme.separator,
              backgroundColor: theme.lightBg,
              color: theme.logo 
            }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
            Unité de prix
          </label>
          <select
            value={formData.priceUnit}
            onChange={(e) => handleInputChange('priceUnit', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            style={{ 
              borderColor: theme.separator,
              backgroundColor: theme.lightBg,
              color: theme.logo 
            }}
          >
            {PRICE_UNITS.map(unit => (
              <option key={unit} value={unit} style={{ color: theme.logo }}>{unit}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
            Durée (min) *
          </label>
          <input
            type="number"
            value={formData.durationMinutes}
            onChange={(e) => handleInputChange('durationMinutes', e.target.value)}
            placeholder="120"
            min="30"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            style={{ 
              borderColor: theme.separator,
              backgroundColor: theme.lightBg,
              color: theme.logo 
            }}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
            Participants max *
          </label>
          <input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
            placeholder="5"
            min="1"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            style={{ 
              borderColor: theme.separator,
              backgroundColor: theme.lightBg,
              color: theme.logo 
            }}
            required
          />
        </div>

        <div className="flex items-center justify-between pt-6">
          <label className="text-sm font-medium" style={{ color: theme.secondaryText }}>
            Matériel fourni
          </label>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={formData.materialsIncluded}
              onChange={(e) => handleInputChange('materialsIncluded', e.target.checked)}
              className="sr-only"
            />
            <div className={`block w-12 h-6 rounded-full transition-colors ${
              formData.materialsIncluded ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
              formData.materialsIncluded ? 'transform translate-x-6' : ''
            }`}></div>
          </div>
        </div>
      </div>

      {/* Disponibilités */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium" style={{ color: theme.secondaryText }}>
            Disponibilités *
          </label>
          <button
            type="button"
            onClick={addAvailability}
            className="px-3 py-1 rounded text-sm font-medium transition-colors"
            style={{ 
              backgroundColor: `${theme.separator}40`,
              color: theme.secondaryText
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.separator}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.separator}40`;
            }}
          >
            + Ajouter
          </button>
        </div>

        {availabilities.length === 0 ? (
          <div className="text-center py-4 border-2 border-dashed rounded-lg" style={{ 
            borderColor: theme.separator,
            backgroundColor: `${theme.separator}10`
          }}>
            <p className="text-sm" style={{ color: theme.secondaryText }}>Aucune disponibilité ajoutée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availabilities.map((availability, index) => (
              <div key={index} className="p-3 rounded-lg border" style={{ 
                backgroundColor: `${theme.separator}10`,
                borderColor: theme.separator
              }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: theme.logo }}>Disponibilité {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeAvailability(index)}
                    className="text-sm"
                    style={{ color: theme.secondaryText }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#DC2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = theme.secondaryText;
                    }}
                  >
                    Supprimer
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <select
                    value={availability.dayOfWeek}
                    onChange={(e) => updateAvailability(index, 'dayOfWeek', parseInt(e.target.value))}
                    className="text-sm px-2 py-1 border rounded focus:ring-1 focus:border-blue-500"
                    style={{ 
                      borderColor: theme.separator,
                      backgroundColor: theme.lightBg,
                      color: theme.logo 
                    }}
                  >
                    {DAYS_OF_WEEK.map((day, dayIndex) => (
                      <option key={day} value={dayIndex} style={{ color: theme.logo }}>{day}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={availability.startTime}
                    onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                    className="text-sm px-2 py-1 border rounded focus:ring-1 focus:border-blue-500"
                    style={{ 
                      borderColor: theme.separator,
                      backgroundColor: theme.lightBg,
                      color: theme.logo 
                    }}
                  />
                  <input
                    type="time"
                    value={availability.endTime}
                    onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                    className="text-sm px-2 py-1 border rounded focus:ring-1 focus:border-blue-500"
                    style={{ 
                      borderColor: theme.separator,
                      backgroundColor: theme.lightBg,
                      color: theme.logo 
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={availability.isRecurring}
                    onChange={(e) => updateAvailability(index, 'isRecurring', e.target.checked)}
                    className="rounded"
                    style={{ 
                      borderColor: theme.separator,
                      color: theme.primaryDark 
                    }}
                  />
                  <label className="text-sm" style={{ color: theme.secondaryText }}>Répétition hebdomadaire</label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
          Image du cours
        </label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Aperçu"
              className="w-32 h-32 object-cover rounded-lg"
              style={{ border: `1px solid ${theme.separator}` }}
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview('');
                setFormData(prev => ({ ...prev, imageFile: null }));
              }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-sm"
              style={{ 
                backgroundColor: theme.secondaryText,
                color: "white"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#6B240B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.secondaryText;
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <div className="border-2 border-dashed rounded-lg p-4 text-center transition-colors"
                 style={{ 
                    borderColor: theme.separator,
                    backgroundColor: `${theme.separator}10`
                 }}
                 onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.primaryDark;
                 }}
                 onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.separator;
                 }}>
              <span className="font-medium text-sm" style={{ color: theme.primaryDark }}>
                Cliquer pour uploader une image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </label>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: theme.separator }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border rounded-lg transition-colors disabled:opacity-50"
          style={{ 
            borderColor: theme.separator,
            color: theme.secondaryText,
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.separator}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          style={{ 
            backgroundColor: isSubmitting ? `${theme.primaryDark}80` : theme.primaryDark,
            color: "white"
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = theme.logo;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = theme.primaryDark;
            }
          }}
        >
          {isSubmitting ? "Sauvegarde..." : (course ? "Modifier" : "Ajouter")}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;