// components/FormateurTabContent.tsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, Euro, MapPin, BookOpen, LogIn, X } from "lucide-react";
import { CourseService } from "@/services/courseService";
import { ReservationCoursService, ReservationCoursData } from "@/services/reservationCoursService";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
    <Card className="border p-4 hover:shadow-md transition-all duration-300 border-gray-200 hover:-translate-y-0.5">
      {/* En-tête avec image */}
      <div className="flex items-start gap-3 mb-3">
        {course.imageUrl ? (
          <div className="h-14 w-14 rounded-full ring-1 ring-black/30 grid place-items-center overflow-hidden flex-shrink-0">
            <img src={course.imageUrl} alt={course.title} className="w-12 h-12 object-cover" />
          </div>
        ) : (
          <div className="h-14 w-14 rounded-full ring-1 ring-black/30 grid place-items-center bg-gray-100 flex-shrink-0">
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="text-sm lg:text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
              <Badge variant="secondary" className="mb-2 text-xs">
                {course.category}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{course.description}</p>

          {/* Informations du professionnel */}
          {course.professional && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <User className="w-3 h-3" />
              <span className="truncate">
                {course.professional.firstName} {course.professional.lastName}
                {course.professional.companyName && ` - ${course.professional.companyName}`}
              </span>
              {course.professional.city && (
                <>
                  <MapPin className="w-3 h-3 ml-1" />
                  <span className="truncate">{course.professional.city}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Détails du cours - Version mobile compacte */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
        <div className="flex items-center gap-1">
          <Euro className="w-3 h-3 text-green-600" />
          <div>
            <div className="font-semibold text-green-600">{course.price}€</div>
            <div className="text-gray-400">/{course.priceUnit}</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-blue-600" />
          <div>
            <div className="font-semibold">{course.durationMinutes}min</div>
            <div className="text-gray-400">Durée</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <User className="w-3 h-3 text-purple-600" />
          <div>
            <div className="font-semibold">Max {course.maxParticipants}</div>
            <div className="text-gray-400">Pers.</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className={`w-3 h-3 rounded-full ${course.materialsIncluded ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div>
            <div className="font-semibold">{course.materialsIncluded ? 'Fourni' : 'Apporter'}</div>
            <div className="text-gray-400">Matériel</div>
          </div>
        </div>
      </div>

      {/* Disponibilités */}
      {course.availabilities && course.availabilities.length > 0 && (
        <div className="mb-3">
          <h4 className="font-medium text-gray-700 text-xs mb-1">Disponibilités :</h4>
          <div className="flex flex-wrap gap-1">
            {course.availabilities.slice(0, 2).map((avail, index) => (
              <Badge key={index} variant="outline" className="text-[10px] px-1.5 py-0">
                {getDayName(avail.dayOfWeek).substring(0, 3)} {formatTime(avail.startTime).replace(':', 'h')}
              </Badge>
            ))}
            {course.availabilities.length > 2 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                +{course.availabilities.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Niveau */}
      <div className="mb-3">
        <Badge
          variant={course.level === "Débutant" ? "default" : course.level === "Intermédiaire" ? "secondary" : "destructive"}
          className="text-xs"
        >
          {course.level}
        </Badge>
      </div>

      {/* Bouton de réservation */}
      <div className="w-full">
        {isUserConnected ? (
          <Button
            onClick={handleBook}
            className="w-full bg-slate-900 hover:bg-slate-700 text-white font-semibold py-2 text-sm"
            size="sm"
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Réserver
          </Button>
        ) : (
          <Button
            onClick={handleBook}
            variant="outline"
            className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold py-2 text-sm"
            size="sm"
          >
            <LogIn className="w-3 h-3 mr-1" />
            Se connecter
          </Button>
        )}
      </div>
    </Card>
  );
};

interface FormateurTabContentProps {
  onSelectCourse?: (course: Course) => void;
  selectedCourse?: Course | null;
}

// Composant Modal Portal séparé
const BookingModalPortal: React.FC<{
  isOpen: boolean;
  course: Course | null;
  user: any;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, course, user, isLoading, onClose, onConfirm }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !course || !user) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 lg:left-1/3 transform -translate-y-1/2  z-[1000] w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Confirmer la réservation</h3>
                    <p className="text-gray-600 mt-2">{course.title}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors flex-shrink-0"
                    disabled={isLoading}
                  >
                    <X className="h-6 w-6" />
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
                    <span className="font-semibold">{course.price}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-semibold">{course.durationMinutes} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Formateur:</span>
                    <span className="font-semibold">
                      {course.professional?.firstName} {course.professional?.lastName}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Réservation...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Confirmer
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
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
    <>
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
          <div className="flex flex-wrap lg:grid grid-cols-7 gap-y-1 lg:gap-4">
            <Badge
              variant={filter === 'all' ? 'default' : 'outline'}
              className="cursor-pointer py-2 lg:py-4 mx-0 lg:mx-auto"
              onClick={() => setFilter('all')}
            >
              Tous les cours
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={filter === category ? 'default' : 'outline'}
                className="cursor-pointer py-4 text-center mx-auto"
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

      </div>

      {/* Modal de réservation - Portal */}
      <BookingModalPortal
        isOpen={bookingModalOpen}
        course={selectedCourseForBooking}
        user={user}
        isLoading={bookingLoading}
        onClose={() => setBookingModalOpen(false)}
        onConfirm={handleConfirmBooking}
      />
    </>
  );
};

export default FormateurTabContent;