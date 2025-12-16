import React, { useState, useRef } from 'react';
import { annonceAPI } from '../lib/api'; 
const AnnonceModal = ({ isOpen, onClose, onAddAnnonce }) => {
    const [newAnnonce, setNewAnnonce] = useState({
        title: "",
        price: "",
        city: "",
        surface: "",
        rooms: "",
        type: "appartement",
        listingType: "sale",
        description: "",
        address: ""
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAnnonce(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 10); // Max 10 images
        if (files.length > 0) {
            setImages(files);
            
            // Créer les previews des images
            const previews = [];
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previews.push(e.target.result);
                    if (previews.length === files.length) {
                        setImagePreviews(previews);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

   const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
};

// Remplacer onClose par cette fonction
const handleClose = () => {
    setNewAnnonce({
        title: "",
        price: "",
        city: "",
        surface: "",
        rooms: "",
        type: "appartement",
        listingType: "sale",
        description: "",
        address: ""
    });
    setImages([]);
    setImagePreviews([]);
    setError("");
    setLoading(false);
    onClose();
};

   const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Validation des champs requis
            if (!newAnnonce.title || !newAnnonce.city || !newAnnonce.type) {
                setError("Veuillez remplir les champs obligatoires : Titre, Ville et Type");
                setLoading(false);
                return;
            }

            // Préparer les données pour l'API
            const formData = new FormData();
            
            // Ajouter les champs du formulaire
            Object.keys(newAnnonce).forEach(key => {
                if (newAnnonce[key] !== "") {
                    formData.append(key, newAnnonce[key]);
                }
            });

            // Ajouter le statut par défaut requis par le serveur
            formData.append('status', 'pending');
            
            // Ajouter les images
            images.forEach((image, index) => {
                formData.append('images', image);
            });

            // console.log('📤 Envoi vers /api/anonce...');

            // UTILISATION DE LA NOUVELLE API
            const response = await annonceAPI.createAnnonce(formData);
            
            // console.log('✅ Annonce créée:', response.data);

            // Appeler la fonction parent pour ajouter l'annonce
            onAddAnnonce(response.data.property);
            
            // Réinitialiser le formulaire
            setNewAnnonce({
                title: "",
                price: "",
                city: "",
                surface: "",
                rooms: "",
                type: "appartement",
                listingType: "sale",
                description: "",
                address: ""
            });
            setImages([]);
            setImagePreviews([]);
            onClose();
            
        } catch (err) {
            console.error('Erreur création annonce:', err);
            setError(err.response?.data?.error || "Erreur lors de la création de l'annonce");
        } finally {
            setLoading(false);
        }
    };
 
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
       
    ).slice(0, 10);

    if (files.length > 0) {
        // ensure TypeScript knows these are File objects
        const fileList = files as File[];

        setImages(fileList);

        const previews: string[] = [];
        fileList.forEach((file: File) => {
        // runtime guard, though 'file' is already typed as File
        if (!(file instanceof Blob)) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
                previews.push(result);
            }
            if (previews.length === fileList.length) {
                setImagePreviews(previews);
            }
        };
        reader.readAsDataURL(file);
    });
}
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Nouvelle annonce immobilière
                    </h3>
                 <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Informations de base */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Titre */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Titre de l'annonce *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={newAnnonce.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="Ex: Bel appartement centre ville"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Type de bien */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Type de bien *
                            </label>
                            <select
                                name="type"
                                value={newAnnonce.type}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                required
                                disabled={loading}
                            >
                                <option value="appartement">Appartement</option>
                                <option value="maison">Maison / Villa</option>
                                <option value="villa">Villa</option>
                                <option value="studio">Studio</option>
                                <option value="terrain">Terrain</option>
                                <option value="commercial">Local commercial</option>
                                <option value="professionnel">Local professionnel</option>
                                <option value="fonds_de_commerce">Fonds de commerce</option>
                                <option value="appartements_neufs">Appartement neufs (VEFA)</option>
                                <option value="scpi">SCPI</option>
                                <option value="villa_d_exception">Villa d'exception</option>
                                <option value="villas_neuves">Villas neuves (VEFA)</option>
                                <option value="parking">Parking</option>
                                <option value="hotel">Hotel</option>
                                <option value="gite">Gite</option>
                                <option value="maison_d_hote">Maison d'hote</option>
                                <option value="domaine">Domaine</option>
                                <option value="appartement_meuble">Appartement meublée</option>
                                <option value="villa_meuble">Villa meublée</option>
                                <option value="villa_non_meuble">Villa non meublée</option>
                                <option value="cellier">Cellier</option>
                                <option value="cave">Cave</option>
                            </select>
                        </div>

                        {/* Type d'annonce */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                Type d'annonce
                            </label>
                            <select
                                name="listingType"
                                value={newAnnonce.listingType}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                disabled={loading}
                            >
                                <option value="sale">Vente</option>
                                <option value="rent">Location</option>
                            </select>
                        </div>

                        {/* Prix */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prix {newAnnonce.listingType === 'rent' ? '(€/mois)' : '(€)'}
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={newAnnonce.price}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="Ex: 250000"
                                disabled={loading}
                            />
                        </div>

                        {/* Surface */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Surface (m²)
                            </label>
                            <input
                                type="number"
                                name="surface"
                                value={newAnnonce.surface}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="Ex: 75"
                                disabled={loading}
                            />
                        </div>

                    </div>

                   
                    {/* Localisation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Ville 
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={newAnnonce.city}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="Ex: Paris"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pièces
                            </label>
                            <input
                                type="number"
                                name="rooms"
                                value={newAnnonce.rooms}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="Ex: 3"
                                disabled={loading}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse ( Lieux )
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={newAnnonce.address}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="Ex: 123 Rue de la République"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={newAnnonce.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Décrivez votre bien en détail..."
                            disabled={loading}
                        />
                    </div>

                    
                    {/* Upload d'images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Images
                        </label>
                        
                        {imagePreviews.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img 
                                            src={preview} 
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                            disabled={loading}
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-gray-600 mb-2">
                                Cliquez ou glissez-déposez les images du bien
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, JPEG jusqu'à 10MB - Maximum 10 images
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Création...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Publier l'annonce
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnnonceModal;