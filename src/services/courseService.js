// services/courseService.js
import api from '../lib/api';

export const coursesAPI = {
  // Récupérer tous les cours actifs
  getCourses: (params = {}) => api.get('/courses', { params }),
  
  // Récupérer les cours d'un professionnel
  getProfessionalCourses: (professionalId, params = {}) => 
    api.get(`/courses/professional/${professionalId}`, { params }),
  
  // Créer un nouveau cours
  createCourse: (formData) => 
    api.post('/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // Mettre à jour un cours
  updateCourse: (id, formData) => 
    api.put(`/courses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // Supprimer un cours (soft delete)
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  
  // Récupérer les catégories
  getCategories: () => api.get('/courses/categories'),

  // Réserver un cours
  bookCourse: (courseId, bookingData) => 
    api.post(`/courses/${courseId}/book`, bookingData),
};

export const CourseService = {
  getCourses: (params = {}) => coursesAPI.getCourses(params),
  getProfessionalCourses: (professionalId, params = {}) => 
    coursesAPI.getProfessionalCourses(professionalId, params),
  createCourse: (formData) => coursesAPI.createCourse(formData),
  updateCourse: (id, formData) => coursesAPI.updateCourse(id, formData),
  deleteCourse: (id) => coursesAPI.deleteCourse(id),
  getCategories: () => coursesAPI.getCategories(),
  bookCourse: (courseId, bookingData) => coursesAPI.bookCourse(courseId, bookingData),
};