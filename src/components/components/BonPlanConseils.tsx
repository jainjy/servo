import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import perfectAnim from '../../assets/perfect.json';
import confetiAnim from '../../assets/Confeti.json';
import coolAnim from '../../assets/Cool.json';
import cryAnim from '../../assets/Cry.json';

const BonsPlansConseils = () => {
  const [activeCategory, setActiveCategory] = useState('tous');
  const [savedTips, setSavedTips] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [bookmarkedTips, setBookmarkedTips] = useState({});
  const canvasRef = useRef(null);
  const tipsContainerRef = useRef(null);

  // Données des bons plans et conseils
  const tips = [
    {
      id: 1,
      title: "Randonnée en sécurité",
      category: "nature",
      difficulty: "Débutant",
      duration: "5 min",
      description: "Comment préparer sa randonnée en montagne : check-list essentielle pour éviter les imprévus.",
      content: [
        "Vérifier la météo la veille et le matin même",
        "Prévoir 2L d'eau par personne",
        "Avoir une carte physique en plus du GPS",
        "Prévenir quelqu'un de son itinéraire",
        "Emporter une trousse de premiers secours"
      ],
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      color: "emerald",
      urgency: "Important",
      views: "12.4K",
      saves: "2.3K",
      expert: "Guide de montagne certifié",
      location: "Tous les cirques"
    },
    {
      id: 2,
      title: "Marché local malin",
      category: "shopping",
      difficulty: "Facile",
      duration: "3 min",
      description: "Astuces pour faire ses courses au marché : qualité, prix et relations avec les producteurs.",
      content: [
        "Yaller tôt pour avoir le meilleur choix",
        "Préférer les produits de saison",
        "Négocier poliment en achetant en quantité",
        "Demander l'origine des produits",
        "Apporter ses propres sacs"
      ],
      icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
      color: "amber",
      urgency: "Utile",
      views: "8.7K",
      saves: "1.8K",
      expert: "Producteur local",
      location: "Marchés de l'île"
    },
    {
      id: 3,
      title: "Économies énergie",
      category: "maison",
      difficulty: "Facile",
      duration: "4 min",
      description: "Réduire sa facture d'électricité sous les tropiques sans sacrifier le confort.",
      content: [
        "Utiliser des ventilateurs avant la clim",
        "Faire sécher le linge à l'air libre",
        "Entretenir régulièrement la climatisation",
        "Installer des stores extérieurs",
        "Privilégier les heures creuses"
      ],
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "blue",
      urgency: "Économique",
      views: "15.2K",
      saves: "3.1K",
      expert: "Ingénieur énergie",
      location: "Toute l'île"
    },
    {
      id: 4,
      title: "Cuisine anti-gaspi",
      category: "cuisine",
      difficulty: "Moyen",
      duration: "6 min",
      description: "Transformer vos restes en délices : recettes simples pour ne rien jeter.",
      content: [
        "Pain dur → pain perdu ou chapelure",
        "Fruits trop mûrs → compote ou smoothie",
        "Légumes flétris → soupe ou bouillon",
        "Riz restant → riz sauté ou salade",
        "Poulet restant → salade ou sandwich"
      ],
      icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
      color: "green",
      urgency: "Écologique",
      views: "9.8K",
      saves: "2.5K",
      expert: "Chef zéro déchet",
      location: "Cuisine domestique"
    },
    {
      id: 5,
      title: "Transport optimisé",
      category: "transport",
      difficulty: "Débutant",
      duration: "4 min",
      description: "Se déplacer malin sur l'île : combiner transports en commun et covoiturage.",
      content: [
        "Utiliser l'appli Car Jaune pour les bus",
        "Covoiturer pour les trajets réguliers",
        "Éviter les heures de pointe (7-9h, 16-18h)",
        "Vérifier les travaux routiers avant de partir",
        "Privilégier le vélo pour les courtes distances"
      ],
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "cyan",
      urgency: "Pratique",
      views: "7.3K",
      saves: "1.6K",
      expert: "Urbaniste local",
      location: "Routes réunionnaises"
    },
    {
      id: 6,
      title: "Jardin tropical",
      category: "jardin",
      difficulty: "Moyen",
      duration: "7 min",
      description: "Créer un jardin résilient : plantes adaptées au climat et économes en eau.",
      content: [
        "Choisir des plantes endémiques",
        "Pailler pour conserver l'humidité",
        "Arroser tôt le matin ou tard le soir",
        "Composter les déchets verts",
        "Associer les plantes compatibles"
      ],
      icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
      color: "lime",
      urgency: "Durable",
      views: "6.9K",
      saves: "1.9K",
      expert: "Jardinier permaculteur",
      location: "Jardins familiaux"
    },
    {
      id: 7,
      title: "Santé tropicale",
      category: "santé",
      difficulty: "Débutant",
      duration: "5 min",
      description: "Prévenir les petits maux sous les tropiques : moustiques, soleil, hydratation.",
      content: [
        "Utiliser du répulsif naturel (géranium, citronnelle)",
        "Boire 2L d'eau minimum par jour",
        "Protection solaire même par temps couvert",
        "Vêtements légers et couvrants",
        "Surveiller les signes de déshydratation"
      ],
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      color: "rose",
      urgency: "Santé",
      views: "14.1K",
      saves: "3.4K",
      expert: "Médecin généraliste",
      location: "Climat tropical"
    },
    {
      id: 8,
      title: "Culture locale",
      category: "culture",
      difficulty: "Facile",
      duration: "4 min",
      description: "S'intégrer et comprendre les codes culturels réunionnais en douceur.",
      content: [
        "Apprendre quelques mots de créole",
        "Respecter le 'lontan' (temps long)",
        "Participer aux fêtes traditionnelles",
        "Goûter tous les plats typiques",
        "Écouter les histoires des anciens"
      ],
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      color: "purple",
      urgency: "Social",
      views: "5.6K",
      saves: "1.2K",
      expert: "Anthropologue local",
      location: "Vie quotidienne"
    }
  ];

  // Catégories
  const categories = [
    { id: 'tous', label: 'Tous les conseils' },
    { id: 'nature', label: 'Nature' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'maison', label: 'Maison' },
    { id: 'cuisine', label: 'Cuisine' },
    { id: 'transport', label: 'Transport' },
    { id: 'jardin', label: 'Jardin' },
    { id: 'santé', label: 'Santé' },
    { id: 'culture', label: 'Culture' }
  ];

  // Quiz questions
  const quizQuestions = [
    {
      question: "Quelle est la quantité d'eau recommandée pour une randonnée de 4 heures ?",
      options: ["500ml", "1L", "2L", "3L"],
      correct: 2,
      tipId: 1
    },
    {
      question: "Quel est le meilleur moment pour arroser son jardin tropical ?",
      options: ["Midi", "16h", "Tôt le matin", "N'importe quand"],
      correct: 2,
      tipId: 6
    },
    {
      question: "Comment économiser l'énergie avec la climatisation ?",
      options: ["La laisser allumée", "L'éteindre et rallumer souvent", "Bien l'entretenir", "Ne pas l'utiliser"],
      correct: 2,
      tipId: 3
    }
  ];

  // Filtrage des conseils
  const filteredTips = activeCategory === 'tous'
    ? tips.filter(tip =>
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : tips.filter(tip =>
      tip.category === activeCategory &&
      (tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Animation du canvas (effet de bulles/idées)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const bubbles = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 15 + 5,
      speed: Math.random() * 0.5 + 0.2,
      color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.1)`
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Bulles flottantes
      bubbles.forEach(bubble => {
        bubble.y -= bubble.speed;
        if (bubble.y < -bubble.radius) {
          bubble.y = canvas.height + bubble.radius;
          bubble.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();

        // Effet de lumière
        ctx.beginPath();
        ctx.arc(bubble.x - bubble.radius / 3, bubble.y - bubble.radius / 3, bubble.radius / 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Sauvegarder un conseil
  const handleSaveTip = (tipId) => {
    if (savedTips.includes(tipId)) {
      setSavedTips(savedTips.filter(id => id !== tipId));
    } else {
      setSavedTips([...savedTips, tipId]);
    }
  };

  // Bookmark un conseil
  const handleBookmarkTip = (tipId) => {
    setBookmarkedTips(prev => ({
      ...prev,
      [tipId]: !prev[tipId]
    }));
  };

  // Répondre au quiz
  const handleQuizAnswer = (answerIndex) => {
    const correctIndex = quizQuestions[currentQuestion].correct;
    const isCorrect = answerIndex === correctIndex;
    const newScore = quizScore + (isCorrect ? 1 : 0);
    setQuizScore(newScore);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      return;
    }

    // Fin du quiz : afficher la modal de résultat
    setShowQuiz(false);
    setShowResultModal(true);
    setCurrentQuestion(0);

    // Si score parfait, ouvrir le conseil lié (dernier question -> tipId)
    if (newScore === quizQuestions.length) {
      const perfectTipId = quizQuestions[quizQuestions.length - 1].tipId;
      setSelectedTip(tips.find(t => t.id === perfectTipId));
    }
  };

  // Composant Carte Conseil
  const TipCard = ({ tip }) => {
    const isSaved = savedTips.includes(tip.id);
    const isBookmarked = bookmarkedTips[tip.id];
    const isSelected = selectedTip?.id === tip.id;

    return (
      <div
        className={`relative bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md border ${isSelected ? `border-${tip.color}-400 scale-[1.01]` : 'border-gray-100'
          }`}
        onClick={() => setSelectedTip(tip)}
      >
        {/* En-tête compacte */}
        <div className={`relative h-24 bg-gradient-to-r from-${tip.color}-50 to-${tip.color}-100 border-b border-${tip.color}-100`}>
          {/* Contenu en-tête */}
          <div className="absolute inset-0 p-4 flex items-center justify-between">
            {/* Icône et difficulté */}
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-${tip.color}-100 flex items-center justify-center`}>
                <svg className={`w-5 h-5 text-${tip.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tip.icon} />
                </svg>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${tip.color}-50 text-${tip.color}-700 border border-${tip.color}-200`}>
                {tip.difficulty}
              </span>
            </div>

            {/* Actions rapides */}
            <div className="flex absolute top-2 right-2 items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmarkTip(tip.id);
                }}
                className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
              >
                <svg
                  className={`w-4 h-4 ${isBookmarked ? `text-${tip.color}-600 fill-current` : 'text-gray-400'}`}
                  fill={isBookmarked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tip.duration}
            </div>
          </div>

          {/* Durée et urgence en bas de l'en-tête */}
          <div className="absolute bottom-2 right-2 flex items-center justify-between text-xs">

            <span className={`px-2 py-1 rounded text-xs font-medium ${tip.urgency === 'Haute' ? `bg-red-50 text-red-700 border border-red-100` :
              tip.urgency === 'Moyenne' ? `bg-yellow-50 text-yellow-700 border border-yellow-100` :
                `bg-blue-50 text-blue-700 border border-blue-100`
              }`}>
              {tip.urgency}
            </span>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-4">
          {/* Titre et métriques */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2">
              {tip.title}
            </h3>
            <div className="flex flex-col justify-start items-start gap-2 text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {tip.expert}
                </span>
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {tip.location}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {tip.views}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveTip(tip.id);
                  }}
                  className={`flex items-center px-2 py-1 rounded text-xs font-medium transition-colors ${isSaved
                    ? `bg-${tip.color}-50 text-${tip.color}-600 border border-${tip.color}-200`
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  <svg className={`w-3.5 h-3.5 mr-1 ${isSaved ? 'fill-current' : ''}`} fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {tip.saves}
                </button>
              </div>
            </div>
          </div>

          {/* Description réduite */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-4">
            {tip.description}
          </p>

          {/* Indicateur de sélection minimal */}
          {isSelected && (
            <div className={`h-0.5 bg-${tip.color}-400 rounded-full`}></div>
          )}
        </div>
      </div>
    );
  };

  // Quiz Component
  const QuizComponent = () => {
    if (!showQuiz) return null;

    const currentQ = quizQuestions[currentQuestion];

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-lg w-full shadow-lg">
          {/* En-tête compact */}
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">QUIZ DU JOUR</h3>
              <p className="text-xs text-gray-500 mt-0.5">Testez vos connaissances</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Score</div>
              <div className="text-lg font-bold text-emerald-600">{quizScore}/{currentQuestion}</div>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-5">
            {/* Question */}
            <div className="mb-5">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-emerald-600 font-bold text-sm">Q{currentQuestion + 1}</span>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Question {currentQuestion + 1}/{quizQuestions.length}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm leading-snug">{currentQ.question}</h4>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-6 h-6 rounded border border-gray-300 group-hover:border-emerald-400 flex items-center justify-center mr-3 text-xs font-medium">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-sm text-gray-700">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Indicateur de progression */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progression</span>
                <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Indice */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Bonne réponse ? Découvrez le conseil associé !
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal de résultat du quiz
  const ResultModal = () => {
    if (!showResultModal) return null;

    const total = quizQuestions.length;
    const score = quizScore;
    const ratio = score / total;
    let message = '';

    if (ratio === 1) {
      message = "Parfait — vous maîtrisez bien le sujet ! Continuez comme ça.";
    } else if (ratio >= 0.7) {
      message = "Très bien — de bonnes connaissances, un petit effort encore !";
    } else if (ratio >= 0.4) {
      message = "Pas mal — vous êtes sur la bonne voie, réessayez pour améliorer.";
    } else {
      message = "Courage — chaque erreur est une occasion d'apprendre. Réessayez !";
    }

    // Choix de l'animation selon le ratio
    let animData: any = cryAnim;
    if (ratio === 1) animData = perfectAnim;
    else if (ratio >= 0.7) animData = confetiAnim;
    else if (ratio >= 0.4) animData = coolAnim;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full shadow-xl p-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 mb-2">
              <Lottie animationData={animData} loop={ratio < 1} autoplay />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Résultat du quiz</h3>
            <div className="text-emerald-600 text-4xl font-bold mb-3">{score}/{total}</div>
            <p className="text-gray-700 mb-6">{message}</p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                // Reprendre le quiz
                setQuizScore(0);
                setCurrentQuestion(0);
                setShowResultModal(false);
                setShowQuiz(true);
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
            >Reprendre</button>
            <button
              onClick={() => {
                setShowResultModal(false);
                setQuizScore(0);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
            >Fermer</button>
          </div>
        </div>
      </div>
    );
  };

  // Conseils sauvegardés
  const SavedTipsSection = () => {
    if (savedTips.length === 0) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Vos conseils sauvegardés</h3>
          <div className="text-emerald-600 font-medium">{savedTips.length} conseil{savedTips.length > 1 ? 's' : ''}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.filter(tip => savedTips.includes(tip.id)).map(tip => (
            <div key={tip.id} className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border-2 border-emerald-200">
              <div className={`w-12 h-12 bg-${tip.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                <svg className={`w-6 h-6 text-${tip.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tip.icon} />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{tip.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{tip.description}</p>
              <button
                onClick={() => setSelectedTip(tip)}
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Voir le détail →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Header avec bulles animées */}
      <div className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div
          className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div
            className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70'
          />
          <img
            src="https://i.pinimg.com/1200x/a5/7f/98/a57f98fad091dbd9c34abafc577b5929.jpg"
            className='h-full object-cover w-full'
            alt="Background"
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-xl md:text-4xl font-bold text-gray-100 mb-6">
              Bons plans & conseils
            </h1>
            <p className="text-sm text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Découvrez des astuces et conseils utiles pour vos activités.
              Des solutions pratiques testées et approuvées par nos experts locaux.
            </p>
            <div className="inline-flex items-center mt-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              CONSEILS PRATIQUES 100% LOCAUX
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un conseil, une astuce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Filtres */}
        <div className="mb-4">
          <div className="flex overflow-x-auto pb-4 space-x-3 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-6 py-3 text-xs rounded-full font-medium transition-all duration-300 border ${activeCategory === category.id
                  ? 'bg-logo text-white transform scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:text-emerald-700'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section conseils sauvegardés */}
        <SavedTipsSection />

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { value: tips.length, label: "Conseils disponibles", color: "emerald" },
            { value: "24", label: "Experts locaux", color: "blue" },
            { value: "98%", label: "Satisfaction", color: "amber" },
            { value: "45K+", label: "Astuces appliquées", color: "purple" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-around border border-gray-100">
              <div className={`text-xl font-bold text-${stat.color}-600`}>{stat.value}</div>
              <div className="text-gray-600 text-md">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Grille de conseils */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" ref={tipsContainerRef}>
          {filteredTips.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>

        {/* Conseils du jour */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Conseils du jour</h3>
            <button
              onClick={() => {
                setQuizScore(0);
                setCurrentQuestion(0);
                setShowResultModal(false);
                setShowQuiz(true);
              }}
              className="px-6 py-3 bg-secondary-text text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Faire le quiz
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.slice(0, 3).map(tip => (
              <div key={tip.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                <div className={`w-14 h-14 bg-${tip.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                  <svg className={`w-7 h-7 text-${tip.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tip.icon} />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{tip.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{tip.description}</p>
                <button
                  onClick={() => setSelectedTip(tip)}
                  className={`text-${tip.color}-600 font-medium hover:text-${tip.color}-700`}
                >
                  Lire les astuces →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Détail du conseil sélectionné */}
        {selectedTip && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-xl">
              {/* En-tête compact */}
              <div className={`sticky top-0 p-4 text-white bg-secondary-text`}>
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h2 className="font-bold text-lg mb-2">{selectedTip.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
                        {selectedTip.difficulty}
                      </span>
                      <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
                        {selectedTip.duration}
                      </span>
                      <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
                        {selectedTip.urgency}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTip(null)}
                    className="flex-shrink-0 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-5 overflow-y-auto max-h-[calc(85vh-73px)]">
                <div className="grid lg:grid-cols-3 gap-5">
                  {/* Colonne principale - Astuces */}
                  <div className="lg:col-span-2 space-y-5">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-3 uppercase tracking-wide">DÉTAIL DES ASTUCES</h3>
                      <div className="space-y-3">
                        {selectedTip.content.map((item, index) => (
                          <div key={index} className="flex items-start group">
                            <div className={`flex-shrink-0 w-7 h-7 rounded-full bg-${selectedTip.color}-50 flex items-center justify-center mr-3 mt-0.5`}>
                              <span className={`text-xs font-semibold text-${selectedTip.color}-600`}>
                                {index + 1}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Note d'expert */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-600 italic">
                        <span className="font-semibold text-gray-900">Note de {selectedTip.expert} :</span>
                        {" "}Ces conseils sont basés sur mon expérience. Adaptez-les à votre situation.
                      </p>
                    </div>
                  </div>

                  {/* Colonne latérale - Actions */}
                  <div className="space-y-4">
                    {/* Actions rapides */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-3">ACTIONS</h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleSaveTip(selectedTip.id)}
                          className={`w-full bg-secondary-text text-sm px-3 py-2.5 rounded-lg transition-colors ${savedTips.includes(selectedTip.id)
                            ? ` text-${selectedTip.color}-700 border border-${selectedTip.color}-200`
                            : ` text-white`
                            }`}
                        >
                          {savedTips.includes(selectedTip.id) ? '✓ Sauvegardé' : 'Sauvegarder'}
                        </button>
                        <button
                          onClick={() => handleBookmarkTip(selectedTip.id)}
                          className={`w-full text-sm px-3 py-2.5 rounded-lg border transition-colors ${bookmarkedTips[selectedTip.id]
                            ? `border-${selectedTip.color}-400 text-${selectedTip.color}-700 bg-${selectedTip.color}-50`
                            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                        >
                          {bookmarkedTips[selectedTip.id] ? '✓ Favori' : 'Ajouter aux favoris'}
                        </button>
                      </div>
                    </div>

                    {/* Métriques */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-3">MÉTRIQUES</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-600">Vues</span>
                          </div>
                          <span className="font-medium">{selectedTip.views}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-600">Sauvegardes</span>
                          </div>
                          <span className="font-medium">{selectedTip.saves}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info expert */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-3">EXPERT</h4>
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full bg-${selectedTip.color}-100 flex items-center justify-center mr-3`}>
                          <svg className={`w-5 h-5 text-${selectedTip.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{selectedTip.expert}</div>
                          <div className="text-xs text-gray-600 flex items-center mt-0.5">
                            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {selectedTip.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Taux d'adoption */}
                    <div className={`bg-${selectedTip.color}-50 border border-${selectedTip.color}-100 rounded-lg p-4`}>
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Taux d'adoption</h4>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Succès</span>
                          <span>{Math.round((parseInt(selectedTip.saves) / parseInt(selectedTip.views)) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${selectedTip.color}-500 rounded-full`}
                            style={{ width: `${(parseInt(selectedTip.saves) / parseInt(selectedTip.views)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        {selectedTip.saves} personnes ont appliqué cette astuce
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA final */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-5">
          <div className="absolute inset-0 bg-secondary-text"></div>
          <div className="relative z-10 p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">
              Vous avez une astuce à partager ?
            </h2>
            <p className="text-emerald-100 max-w-2xl mx-auto mb-8">
              Partagez vos bons plans et conseils avec la communauté.
              Votre expérience peut aider des milliers de personnes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-secondary-text font-bold px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors">
                Proposer un conseil
              </button>
              <button className="bg-transparent border-2 border-white text-white font-semibold px-10 py-4 rounded-xl hover:bg-white/10 transition-colors">
                Devenir expert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz */}
      <QuizComponent />
      <ResultModal />

      <style >{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default BonsPlansConseils;