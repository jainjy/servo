import React, { useState } from 'react';
import { Download, X, AlertCircle, CheckCircle } from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL de votre APK sur Google Drive (format direct)
  const apkUrl = "https://drive.google.com/uc?export=download&id=1Z1uI3OP6SzbeG6PDTe8D40c_aFcaEvSP";

  const handleDownload = () => {
    // Réinitialiser les états
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadComplete(false);
    setError(null);

    // Simuler la progression du téléchargement
    const progressInterval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsDownloading(false);
          setDownloadComplete(true);
          
          // Attendre 2 secondes avant de fermer automatiquement
          setTimeout(() => {
            onClose();
            setDownloadProgress(0);
            setDownloadComplete(false);
          }, 2000);
          
          return 100;
        }
        // Augmenter par 10-20% à chaque fois pour une progression réaliste
        return prev + Math.random() * 20 + 10;
      });
    }, 300);

    try {
      // Ouvrir dans un nouvel onglet
    //   const newWindow = window.open(apkUrl, '_blank', 'noopener,noreferrer');
      
    //   // Vérifier si l'ouverture a réussi
    //   if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback: ouvrir dans le même onglet si les popups sont bloqués
        window.location.href = apkUrl;
        
        // Afficher un message d'aide
        setError("Les popups sont peut-être bloqués. Le téléchargement a commencé dans cet onglet.");
    //   }
      
    } catch (err) {
      console.error("Erreur lors de l'ouverture:", err);
      setError("Impossible d'ouvrir le téléchargement. Veuillez réessayer.");
      clearInterval(progressInterval);
      setIsDownloading(false);
    }
  };

  // Fonction pour fermer et réinitialiser
  const handleClose = () => {
    onClose();
    setDownloadProgress(0);
    setIsDownloading(false);
    setDownloadComplete(false);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <>
  {/* Overlay */}
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
    onClick={handleClose}
  />

  {/* Modal */}
  <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl max-w-md w-full border border-gray-800 p-8 relative">
      
      {/* Bouton de fermeture */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Fermer"
      >
        <X className="w-5 h-5 text-gray-400 hover:text-white" />
      </button>

      {/* Icône et titre */}
      <div className="flex items-center justify-center mb-6">
        <img 
          src="/google.png" 
          alt="Google Play" 
          className="w-12 h-12 mr-3"
        />
        <div>
          <h2 className="text-xl font-bold text-white">Application en développement</h2>
          <p className="text-gray-400 text-sm">Merci de votre patience</p>
        </div>
      </div>

      {/* Message principal */}
      <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-sm font-semibold text-yellow-100">Nous travaillons activement sur Oliplus!</p>
      </div>

      {/* Prochaines étapes */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-300 mb-3">Ce qui arrive bientôt :</p>
        <ul className="text-xs text-gray-400 space-y-2 ml-4">
          <li><span className="text-blue-400 font-bold">✓</span> Interface améliorée</li>
          <li><span className="text-blue-400 font-bold">✓</span> Fonctionnalités avancées</li>
          <li><span className="text-blue-400 font-bold">✓</span> Performance optimisée</li>
          <li><span className="text-blue-400 font-bold">✓</span> Lancement officiel</li>
        </ul>
      </div>

      {/* Bouton d'action */}
      <button
        onClick={handleClose}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg"
      >
        OK, à bientôt! 👋
      </button>
    </div>
  </div>
</>

  );
};

export default ApkDownloadModal;