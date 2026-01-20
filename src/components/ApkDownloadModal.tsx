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
  const apkUrl = "https://drive.google.com/file/d/1VdBjLRd97wMThSaXxUtHn-rb5_HICGRz/view?usp=drive_link";

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

      {/* Modal - Mode Paysage */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-800 relative overflow-hidden">
          
          {/* Effet de fond animé */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10"></div>

          {/* Bouton de fermeture */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200 group"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>

          {/* Contenu - Grille 2 colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            
            {/* Colonne Gauche - Visuels et Infos */}
            <div className="flex flex-col justify-center">
              
              {/* En-tête */}
              <div className="mb-4 lg:mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-green-500/30 mb-0 lg:mb-4">
                  <img 
                    src="/google.png" 
                    alt="Icône Google Play" 
                    className='lg:w-16 lg:h-16 h-8 w-8'
                  />
                </div>
                <h2 className="text-lg lg:text-2xl font-bold text-white mb-2">Télécharger Oliplus</h2>
                <p className="text-gray-400 text-sm lg:text-lg">Application immobilière mobile</p>
              </div>

              {/* Informations sur l'application */}
              <div className="space-y-3 bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Version 1.0.0</p>
                    <p className="text-xs text-gray-400">Dernière mise à jour: Décembre 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Taille: ~77 MB</p>
                    <p className="text-xs text-gray-400">Stockage requis: 100 MB</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Android 6.0+</p>
                    <p className="text-xs text-gray-400">Compatible avec tous les appareils</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite - Actions et Instructions */}
            <div className="flex flex-col pt-0 lg:pt-10">
              
              {/* Message d'erreur */}
              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-100">{error}</p>
                </div>
              )}

              {/* Barre de progression */}
              {isDownloading && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">Ouverture du téléchargement...</p>
                    <span className="text-sm text-green-500 font-semibold">{Math.round(downloadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300 ease-out shadow-lg shadow-green-500/50"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Un nouvel onglet devrait s'ouvrir automatiquement
                  </p>
                </div>
              )}

              {/* Message de succès */}
              {downloadComplete && (
                <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-100 font-medium">Téléchargement lancé avec succès! ✅</p>
                    <p className="text-xs text-green-200/80 mt-1">
                      Vérifiez votre nouvel onglet pour suivre le téléchargement
                    </p>
                  </div>
                </div>
              )}

              

              {/* Instructions supplémentaires - Format compact */}
              <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <p className="text-xs font-semibold text-gray-300 mb-3">📱 Étapes d'installation :</p>
                <ol className="text-xs text-gray-400 space-y-1 ml-3">
                  <li><span className="text-green-400 font-bold">1.</span> Téléchargement dans un nouvel onglet</li>
                  <li><span className="text-green-400 font-bold">2.</span> Ouvrez "Téléchargements"</li>
                  <li><span className="text-green-400 font-bold">3.</span> Appuyez sur "Oliplus.apk"</li>
                  <li><span className="text-green-400 font-bold">4.</span> Confirmez l'installation</li>
                </ol>
                
                {/* Note sur les popups */}
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <p className="text-xs text-amber-400">
                    💡 <span className="font-semibold">Si rien ne s'ouvre :</span> Vérifiez les popups bloqués
                  </p>
                </div>
              </div>

              {/* Boutons d'action - Côte à côte */}
              <div className="flex gap-3 mb-4 mt-5">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-green-500/30 hover:shadow-green-500/50 relative overflow-hidden"
                >
                  {/* Effet de fond au survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  
                  <Download className="w-5 h-5 group-hover:animate-bounce relative z-10" />
                  <span className="relative z-10">Télécharger</span>
                </button>
                
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 border border-gray-700 hover:border-gray-600"
                >
                  Annuler
                </button>
              </div>

              {/* Aide rapide */}
              <div className="mt-3 text-center">
                <button
                  onClick={() => window.open(apkUrl, '_blank')}
                  className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                >
                  Lien direct si le bouton ne fonctionne pas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApkDownloadModal;