import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import api from "@/lib/api";

interface OeuvreModalProps {
  onClose: () => void;
  token: string;
  service?: any; // données du service pour la modification
}

const OeuvreModal: React.FC<OeuvreModalProps> = ({ onClose, token, service }) => {
  const [formData, setFormData] = useState({
    libelle: "",
    description: "",
    images: [] as File[],
    price: "",
    duration: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Pré-remplir le formulaire si on a un service (modification)
  useEffect(() => {
    if (service) {
      setFormData({
        libelle: service.libelle || "",
        description: service.description || "",
        images: [], // on ne récupère pas les fichiers existants, seulement nouvelles images
        price: service.price || "",
        duration: service.duration || "",
        categoryId: service.category?.id ? String(service.category.id) : "",
      });

      // Affichage des images existantes
      if (service.images && service.images.length > 0) {
        setPreviewImages(service.images);
      }
    }
  }, [service]);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api("/oeuvre/categories");
        if (!res.data) throw new Error("Erreur de chargement des catégories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        setMessage({ text: "Impossible de charger les catégories", type: "error" });
      }
    };
    fetchCategories();
  }, [token]);

  // Gestion des champs texte et fichiers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "images") {
      if (files && files.length > 0) {
        const filesArray = Array.from(files) as File[];
        setFormData((prev) => ({ ...prev, images: filesArray }));

        const fileNames = filesArray.map((file) => file.name);
        setPreviewImages(fileNames);
      } else {
        setFormData((prev) => ({ ...prev, images: [] }));
        setPreviewImages([]);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Soumission du formulaire (ajout ou modification)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.libelle || !formData.categoryId) {
      setMessage({ text: "Libellé et catégorie requis", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const uploadedImages: string[] = [];

      // Upload nouvelles images
      if (formData.images.length > 0) {
        for (let file of formData.images) {
          const formDataFile = new FormData();
          formDataFile.append("file", file);

          const resUpload = await api.post("/upload/image", formDataFile, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (!resUpload.data.url) throw new Error(resUpload.data.error || "Erreur upload");
          uploadedImages.push(resUpload.data.url);
        }
      }

      // Préparer le body
      const body = {
        libelle: formData.libelle,
        description: formData.description || "",
        price: formData.price || null,
        duration: formData.duration || null,
        categoryId: formData.categoryId,
        images: uploadedImages.length > 0 ? uploadedImages : previewImages, // conserver anciennes images si pas de nouvelles
      };

      if (service) {
        // Modification
        await api.put(`/oeuvre/${service.id}`, body);
        setMessage({ text: "Œuvre modifiée avec succès !", type: "success" });
      } else {
        // Ajout
        await api.post("/oeuvre/new", body);
        setMessage({ text: "Œuvre ajoutée avec succès !", type: "success" });
      }

      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || "Erreur serveur";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Suppression
  const handleDelete = async () => {
    if (!service) return;
    if (!window.confirm("Voulez-vous vraiment supprimer cette œuvre ?")) return;

    try {
      setLoading(true);
      await api.delete(`/oeuvre/${service.id}`);
      setMessage({ text: "Œuvre supprimée avec succès !", type: "success" });
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || "Erreur serveur";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-lg transition">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          {service ? "Modifier l'œuvre" : "Ajouter une œuvre"}
        </h2>

        {message && (
          <div
            className={`mb-4 p-2 rounded text-center ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="libelle" placeholder="Libellé" onChange={handleChange} value={formData.libelle} className="w-full border rounded-lg px-3 py-2" />
          <textarea name="description" placeholder="Description" onChange={handleChange} value={formData.description} className="w-full border rounded-lg px-3 py-2" />
          <input type="file" name="images" multiple accept="image/*" onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />

          {/* Aperçu des images */}
          <div className="flex gap-2 flex-wrap mt-2">
            {previewImages.map((name, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm border">
                {name}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <input type="number" name="price" placeholder="Prix (Ar)" onChange={handleChange} value={formData.price} className="w-full border rounded-lg px-3 py-2" />
            <input type="number" name="duration" placeholder="Durée (min)" onChange={handleChange} value={formData.duration} className="w-full border rounded-lg px-3 py-2" />
          </div>

          <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex justify-between mt-6">
            {service && (
              <button type="button" onClick={handleDelete} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg">
                Supprimer
              </button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Envoi en cours..." : service ? "Modifier" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OeuvreModal;
