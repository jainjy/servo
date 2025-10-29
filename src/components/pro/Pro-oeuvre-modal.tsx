import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import api from "@/lib/api"
interface OeuvreModalProps {
  onClose: () => void;
  token: string;
}

const OeuvreModal: React.FC<OeuvreModalProps> = ({ onClose, token }) => {
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

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Erreur de chargement des catégories");
        const data = await res.json();
        setCategories(data);
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

        // Afficher juste les noms des fichiers
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

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.libelle || !formData.categoryId) {
      setMessage({ text: "Libellé et catégorie requis", type: "error" });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Upload images
      const uploadedImages: string[] = [];
      if (formData.images.length > 0) {
        for (let file of formData.images) {
          const formDataFile = new FormData();
          formDataFile.append("file", file);

          const resUpload = await api.post("/upload/image", formDataFile, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const dataUpload = resUpload.data;
          if (!dataUpload.url) throw new Error(dataUpload.error || "Erreur upload");

          uploadedImages.push(dataUpload.url);
        }
      }

      // Envoi des données vers /oeuvre
      const body = {
        libelle: formData.libelle,
        description: formData.description || "",
        price: formData.price || null,
        duration: formData.duration || null,
        categoryId: formData.categoryId,
        images: uploadedImages,
      };

      console.log("body", body);

      // Une seule requête POST, avec gestion d'erreur
      const res = await api.post("/oeuvre/new", body);

      setMessage({ text: "Œuvre ajoutée avec succès !", type: "success" });
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error("Erreur lors de l'opération :", err);

      // Si c'est un AxiosError, vous pouvez détailler
      const errorMsg = err.response?.data?.message || err.message || "Erreur serveur";
      setMessage({ text: errorMsg, type: "error" });

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Ajouter une œuvre</h2>

        {message && (
          <div
            className={`mb-4 p-2 rounded text-center ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="libelle"
            placeholder="Libellé"
            onChange={handleChange}
            value={formData.libelle}
            className="w-full border rounded-lg px-3 py-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            value={formData.description}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Affichage noms fichiers */}
          <div className="flex gap-2 flex-wrap mt-2">
            {previewImages.map((name, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm border">
                {name}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <input
              type="number"
              name="price"
              placeholder="Prix (Ar)"
              onChange={handleChange}
              value={formData.price}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              name="duration"
              placeholder="Durée (min)"
              onChange={handleChange}
              value={formData.duration}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "Envoi en cours..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OeuvreModal;
