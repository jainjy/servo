import { FC, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarIcon, MessageCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewService } from "@/services/reviewService";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

// Définition du thème
const theme = {
  logo: "#556B2F",           
  primaryDark: "#6B8E23",   
  lightBg: "#FFFFFF",       
  separator: "#D3D3D3",     
  secondaryText: "#8B4513", 
};

// Types pour les avis
interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    companyName: string;
    avatar: string;
    email: string;
  };
  service?: {
    id: number;
    libelle: string;
    category: {
      name: string;
    };
  };
  metadata?: {
    professionalResponse?: string;
    responseDate?: string;
  };
}

interface ReviewsData {
  reviews: Review[];
  statistics: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Array<{
      stars: number;
      count: number;
      percentage: number;
    }>;
  };
  badges: string[];
}

const ReviewsPage: FC = () => {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getMyReviews();
      setReviewsData(data);
    } catch (error) {
      console.error("Erreur chargement avis:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les avis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) return;

    try {
      setSubmitting(true);
      await reviewService.respondToReview(reviewId, responseText);

      toast({
        title: "Succès",
        description: "Votre réponse a été publiée",
      });

      setRespondingTo(null);
      setResponseText("");
      await loadReviews();
    } catch (error) {
      console.error("Erreur envoi réponse:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la réponse",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getClientName = (review: Review) => {
    if (review.user.firstName && review.user.lastName) {
      return `${review.user.firstName} ${review.user.lastName}`;
    }
    return review.user.companyName || "Client";
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!reviewsData) {
    return (
      <div className="container mx-auto p-6" style={{ backgroundColor: theme.lightBg }}>
        <Card style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}>
          <CardContent className="pt-6">
            <p className="text-center" style={{ color: theme.secondaryText }}>
              Impossible de charger les avis
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { reviews, statistics, badges } = reviewsData;

  return (
    <div className="container mx-auto p-2 lg:p-0 space-y-6" style={{ backgroundColor: theme.lightBg }}>
      <h1 className="text-lg lg:text-3xl font-bold mb-6" style={{ color: theme.logo }}>
        Avis & Réputation
      </h1>

      {/* Résumé des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}>
          <CardHeader>
            <CardTitle className="text-md lg:text-xl" style={{ color: theme.logo }}>
              Note moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-4xl font-bold" style={{ color: theme.logo }}>
                {statistics.averageRating}
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-5 h-5"
                    style={{
                      color: i < Math.floor(statistics.averageRating) ? "#FBBF24" : theme.separator,
                      fill: i < Math.floor(statistics.averageRating) ? "#FBBF24" : "transparent"
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm mt-2" style={{ color: theme.secondaryText }}>
              Basé sur {statistics.totalReviews} avis
            </p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}>
          <CardHeader>
            <CardTitle className="text-md lg:text-xl" style={{ color: theme.logo }}>
              Distribution des notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statistics.ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-2">
                  <span className="w-8 text-sm" style={{ color: theme.secondaryText }}>
                    {dist.stars}★
                  </span>
                  <Progress 
                    value={dist.percentage} 
                    className="h-2 flex-1 custom-progress-filled"
                    style={{ 
                      backgroundColor: `${theme.separator}40`,
                    }}
                  />
                  <span className="text-sm w-12 text-right" style={{ color: theme.secondaryText }}>
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}>
          <CardHeader>
            <CardTitle className="text-md lg:text-xl" style={{ color: theme.logo }}>
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  style={{ 
                    backgroundColor: `${theme.primaryDark}10`,
                    color: theme.primaryDark,
                    borderColor: theme.separator
                  }}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des avis */}
      <Card style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}>
        <CardHeader>
          <CardTitle style={{ color: theme.logo }}>Avis Clients</CardTitle>
          <CardDescription style={{ color: theme.secondaryText }}>
            Gérez et répondez aux avis de vos clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-center py-8" style={{ color: theme.secondaryText }}>
              Aucun avis pour le moment
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b pb-6 last:border-0"
                  style={{ borderColor: theme.separator }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold" style={{ color: theme.logo }}>
                        {getClientName(review)}
                      </h3>
                      {review.service && (
                        <p className="text-sm" style={{ color: theme.secondaryText }}>
                          Service: {review.service.libelle}
                        </p>
                      )}
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className="w-4 h-4"
                            style={{
                              color: i < review.rating ? "#FBBF24" : theme.separator,
                              fill: i < review.rating ? "#FBBF24" : "transparent"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm" style={{ color: theme.secondaryText }}>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  <p className="mb-3" style={{ color: theme.secondaryText }}>{review.comment}</p>

                  {review.metadata?.professionalResponse && (
                    <div 
                      className="p-3 rounded-md mt-2 border"
                      style={{ 
                        backgroundColor: `${theme.primaryDark}10`,
                        borderColor: theme.separator
                      }}
                    >
                      <p className="text-sm font-semibold flex items-center gap-1" style={{ color: theme.primaryDark }}>
                        <MessageCircle className="w-4 h-4" />
                        Votre réponse:
                      </p>
                      <p className="text-sm mt-1" style={{ color: theme.secondaryText }}>
                        {review.metadata.professionalResponse}
                      </p>
                      {review.metadata.responseDate && (
                        <p className="text-xs mt-1" style={{ color: theme.secondaryText }}>
                          Le {formatDate(review.metadata.responseDate)}
                        </p>
                      )}
                    </div>
                  )}

                  {!review.metadata?.professionalResponse && (
                    <div className="mt-3">
                      {respondingTo === review.id ? (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Votre réponse à cet avis..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={3}
                            style={{
                              borderColor: theme.separator,
                              backgroundColor: theme.lightBg,
                              color: theme.secondaryText
                            }}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRespond(review.id)}
                              disabled={submitting || !responseText.trim()}
                              size="sm"
                              style={{ 
                                backgroundColor: theme.primaryDark,
                                color: "white"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#556B2F";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme.primaryDark;
                              }}
                            >
                              {submitting && (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              )}
                              Publier la réponse
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setRespondingTo(null);
                                setResponseText("");
                              }}
                              size="sm"
                              disabled={submitting}
                              style={{ 
                                borderColor: theme.separator,
                                color: theme.secondaryText
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${theme.separator}20`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRespondingTo(review.id)}
                          className="flex items-center gap-1"
                          style={{ 
                            borderColor: theme.separator,
                            color: theme.secondaryText
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${theme.separator}20`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Répondre à cet avis
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsPage;
