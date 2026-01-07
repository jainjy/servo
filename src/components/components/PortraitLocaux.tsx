// pages/PortraitsLocaux.jsx (version mise à jour avec API)
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TourismNavigation from "../TourismNavigation";
import api from "../../lib/api";

const PortraitsLocaux = () => {
  const [activeGeneration, setActiveGeneration] = useState("tous");
  const [selectedPortrait, setSelectedPortrait] = useState(null);
  const [playingStory, setPlayingStory] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const commentRef = useRef(null);
  const queryClient = useQueryClient();

  // Générations
  const generations = [
    { id: "tous", label: "Toutes les générations" },
    { id: "anciens", label: "Anciens (70+ ans)" },
    { id: "actuels", label: "Actuels (30-69 ans)" },
    { id: "jeunes", label: "Jeunes (18-29 ans)" },
  ];

  // Récupérer les portraits
  const { data: portraitsData, isLoading: portraitsLoading } = useQuery({
    queryKey: ["portraits", activeGeneration],
    queryFn: async () => {
      const url =
        activeGeneration === "tous"
          ? "/portraits"
          : `/portraits?generation=${activeGeneration}`;
      const response = await api.get(url);
      return response.data.data;
    },
  });

  // Récupérer les statistiques
  const { data: statsData } = useQuery({
    queryKey: ["portraitStats"],
    queryFn: async () => {
      const response = await api.get("/portraits/stats");
      return response.data.data;
    },
  });

  // Récupérer un portrait spécifique
  const { data: selectedPortraitData, refetch: refetchSelectedPortrait } =
    useQuery({
      queryKey: ["portrait", selectedPortrait],
      queryFn: async () => {
        if (!selectedPortrait) return null;
        const response = await api.get(`/portraits/${selectedPortrait}`);
        return response.data.data;
      },
      enabled: !!selectedPortrait,
    });

  // Mutation pour ajouter un commentaire
  const addCommentMutation = useMutation({
    mutationFn: async ({ portraitId, content, parentId }) => {
      const response = await api.post(`/portraits/${portraitId}/comments`, {
        content,
        parentId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["portrait", selectedPortrait]);
      setNewComment("");
      setReplyTo(null);
    },
  });

  // Mutation pour liker un commentaire
  const likeCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const response = await api.post(`/portraits/comments/${commentId}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["portrait", selectedPortrait]);
    },
  });

  // Mutation pour enregistrer un partage
  const recordShareMutation = useMutation({
    mutationFn: async ({ portraitId, platform }) => {
      const response = await api.post(`/portraits/${portraitId}/share`, {
        platform,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["portraits"]);
      queryClient.invalidateQueries(["portrait", selectedPortrait]);
    },
  });

  // Mutation pour enregistrer une écoute
  const recordListenMutation = useMutation({
    mutationFn: async ({ portraitId, duration, completed }) => {
      const response = await api.post(`/portraits/${portraitId}/listen`, {
        duration,
        completed,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["portraits"]);
      queryClient.invalidateQueries(["portrait", selectedPortrait]);
    },
  });

  // Citation du jour
  const dailyQuoteIndex = useMemo(() => {
    if (!portraitsData?.length) return 0;
    return Math.floor(Math.random() * portraitsData.length);
  }, [portraitsData]);

  const [quoteRotation, setQuoteRotation] = useState(0);

  // Animation de la citation
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteRotation((prev) => (prev + 2) % 360);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animation du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Effet de texture papier vieilli
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 1 + Math.random() * 3;
        const alpha = 0.05 + Math.sin(time + i) * 0.03;

        ctx.fillStyle = `rgba(120, 53, 15, ${alpha})`;
        ctx.fillRect(x, y, size, size);
      }

      // Lignes organiques
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const y = canvas.height * 0.2 + i * 40;
        const frequency = 0.01 + i * 0.005;
        const amplitude = 10 + i * 3;

        ctx.moveTo(0, y);
        for (let x = 0; x < canvas.width; x += 5) {
          const waveY = y + Math.sin(x * frequency + time) * amplitude;
          ctx.lineTo(x, waveY);
        }
      }
      ctx.strokeStyle = `rgba(139, 195, 74, 0.1)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      time += 0.02;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Gestion de l'audio
  const handleStoryPlay = async (portrait) => {
    if (playingStory === portrait.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingStory(null);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setPlayingStory(portrait.id);
      setStoryProgress(0);

      // Simuler le chargement
      setTimeout(() => {
        if (audioRef.current && portrait.interviewAudioUrl) {
          audioRef.current.src = portrait.interviewAudioUrl;
          audioRef.current.play();

          // Enregistrer le début de l'écoute
          recordListenMutation.mutate({
            portraitId: portrait.id,
            duration: 0,
            completed: false,
          });
        }
      }, 100);
    }
  };

  // Suivre la progression de l'audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setStoryProgress(progress);
    };

    const handleEnded = () => {
      if (playingStory) {
        // Enregistrer l'écoute complète
        recordListenMutation.mutate({
          portraitId: playingStory,
          duration: Math.floor(audio.duration),
          completed: true,
        });
      }
      setPlayingStory(null);
      setStoryProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playingStory]);

  // Gestion des partages sociaux
  const handleSocialShare = async (platform, portrait) => {
    // Enregistrer le partage
    recordShareMutation.mutate({
      portraitId: portrait.id,
      platform,
    });

    // Message de partage
    const message = `Découvrez l'histoire inspirante de ${portrait.name}, ${portrait.age} ans, ${portrait.profession} à ${portrait.location}. #PortraitsLocaux #${portrait.country}`;
    const url = window.location.href;

    let shareUrl;
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          message
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `${message} ${url}`
        )}`;
        break;
      default:
        shareUrl = url;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  // Gestion des commentaires
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPortrait) return;

    addCommentMutation.mutate({
      portraitId: selectedPortrait,
      content: newComment,
      parentId: replyTo,
    });

    // Scroll vers les commentaires
    if (commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    setNewComment("");
    // Focus sur le champ de commentaire
    const commentInput = document.getElementById("comment-input");
    if (commentInput) {
      commentInput.focus();
    }
  };

  const handleLikeComment = (commentId) => {
    likeCommentMutation.mutate(commentId);
  };

  // Composant Carte Portrait
  const PortraitCard = ({ portrait }) => {
    const isSelected = selectedPortrait === portrait.id;
    const isListeningStory = playingStory === portrait.id;

    return (
      <div
        className={`relative bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl border-2 ${
          isSelected
            ? `border-${portrait.color}-500 scale-[1.02]`
            : "border-transparent"
        }`}
        onClick={() => setSelectedPortrait(portrait.id)}
      >
        {/* Photo principale */}
        <div className="relative h-64 p-2 overflow-hidden">
          <img
            src={
              portrait.images[0]
                ? `${portrait.images[0]}?auto=format&fit=crop&w=800&h=400&q=80`
                : "/placeholder.jpg"
            }
            alt={portrait.name}
            className="w-full rounded-sm h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay gradient */}
          <div
            className={`absolute m-2 rounded-sm inset-0 bg-gradient-to-t from-${portrait.color}-900/60 via-transparent to-transparent`}
          ></div>

          {/* Badge d'âge et génération */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <div
              className={`bg-${portrait.color}-600 text-white px-3 py-1.5 rounded-full text-xs font-bold`}
            >
              {portrait.age} ans
            </div>
            <div className="bg-black/60 backdrop-blur-sm text-xs text-white px-3 py-1.5 rounded-lg">
              {portrait.generation === "anciens"
                ? "Ancien"
                : portrait.generation === "actuels"
                ? "Actuel"
                : "Jeune"}
            </div>
          </div>

          {/* Badge vedette */}
          {portrait.featured && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold">
              ★ Histoire marquante
            </div>
          )}

          {/* Localisation */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
            <div className="flex items-center text-xs">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {portrait.location}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Nom et profession */}
          <div className="mb-4">
            <h3 className="text-md font-bold text-gray-900 mb-1">
              {portrait.name}
            </h3>
            <div className={`text-${portrait.color}-600 text-sm font-semibold`}>
              {portrait.profession}
            </div>
          </div>

          {/* Citation */}
          <div className="mb-6 relative">
            <div className="absolute -left-2 top-0 text-3xl text-gray-300">
              "
            </div>
            <p className="text-gray-700 italic text-xs pl-6">
              {portrait.quote}
            </p>
            <div className="absolute -right-2 bottom-0 text-3xl text-gray-300">
              "
            </div>
          </div>

          {/* Histoire courte */}
          <p className="text-gray-600 text-xs mb-6 line-clamp-2">
            {portrait.shortStory}
          </p>

          {/* Topics de l'interview */}
          <div className="flex flex-wrap gap-2 mb-6">
            {portrait.interviewTopics?.map((topic, index) => (
              <span
                key={index}
                className={`px-3 py-1 bg-${portrait.color}-50 text-${portrait.color}-800 rounded-full text-xs`}
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStoryPlay(portrait);
              }}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isListeningStory
                  ? `bg-${portrait.color}-100 text-${portrait.color}-800`
                  : `bg-${portrait.color}-600 text-white hover:bg-${portrait.color}-700`
              }`}
              disabled={!portrait.interviewAudioUrl}
            >
              {isListeningStory ? (
                <>
                  <div className="flex space-x-1 mr-2">
                    <div className="w-1 h-3 bg-current"></div>
                    <div className="w-1 h-3 bg-current"></div>
                  </div>
                  En écoute
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Écouter son histoire
                </>
              )}
            </button>

            {portrait.interviewDuration && (
              <div className="text-sm text-gray-500">
                {portrait.interviewDuration}
              </div>
            )}
          </div>
        </div>

        {/* Barre de progression audio */}
        {isListeningStory && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className={`h-full bg-${portrait.color}-500 transition-all duration-300`}
              style={{ width: `${storyProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  };

  // Composant Commentaire
  const CommentItem = ({ comment, level = 0 }) => {
    const user = comment.user;
    const userName = user
      ? `${user.firstName} ${user.lastName}`.trim()
      : "Utilisateur anonyme";

    return (
      <div
        className={`mb-4 ${
          level > 0 ? "ml-8 pl-4 border-l-2 border-gray-200" : ""
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-semibold text-gray-900">{userName}</h5>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {comment.isEdited && (
                  <span className="text-xs text-gray-500">Modifié</span>
                )}
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
              <div className="mt-3 flex items-center space-x-4">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-500"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  <span>{comment.likes}</span>
                </button>
                <button
                  onClick={() => handleReply(comment.id)}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Répondre
                </button>
              </div>
            </div>

            {/* Réponses */}
            {comment.replies?.map((reply) => (
              <CommentItem key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Composant Partage Social
  const SocialShareButtons = ({ portrait }) => {
    if (!portrait) return null;

    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4">
          Partager cette histoire
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {/* Facebook */}
          <button
            onClick={() => handleSocialShare("facebook", portrait)}
            className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white hover:opacity-90 transition-opacity"
          >
            <svg
              className="w-6 h-6 mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-sm">Facebook</span>
            <span className="text-xs opacity-80">
              {portrait._count?.portraitShares || 0}
            </span>
          </button>

          {/* Twitter */}
          <button
            onClick={() => handleSocialShare("twitter", portrait)}
            className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 text-white hover:opacity-90 transition-opacity"
          >
            <svg
              className="w-6 h-6 mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            <span className="text-sm">Twitter</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={() => handleSocialShare("whatsapp", portrait)}
            className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white hover:opacity-90 transition-opacity"
          >
            <svg
              className="w-6 h-6 mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
            </svg>
            <span className="text-sm">WhatsApp</span>
          </button>
        </div>

        {/* Liens sociaux de la personne */}
        {(portrait.instagramHandle ||
          portrait.facebookHandle ||
          portrait.youtubeHandle) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="font-bold text-gray-900 mb-3">
              Suivre {portrait.name.split(" ")[0]}
            </h5>
            <div className="flex flex-wrap gap-2">
              {portrait.instagramHandle && (
                <a
                  href={`https://instagram.com/${portrait.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-sm bg-pink-50 text-pink-700 hover:bg-pink-100"
                >
                  @{portrait.instagramHandle}
                </a>
              )}
              {portrait.facebookHandle && (
                <a
                  href={`https://facebook.com/${portrait.facebookHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {portrait.facebookHandle}
                </a>
              )}
              {portrait.youtubeHandle && (
                <a
                  href={`https://youtube.com/${portrait.youtubeHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-sm bg-red-50 text-red-700 hover:bg-red-100"
                >
                  {portrait.youtubeHandle}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (portraitsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des portraits...</p>
        </div>
      </div>
    );
  }

  const portraits = portraitsData || [];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Header avec effet de texture */}
      <div className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 h-64 -z-10 w-full overflow-hidden">
          <div className="absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70" />
          <img
            src="https://i.pinimg.com/1200x/d5/99/51/d59951aaef774bfb6c704069ce42a3bc.jpg"
            className="h-full object-cover w-full"
            alt="Background"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-xl md:text-4xl font-bold text-gray-100 mb-6 tracking-tight">
            Portraits locaux
          </h1>
          <p className="text-sm text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Découvrez les visages et histoires des habitants locaux. Des
            rencontres authentiques qui tissent la mémoire vivante de notre île.
          </p>
          <TourismNavigation page="inspirer" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Filtres par génération */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 justify-center space-x-4">
            {generations.map((generation) => (
              <button
                key={generation.id}
                onClick={() => setActiveGeneration(generation.id)}
                className={`px-6 py-3 text-xs mt-2 rounded-full font-medium transition-all duration-300 border ${
                  activeGeneration === generation.id
                    ? "bg-secondary-text text-white transform scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:text-emerald-700"
                }`}
              >
                {generation.label}
              </button>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        {statsData && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-500">Portraits</div>
              <div className="text-2xl font-bold text-gray-900">
                {statsData.totalPortraits}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-500">Vues</div>
              <div className="text-2xl font-bold text-gray-900">
                {statsData.totalViews}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-500">Partages</div>
              <div className="text-2xl font-bold text-gray-900">
                {statsData.totalShares}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-500">Écoutes</div>
              <div className="text-2xl font-bold text-gray-900">
                {statsData.totalListens}
              </div>
            </div>
          </div>
        )}

        {/* Grille des portraits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {portraits.map((portrait) => (
            <PortraitCard key={portrait.id} portrait={portrait} />
          ))}
        </div>

        {/* Aucun portrait */}
        {portraits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun portrait trouvé
            </h3>
            <p className="text-gray-500">
              Aucun portrait ne correspond à vos critères de recherche.
            </p>
          </div>
        )}

        {/* Section détaillée du portrait sélectionné */}
        {selectedPortraitData && (
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-200">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Colonne gauche : Photos et informations */}
                <div className="lg:col-span-2 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedPortraitData.name}
                      </h2>
                      <div
                        className={`text-xl font-semibold text-${selectedPortraitData.color}-600`}
                      >
                        {selectedPortraitData.age} ans •{" "}
                        {selectedPortraitData.profession} •{" "}
                        {selectedPortraitData.location}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPortrait(null)}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Galerie de photos */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {selectedPortraitData.images?.map((img, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-xl aspect-square"
                      >
                        <img
                          src={`${img}?auto=format&fit=crop&w=400&h=400&q=80`}
                          alt={`${selectedPortraitData.name} - Photo ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {selectedPortraitData.description && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Présentation
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedPortraitData.description}
                      </p>
                    </div>
                  )}

                  {/* Histoire complète */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Son histoire
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedPortraitData.story}
                    </p>
                  </div>

                  {/* Interview */}
                  {selectedPortraitData.interviewAudioUrl && (
                    <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900">
                          Interview audio
                        </h4>
                        {selectedPortraitData.interviewDuration && (
                          <div className="text-gray-600">
                            {selectedPortraitData.interviewDuration}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleStoryPlay(selectedPortraitData)}
                          className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            playingStory === selectedPortraitData.id
                              ? `bg-${selectedPortraitData.color}-100 text-${selectedPortraitData.color}-600`
                              : `bg-${selectedPortraitData.color}-600 text-white hover:bg-${selectedPortraitData.color}-700`
                          }`}
                        >
                          {playingStory === selectedPortraitData.id ? (
                            <div className="flex space-x-1">
                              <div className="w-2 h-5 bg-current"></div>
                              <div className="w-2 h-5 bg-current"></div>
                            </div>
                          ) : (
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>

                        <div className="flex-1">
                          {selectedPortraitData.interviewTopics?.length > 0 && (
                            <>
                              <div className="text-sm text-gray-500 mb-2">
                                Sujets abordés
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {selectedPortraitData.interviewTopics.map(
                                  (topic, index) => (
                                    <span
                                      key={index}
                                      className={`px-3 py-1 bg-${selectedPortraitData.color}-100 text-${selectedPortraitData.color}-800 rounded-full text-sm`}
                                    >
                                      {topic}
                                    </span>
                                  )
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Barre de progression */}
                      {playingStory === selectedPortraitData.id && (
                        <div className="mt-6">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-${selectedPortraitData.color}-500 transition-all duration-300`}
                              style={{ width: `${storyProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sagesse */}
                  {selectedPortraitData.wisdom?.length > 0 && (
                    <div className="mb-8" ref={commentRef}>
                      <h4 className="font-bold text-gray-900 mb-4">
                        Sagesse transmise
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedPortraitData.wisdom.map((wisdom, index) => (
                          <div
                            key={index}
                            className={`bg-${selectedPortraitData.color}-50 rounded-xl p-4 border border-${selectedPortraitData.color}-200`}
                          >
                            <div className="text-lg mb-2">"</div>
                            <p className="text-gray-700 italic">{wisdom}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Commentaires */}
                  <div className="mt-12">
                    <h4 className="font-bold text-gray-900 mb-6">
                      Commentaires (
                      {selectedPortraitData._count?.portraitComments || 0})
                    </h4>

                    {/* Formulaire de commentaire */}
                    <form onSubmit={handleAddComment} className="mb-8">
                      <div className="mb-4">
                        <textarea
                          id="comment-input"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder={
                            replyTo
                              ? "Répondre au commentaire..."
                              : "Laissez un commentaire..."
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          rows={3}
                          required
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          {replyTo && (
                            <button
                              type="button"
                              onClick={() => setReplyTo(null)}
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              Annuler la réponse
                            </button>
                          )}
                        </div>
                        <button
                          type="submit"
                          disabled={
                            addCommentMutation.isLoading || !newComment.trim()
                          }
                          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addCommentMutation.isLoading
                            ? "Publication..."
                            : replyTo
                            ? "Répondre"
                            : "Publier"}
                        </button>
                      </div>
                    </form>

                    {/* Liste des commentaires */}
                    <div className="space-y-6">
                      {selectedPortraitData.portraitComments?.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                      ))}
                      {(!selectedPortraitData.portraitComments ||
                        selectedPortraitData.portraitComments.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          Soyez le premier à commenter ce portrait
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Colonne droite : Partage et réseaux sociaux */}
                <div className="p-8 bg-gray-50">
                  <SocialShareButtons portrait={selectedPortraitData} />

                  {/* Statistiques du portrait */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h5 className="font-bold text-gray-900 mb-3">
                      Statistiques
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vues</span>
                        <span className="font-semibold">
                          {selectedPortraitData.views}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Partages</span>
                        <span className="font-semibold">
                          {selectedPortraitData._count?.portraitShares || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Écoutes</span>
                        <span className="font-semibold">
                          {selectedPortraitData._count?.portraitListens || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Commentaires</span>
                        <span className="font-semibold">
                          {selectedPortraitData._count?.portraitComments || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Catégories */}
                  {selectedPortraitData.categories?.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h5 className="font-bold text-gray-900 mb-3">
                        Catégories
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedPortraitData.categories.map(
                          (category, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                            >
                              {category}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques des générations */}
        {statsData?.byGeneration && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Les générations réunionnaises
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: "anciens",
                  label: "Anciens",
                  description:
                    "Porteurs de la mémoire et des traditions ancestrales",
                  color: "amber",
                  icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
                },
                {
                  id: "actuels",
                  label: "Actuels",
                  description: "Acteurs du présent, bâtisseurs du futur",
                  color: "emerald",
                  icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6 M9 17l2 2 4-4",
                },
                {
                  id: "jeunes",
                  label: "Jeunes",
                  description:
                    "Visionnaires qui réinventent l'identité réunionnaise",
                  color: "purple",
                  icon: "M12 14l9-5-9-5-9 5 9 5z M12 14v6 M5 13.999v5 M19 13.999v5",
                },
              ].map((gen) => {
                const stat = statsData.byGeneration.find(
                  (s) => s.generation === gen.id
                );
                return (
                  <div
                    key={gen.id}
                    className="bg-white rounded-2xl p-8 text-center border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-10 h-10 bg-${gen.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6`}
                      >
                        <svg
                          className={`w-5 h-5 text-${gen.color}-600`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d={gen.icon}
                          />
                        </svg>
                      </div>
                      <div className="flex-1 flex gap-4 items-start ml-4">
                        <div className="text-xl font-bold text-gray-900 mb-2">
                          {stat?._count || 0}
                        </div>
                        <div
                          className={`text-xl font-bold text-${gen.color}-600 mb-3`}
                        >
                          {gen.label}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{gen.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section citation du jour */}
        {portraits.length > 0 && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-12 text-white text-center">
              <div
                className="text-5xl mb-6"
                style={{
                  transform: `rotate(${quoteRotation}deg)`,
                  transition: "transform 1s ease-in-out",
                }}
              >
                "
              </div>
              <div className="text-2xl italic mb-8 max-w-3xl mx-auto">
                {portraits[dailyQuoteIndex]?.quote}
              </div>
              <div className="text-emerald-200">
                — {portraits[dailyQuoteIndex]?.name},{" "}
                {portraits[dailyQuoteIndex]?.age} ans
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Élément audio caché */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Canvas pour l'animation */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
      />

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PortraitsLocaux;
