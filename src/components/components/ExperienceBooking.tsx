import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TourismNavigation from "@/components/TourismNavigation"; // Ajustez si nécessaire
import { useAuth } from '@/hooks/useAuth';

const ExperienceBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/experiences/${id}`);
        if (response.data.success) {
          setExperience(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching experience:', err);
        navigate('/sejour-experience');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExperience();
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/sejour-experience/' + id + '/book');
    }
  }, [user, id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/experiences/${id}/book`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Réservation créée avec succès !');
        navigate('/mon-compte/reservation');
      }
    } catch (err: any) {
      console.error('Error creating booking:', err);
      alert(err.response?.data?.error || 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (!experience) return 0;
    return experience.price * bookingData.guests;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Expérience non trouvée</h3>
          <button
            onClick={() => navigate('/sejour-experience')}
            className="bg-logo text-white px-6 py-3 rounded-lg hover:bg-logo/90"
          >
            Retour aux expériences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TourismNavigation page="sejour" />
      
      <div className="pt-24 max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/sejour-experience/${id}`)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux détails
          </button>
        </div>

        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Réserver : {experience.title}</h1>
          <p className="text-gray-600">{experience.location}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos informations de réservation</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Dates du séjour
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Date d'arrivée</label>
                      <input
                        type="date"
                        required
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Date de départ</label>
                      <input
                        type="date"
                        required
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo focus:border-transparent"
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                {/* Nombre de personnes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nombre de personnes
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setBookingData({...bookingData, guests: Math.max(1, bookingData.guests - 1)})}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xl font-medium w-8 text-center">{bookingData.guests}</span>
                    <button
                      type="button"
                      onClick={() => setBookingData({...bookingData, guests: bookingData.guests + 1})}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-600 ml-4">Maximum : {experience.groupSize}</span>
                  </div>
                </div>

                {/* Demandes spéciales */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Demandes spéciales (optionnel)
                  </label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo focus:border-transparent"
                    rows={4}
                    placeholder="Allergies, préférences alimentaires, besoins spécifiques..."
                  />
                </div>

                {/* Informations personnelles (si non connecté) */}
                {!user && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Vos informations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Prénom</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Nom</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="votre@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Téléphone</label>
                        <input
                          type="tel"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="06 12 34 56 78"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-logo text-white font-semibold py-4 px-6 rounded-xl hover:bg-logo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Traitement en cours...' : 'Confirmer la réservation'}
                </button>
              </form>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h3>
              
              {/* Expérience */}
              <div className="flex items-start space-x-4 mb-6 pb-6 border-b">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={experience.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{experience.title}</h4>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{experience.location}</span>
                  </div>
                </div>
              </div>

              {/* Détails */}
              <div className="space-y-4 mb-6 pb-6 border-b">
                {bookingData.checkIn && bookingData.checkOut && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dates</span>
                    <span className="font-medium">
                      {new Date(bookingData.checkIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {new Date(bookingData.checkOut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Personnes</span>
                  <span className="font-medium">{bookingData.guests} personne{bookingData.guests > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Prix */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{formatPrice(experience.price)} × {bookingData.guests}</span>
                  <span>{formatPrice(experience.price * bookingData.guests)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">TVA incluse</p>
                </div>
              </div>

              {/* Conditions */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Annulation gratuite jusqu'à 30 jours avant le début</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Paiement 100% sécurisé</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Confirmation immédiate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceBooking;