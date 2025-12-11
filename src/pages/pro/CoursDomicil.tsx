// pages/pro/CoursDomicile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CourseService } from '../../services/courseService';
import CoursForm from './CoursForm';
import { BookOpen, Users, TrendingUp, Plus, Edit, Trash2, CheckCircle, XCircle, Clock, DollarSign, Award } from 'lucide-react';

// Types
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
    documents?: any;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    availabilities: Availability[];
}

interface Availability {
    id: string;
    courseId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
}
// Définition du thème exactement comme spécifié
const theme = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
};

const CoursDomicile: React.FC = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            loadCourses();
        }
    }, [isAuthenticated, user]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const response = await CourseService.getProfessionalCourses(user.id);
            if (response.data.success) {
                setCourses(response.data.data);
            } else {
                showNotification('error', 'Erreur lors du chargement des cours');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showNotification('error', 'Erreur lors du chargement des cours');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddCourse = () => {
        setSelectedCourse(null);
        setShowModal(true);
    };

    const handleEditCourse = (course: Course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    const handleSuccess = () => {
        setShowModal(false);
        setSelectedCourse(null);
        loadCourses();
        showNotification('success', selectedCourse ? 'Cours modifié avec succès !' : 'Cours créé avec succès !');
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedCourse(null);
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
            try {
                const response = await CourseService.deleteCourse(courseId);
                if (response.data.success) {
                    setCourses(courses.filter(course => course.id !== courseId));
                    showNotification('success', 'Cours supprimé avec succès');
                } else {
                    showNotification('error', 'Erreur lors de la suppression du cours');
                }
            } catch (error) {
                console.error('Erreur:', error);
                showNotification('error', 'Erreur lors de la suppression du cours');
            }
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.lightBg }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.primaryDark }}></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.lightBg }}>
                <div className="text-center p-8 rounded-2xl" style={{ 
                    backgroundColor: theme.lightBg, 
                    border: `1px solid ${theme.separator}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: theme.logo }}>Authentification requise</h2>
                    <p style={{ color: theme.secondaryText }}>Veuillez vous connecter pour gérer vos cours à domicile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: theme.lightBg }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl" style={{ backgroundColor: `${theme.primaryDark}15` }}>
                                    <BookOpen size={24} style={{ color: theme.primaryDark }} />
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-4xl font-bold" style={{ color: theme.logo }}>
                                        Gestion des Cours à Domicile
                                    </h1>
                                    <p className="mt-1 text-lg" style={{ color: theme.secondaryText }}>
                                        Créez et gérez vos cours proposés à domicile
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleAddCourse}
                            className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 hover:shadow-md"
                            style={{ 
                                backgroundColor: theme.primaryDark,
                                color: "white"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme.logo;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme.primaryDark;
                            }}
                        >
                            <Plus size={20} />
                            Nouveau Cours
                        </button>
                    </div>
                </div>

                {/* Notification */}
                {notification && (
                    <div
                        className={`mb-8 p-4 rounded-lg flex items-center gap-3 ${notification.type === 'success'
                            ? 'border border-green-200 bg-green-50 text-green-800'
                            : 'border border-red-200 bg-red-50 text-red-800'
                            }`}
                    >
                        {notification.type === 'success' ? (
                            <CheckCircle size={20} />
                        ) : (
                            <XCircle size={20} />
                        )}
                        <span className="font-medium">{notification.message}</span>
                    </div>
                )}

                {/* Statistiques */}
                {courses.length > 0 && (
                    <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl" 
                             style={{ 
                                 backgroundColor: theme.lightBg, 
                                 border: `1px solid ${theme.separator}`,
                                 boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                             }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.primaryDark}10` }}>
                                    <BookOpen size={24} style={{ color: theme.primaryDark }} />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold" style={{ color: theme.logo }}>{courses.length}</div>
                                    <div className="text-sm mt-1" style={{ color: theme.secondaryText }}>Cours au total</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 rounded-xl"
                             style={{ 
                                 backgroundColor: theme.lightBg, 
                                 border: `1px solid ${theme.separator}`,
                                 boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                             }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.logo}10` }}>
                                    <TrendingUp size={24} style={{ color: theme.logo }} />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold" style={{ color: theme.logo }}>
                                        {courses.filter(course => course.isActive).length}
                                    </div>
                                    <div className="text-sm mt-1" style={{ color: theme.secondaryText }}>Cours actifs</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 rounded-xl"
                             style={{ 
                                 backgroundColor: theme.lightBg, 
                                 border: `1px solid ${theme.separator}`,
                                 boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                             }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.secondaryText}10` }}>
                                    <Award size={24} style={{ color: theme.secondaryText }} />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold" style={{ color: theme.logo }}>
                                        {new Set(courses.map(course => course.category)).size}
                                    </div>
                                    <div className="text-sm mt-1" style={{ color: theme.secondaryText }}>Catégories</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Liste des cours */}
                {loading ? (
                    <div className="text-center flex flex-col items-center justify-center py-20 rounded-xl"
                         style={{ 
                             backgroundColor: theme.lightBg, 
                             border: `1px solid ${theme.separator}`
                         }}>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 mb-4" style={{ borderColor: theme.primaryDark }}></div>
                        <p className="text-xl font-semibold mt-4" style={{ color: theme.logo }}>
                            Chargement de vos cours...
                        </p>
                        <p className="text-sm mt-2" style={{ color: theme.secondaryText }}>
                            Nous préparons votre espace d'enseignement
                        </p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-16 rounded-xl"
                         style={{ 
                             backgroundColor: theme.lightBg, 
                             border: `1px solid ${theme.separator}`
                         }}>
                        <div className="text-6xl mb-6" style={{ color: theme.secondaryText }}>📚</div>
                        <h3 className="text-2xl font-semibold mb-3" style={{ color: theme.logo }}>
                            Vous n'avez pas encore de cours
                        </h3>
                        <p className="mb-8 max-w-md mx-auto" style={{ color: theme.secondaryText }}>
                            Créez votre premier cours à domicile pour commencer à partager vos compétences
                        </p>
                        <button
                            onClick={handleAddCourse}
                            className="px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
                            style={{ 
                                backgroundColor: theme.primaryDark,
                                color: "white"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme.logo;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme.primaryDark;
                            }}
                        >
                            Créer mon premier cours
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold" style={{ color: theme.logo }}>
                                Mes Cours <span className="text-lg font-normal ml-2" style={{ color: theme.secondaryText }}>({courses.length})</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map(course => (
                                <div key={course.id} 
                                     className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
                                     style={{ 
                                        backgroundColor: theme.lightBg,
                                        border: `1px solid ${theme.separator}`
                                     }}>
                                    {/* En-tête avec image */}
                                    <div className="relative h-48 overflow-hidden">
                                        {course.imageUrl ? (
                                            <img
                                                src={course.imageUrl}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center" 
                                                 style={{ backgroundColor: `${theme.separator}30` }}>
                                                <BookOpen size={48} style={{ color: theme.secondaryText }} />
                                            </div>
                                        )}
                                        
                                        {/* Badges */}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                                  style={{ backgroundColor: theme.primaryDark }}>
                                                {course.category}
                                            </span>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            {course.isActive ? (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                                      style={{ backgroundColor: '#10B981' }}>
                                                    Actif
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                                      style={{ backgroundColor: theme.secondaryText }}>
                                                    Inactif
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg mb-2 line-clamp-1"
                                            style={{ color: theme.logo }}>
                                            {course.title}
                                        </h3>

                                        {course.description && (
                                            <p className="text-sm mb-4 line-clamp-2" style={{ color: theme.secondaryText }}>
                                                {course.description}
                                            </p>
                                        )}

                                        {/* Détails du cours */}
                                        <div className="space-y-3 mb-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm" style={{ color: theme.secondaryText }}>
                                                    <DollarSign size={14} />
                                                    <span>Prix :</span>
                                                </div>
                                                <span className="font-semibold" style={{ color: '#16A34A' }}>
                                                    {course.price}€ / {course.priceUnit}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm" style={{ color: theme.secondaryText }}>
                                                    <Clock size={14} />
                                                    <span>Durée :</span>
                                                </div>
                                                <span style={{ color: theme.secondaryText }}>{course.durationMinutes} min</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm" style={{ color: theme.secondaryText }}>
                                                    <Users size={14} />
                                                    <span>Participants :</span>
                                                </div>
                                                <span style={{ color: theme.secondaryText }}>Max {course.maxParticipants}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t" style={{ borderColor: theme.separator }}>
                                            <button
                                                onClick={() => handleEditCourse(course)}
                                                className="flex-1 py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                style={{ 
                                                    backgroundColor: `${theme.primaryDark}10`,
                                                    color: theme.primaryDark
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = `${theme.primaryDark}20`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = `${theme.primaryDark}10`;
                                                }}
                                            >
                                                <Edit size={14} />
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCourse(course.id)}
                                                className="flex-1 py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                style={{ 
                                                    backgroundColor: `${theme.secondaryText}10`,
                                                    color: theme.secondaryText
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = `${theme.secondaryText}20`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = `${theme.secondaryText}10`;
                                                }}
                                            >
                                                <Trash2 size={14} />
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modal pour ajouter/modifier un cours */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                             style={{ backgroundColor: theme.lightBg }}>
                            <div className="p-6 border-b" style={{ borderColor: theme.separator }}>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold" style={{ color: theme.logo }}>
                                        {selectedCourse ? 'Modifier le cours' : 'Ajouter un nouveau cours'}
                                    </h2>
                                    <button
                                        onClick={handleCancel}
                                        className="p-2 rounded hover:bg-gray-100 transition-colors"
                                        style={{ color: theme.secondaryText }}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <CoursForm
                                    course={selectedCourse}
                                    onSuccess={handleSuccess}
                                    onCancel={handleCancel}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};



export default CoursDomicile;