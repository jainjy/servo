import { FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Types pour les avis
interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
  isModerated: boolean;
}

// Données mockées pour l'exemple
const mockReviews: Review[] = [
  {
    id: "1",
    clientName: "Jean Dupont",
    rating: 5,
    comment: "Excellent service, très professionnel !",
    date: "2025-10-05",
    isModerated: true,
  },
  {
    id: "2",
    clientName: "Marie Martin",
    rating: 4,
    comment: "Bon travail, délais respectés.",
    date: "2025-10-03",
    response: "Merci pour votre confiance !",
    isModerated: true,
  },
];

const ReviewsPage: FC = () => {
  const averageRating = 4.5;
  const totalReviews = 245;
  const ratingDistribution = [
    { stars: 5, count: 150 },
    { stars: 4, count: 60 },
    { stars: 3, count: 20 },
    { stars: 2, count: 10 },
    { stars: 1, count: 5 },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Avis & Réputation</h1>

      {/* Résumé des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Note moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-4xl font-bold">{averageRating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Basé sur {totalReviews} avis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution des notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-2">
                  <span className="w-8">{dist.stars}★</span>
                  <Progress
                    value={(dist.count / totalReviews) * 100}
                    className="h-2"
                  />
                  <span className="text-sm text-gray-500">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Pro Certifié</Badge>
              <Badge variant="secondary">Excellence Service</Badge>
              <Badge variant="secondary">Réponse Rapide</Badge>
              <Badge variant="secondary">Top Prestataire 2025</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des avis */}
      <Card>
        <CardHeader>
          <CardTitle>Avis Clients</CardTitle>
          <CardDescription>
            Gérez et répondez aux avis de vos clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{review.clientName}</h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                {review.response && (
                  <div className="bg-gray-50 p-3 rounded-md mt-2">
                    <p className="text-sm font-semibold">Votre réponse:</p>
                    <p className="text-sm text-gray-600">{review.response}</p>
                  </div>
                )}
                {!review.response && (
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Répondre à cet avis
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsPage;
