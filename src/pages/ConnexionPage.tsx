// src/pages/ConnexionPage.tsx
import { useNavigate, useLocation } from 'react-router-dom';

const ConnexionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer le paramètre redirect de l'URL
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';
  
  const handleLoginSuccess = () => {
    navigate(redirect);
  };
  
  return (
    <div>
      {/* Votre formulaire de connexion */}
      <button onClick={handleLoginSuccess}>Se connecter</button>
    </div>
  );
};
