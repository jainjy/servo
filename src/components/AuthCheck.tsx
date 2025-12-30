// src/components/AuthCheck.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthCheck = ({ children, requiredRole = 'professional' }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      // Vérifier le rôle si nécessaire
      if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        navigate('/unauthorized');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate, requiredRole]);

  return children;
};