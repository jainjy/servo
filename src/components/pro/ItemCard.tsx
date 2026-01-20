import React from 'react';
import { MapPin, Euro, Edit, Trash2 } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
}

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border" style={{ borderColor: '#D3D3D3' }}>
      {/* Image principale */}
      {item.images.length > 0 ? (
        <div className="relative h-48">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x300?text=Image';
            }}
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => onEdit(item)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              style={{ color: '#556B2F' }}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              style={{ color: '#8B4513' }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center" style={{ backgroundColor: '#6B8E23' }}>
          <p className="text-white">Pas d'image</p>
        </div>
      )}

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 truncate" style={{ color: '#8B4513' }}>
          {item.title}
        </h3>
        
        <p className="text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1" style={{ color: '#556B2F' }}>
            <Euro className="w-4 h-4" />
            <span className="font-bold">{item.price.toFixed(2)} €</span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{item.location}</span>
          </div>
        </div>

        {/* Miniatures des images */}
        {item.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pt-3 border-t" style={{ borderColor: '#D3D3D3' }}>
            {item.images.slice(1).map((image, index) => (
              <div key={index} className="w-12 h-12 flex-shrink-0">
                <img
                  src={image}
                  alt={`${item.title} ${index + 2}`}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/50?text=Img';
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;