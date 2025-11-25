// pages/pro/CourseForm.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CourseService } from '../../services/courseService';

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {COURSE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre du cours *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ex: Cours de pâtisserie française"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Décrivez votre cours en détail..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Tarifs et durée */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix (€) *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unité de prix
          </label>
          <select
            value={formData.priceUnit}
            onChange={(e) => handleInputChange('priceUnit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {PRICE_UNITS.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durée (min) *
          </label>
          <input
            type="number"
            value={formData.durationMinutes}
            onChange={(e) => handleInputChange('durationMinutes', e.target.value)}
            placeholder="120"
            min="30"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Participants max *
          </label>
          <input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
            placeholder="5"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-6">
          <label className="text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
            Disponibilités *
          </label>
          <button
            type="button"
            onClick={addAvailability}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            + Ajouter
          </button>
        </div>

        {availabilities.length === 0 ? (
          <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-sm">Aucune disponibilité ajoutée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availabilities.map((availability, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Disponibilité {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeAvailability(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <select
                    value={availability.dayOfWeek}
                    onChange={(e) => updateAvailability(index, 'dayOfWeek', parseInt(e.target.value))}
                    className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    {DAYS_OF_WEEK.map((day, dayIndex) => (
                      <option key={day} value={dayIndex}>{day}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={availability.startTime}
                    onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                    className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={availability.endTime}
                    onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                    className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={availability.isRecurring}
                    onChange={(e) => updateAvailability(index, 'isRecurring', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-600">Répétition hebdomadaire</label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image du cours
        </label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Aperçu"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview('');
                setFormData(prev => ({ ...prev, imageFile: null }));
              }}
              className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm"
            >
              ×
            </button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <span className="text-blue-600 font-medium text-sm">
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
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Sauvegarde..." : (course ? "Modifier" : "Ajouter")}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;