// components/FormateurTabContent.tsx
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, Euro, MapPin, BookOpen, LogIn } from "lucide-react";
import { CourseService } from "@/services/courseService";
import { ReservationCoursService, ReservationCoursData } from "@/services/reservationCoursService";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  professionalId: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  professional?: {
    id: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    avatar?: string;
    city?: string;
  };
  availabilities: Availability[];
}

interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

interface CourseCardProps {
  course: Course;
  onBookCourse?: (course: Course) => void;
  isUserConnected?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onBookCourse,
  isUserConnected = false
}) => {
  const formatTime = (time: string) => time ? time.substring(0, 5) : '';
  
  const getDayName = (dayIndex: number) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[dayIndex] || '';
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookCourse?.(course);
  };

  return (
    <Card className="border-2 p-6 hover:shadow-lg transition-all duration-300 border-gray-200 hover:-translate-y-1">
      {/* En-tête avec image */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {course.imageUrl ? (
            <div className="h-20 w-20 rounded-full ring-2 ring-black/50 grid place-items-center overflow-hidden">
              <img src={course.imageUrl} alt={course.title} className="w-16 h-16 object-cover" />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-full ring-2 ring-black/50 grid place-items-center bg-gray-100">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                <Badge variant="secondary" className="mb-2">
                  {course.category}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">{course.description}</p>
            
            {/* Informations du professionnel */}
            {course.professional && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <User className="w-4 h-4" />
                <span>
                  {course.professional.firstName} {course.professional.lastName}
                  {course.professional.companyName && ` - ${course.professional.companyName}`}
                </span>
                {course.professional.city && (
                  <>
                    <MapPin className="w-4 h-4 ml-2" />
                    <span>{course.professional.city}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Détails du cours */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Euro className="w-4 h-4 text-green-600" />
          <div>
            <div className="font-semibold text-green-600">{course.price}€</div>
            <div className="text-gray-500 text-xs">/{course.priceUnit}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <div>
            <div className="font-semibold">{course.durationMinutes} min</div>
            <div className="text-gray-500 text-xs">Durée</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-purple-600" />
          <div>
            <div className="font-semibold">Max {course.maxParticipants}</div>
            <div className="text-gray-500 text-xs">Participants</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${course.materialsIncluded ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div>
            <div className="font-semibold">{course.materialsIncluded ? 'Fourni' : 'Non fourni'}</div>
            <div className="text-gray-500 text-xs">Matériel</div>
          </div>
        </div>
      </div>

      {/* Disponibilités */}
      {course.availabilities && course.availabilities.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 text-sm mb-2">Disponibilités :</h4>
          <div className="flex flex-wrap gap-2">
            {course.availabilities.slice(0, 3).map((avail, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {getDayName(avail.dayOfWeek)} {formatTime(avail.startTime)}-{formatTime(avail.endTime)}
                {avail.isRecurring && ' 🔁'}
              </Badge>
            ))}
            {course.availabilities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{course.availabilities.length - 3} autres
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Niveau */}
      <div className="mb-4">
        <Badge variant={course.level === "Débutant" ? "default" : course.level === "Intermédiaire" ? "secondary" : "destructive"}>
          Niveau: {course.level}
        </Badge>
      </div>

      {/* Bouton de réservation */}
      {isUserConnected ? (
        <Button
          onClick={handleBook}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Réserver ce cours
        </Button>
      ) : (
        <Button
          onClick={handleBook}
          variant="outline"
          className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold py-3"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Se connecter pour réserver
        </Button>
      )}
    </Card>
  );
};

interface FormateurTabContentProps {
  onSelectCourse?: (course: Course) => void;
  selectedCourse?: Course | null;
}

const FormateurTabContent: React.FC<FormateurTabContentProps> = ({ 
  onSelectCourse, 
  selectedCourse 
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedCourseForBooking, setSelectedCourseForBooking] = useState<Course | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await CourseService.getCourses();
      if (response.data.success) {
        setCourses(response.data.data);
      } else {
        setError('Erreur lors du chargement des cours');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  const handleBookCourse = (course: Course) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour réserver un cours');
      navigate('/login', { 
        state: { 
          from: '/bien-etre',
          message: 'Connectez-vous pour réserver ce cours'
        } 
      });
      return;
    }
    
    setSelectedCourseForBooking(course);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedCourseForBooking || !user) return;

    setBookingLoading(true);
    try {
      const reservationData: ReservationCoursData = {
        courseId: selectedCourseForBooking.id,
        professionalId: selectedCourseForBooking.professionalId,
        userId: user.id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        date: new Date().toISOString().split('T')[0],
        participants: 1,
        totalPrice: selectedCourseForBooking.price,
        status: 'en_attente',
        notes: '',
        courseTitle: selectedCourseForBooking.title,
        professionalName: `${selectedCourseForBooking.professional?.firstName} ${selectedCourseForBooking.professional?.lastName}`
      };

      const response = await ReservationCoursService.createReservation(reservationData);
      
      if (response.success) {
        alert('✅ Réservation effectuée avec succès !');
        setBookingModalOpen(false);
        setSelectedCourseForBooking(null);
        
        // Recharger les cours pour mettre à jour les disponibilités
        loadCourses();
      } else {
        alert('❌ Erreur lors de la réservation');
      }
    } catch (error) {
      console.error('Erreur réservation:', error);
      alert('❌ Erreur lors de la réservation');
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.category === filter;
  });

  const categories = [...new Set(courses.map(course => course.category))];

  if (loading) {
    return (
      <div className="mb-20">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-20">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">❌ {error}</div>
          <Button onClick={loadCourses} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-20">
      <div className="mb-12">
        <h2 className="text-2xl lg:text-3xl mb-4 font-bold text-slate-900 dark:text-foreground">
          Découvrez nos cours à domicile
        </h2>
        <p className="text-gray-700 dark:text-muted-foreground mb-8 text-base lg:text-md leading-relaxed max-w-3xl">
          Des formations personnalisées dans le confort de votre maison. Nos experts se déplacent chez vous avec tout le matériel nécessaire pour des séances adaptées à vos objectifs et votre emploi du temps.
        </p>
        
        {/* Indication de statut de connexion 
        {isAuthenticated && user && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 text-sm">
              ✅ Connecté en tant que <strong>{user.firstName} {user.lastName}</strong> ({user.email})
            </p>
          </div>
        )}*/}
      </div>

      {/* Filtres */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={filter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilter('all')}
          >
            Tous les cours
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilter(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Résultats */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredCourses.length} cours disponible{filteredCourses.length > 1 ? 's' : ''}
          {filter !== 'all' && ` dans la catégorie "${filter}"`}
        </p>
      </div>

      {/* Liste des cours */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun cours disponible</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "Aucun cours n'est disponible pour le moment." 
              : `Aucun cours disponible dans la catégorie "${filter}".`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onBookCourse={handleBookCourse}
              isUserConnected={isAuthenticated}
            />
          ))}
        </div>
      )}

      {/* Modal de réservation */}
      {bookingModalOpen && selectedCourseForBooking && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Confirmer la réservation</h3>
                  <p className="text-gray-600 mt-2">{selectedCourseForBooking.title}</p>
                </div>
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
                  disabled={bookingLoading}
                >
                  ×
                </button>
              </div>

              {/* Informations utilisateur */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">Vos informations</h4>
                <div className="text-sm text-blue-800">
                  <p><strong>Nom:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix:</span>
                  <span className="font-semibold">{selectedCourseForBooking.price}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-semibold">{selectedCourseForBooking.durationMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Formateur:</span>
                  <span className="font-semibold">
                    {selectedCourseForBooking.professional?.firstName} {selectedCourseForBooking.professional?.lastName}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Réservation...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Confirmer la réservation
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setBookingModalOpen(false)}
                  variant="outline"
                  disabled={bookingLoading}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormateurTabContent;