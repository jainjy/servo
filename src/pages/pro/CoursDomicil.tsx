// pages/pro/CoursDomicile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CourseService } from '../../services/courseService';
import CoursForm from './CoursForm';

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentification requise</h2>
                    <p className="text-gray-600">Veuillez vous connecter pour gérer vos cours à domicile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gestion des Cours à Domicile</h1>
                            <p className="mt-2 text-gray-600">
                                Créez et gérez vos cours proposés à domicile
                            </p>
                        </div>
                        <button
                            onClick={handleAddCourse}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <span>+</span>
                            Nouveau Cours
                        </button>
                    </div>
                </div>

                {/* Notification */}
                {notification && (
                    <div
                        className={`mb-6 p-4 rounded-lg ${notification.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {notification.type === 'success' ? '✅' : '❌'} {notification.message}
                        </div>
                    </div>
                )}
                {/* Statistiques */}
                {courses.length > 0 && (
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                            <div className="text-3xl font-bold text-blue-600">{courses.length}</div>
                            <div className="text-gray-600 mt-2">Cours au total</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                            <div className="text-3xl font-bold text-green-600">
                                {courses.filter(course => course.isActive).length}
                            </div>
                            <div className="text-gray-600 mt-2">Cours actifs</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                            <div className="text-3xl font-bold text-purple-600">
                                {new Set(courses.map(course => course.category)).size}
                            </div>
                            <div className="text-gray-600 mt-2">Catégories</div>
                        </div>
                    </div>
                )}
                {/* Liste des cours */}
                {loading ? (
                    
                    <div className="text-center flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl">
                    <img src="/loading.gif" alt="" className='w-24 h-24'/>
                        <p className="mt-4 text-xl font-semibold text-gray-700">
                            Chargement de vos cours...
                        </p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Vous n'avez pas encore de cours
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Créez votre premier cours à domicile pour commencer à partager vos compétences
                        </p>
                        <button
                            onClick={handleAddCourse}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            Créer mon premier cours
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Mes Cours ({courses.length})
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map(course => (
                                <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    {/* En-tête avec image */}
                                    <div className="relative">
                                        {course.imageUrl && (
                                            <img
                                                src={course.imageUrl}
                                                alt={course.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                                {course.category}
                                            </span>
                                        </div>
                                        {!course.isActive && (
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                    Inactif
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contenu */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                                            {course.title}
                                        </h3>

                                        {course.description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {course.description}
                                            </p>
                                        )}

                                        {/* Détails du cours */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Prix :</span>
                                                <span className="font-semibold text-green-600">
                                                    {course.price}€ / {course.priceUnit}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Durée :</span>
                                                <span>{course.durationMinutes} min</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Participants :</span>
                                                <span>Max {course.maxParticipants}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                                            <button
                                                onClick={() => handleEditCourse(course)}
                                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm font-medium transition-colors"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCourse(course.id)}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                                            >
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
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {selectedCourse ? 'Modifier le cours' : 'Ajouter un nouveau cours'}
                                    </h2>
                                    <button
                                        onClick={handleCancel}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
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