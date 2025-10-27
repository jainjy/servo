import { Search, Loader2, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
//import heroImage from "@/assets/house.jpg";
import heroImage from "@/assets/hero-house.jpg";
import "../styles/font.css";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import start from '/run.gif'
import '../styles/font.css'
import SplitText from "gsap/SplitText";
gsap.registerPlugin(SplitText);

interface SearchItem {
  id: string | number;
  title: string;
  image?: string;
  route: string;
  type?: string;
}

type Stage = "idle" | "loading" | "results";

const Hero = () => {
  const [heroQuery, setHeroQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [runnerVisible, setRunnerVisible] = useState(false);
  const [runnerExit, setRunnerExit] = useState(false);
  const prevStageRef = useRef<Stage>("idle");
  const navigate = useNavigate();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<Array<{ q: string; date: number }>>([]);
  const HISTORY_KEY = "hero-search-history";
  const loadHistory = () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [] as Array<{ q: string; date: number }>;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [] as Array<{ q: string; date: number }>;
    }
  };
  const saveHistory = (list: Array<{ q: string; date: number }>) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
    } catch { }
  };
  const addHistory = (q: string) => {
    if (!q) return;
    setSearchHistory((prev) => {
      const withoutDup = prev.filter((i) => i.q.toLowerCase() !== q.toLowerCase());
      const next = [{ q, date: Date.now() }, ...withoutDup].slice(0, 50);
      saveHistory(next);
      return next;
    });
  };
  useEffect(() => {
    gsap
      .timeline()
      .fromTo(
        "#hero",
        { opacity: 0, y: -100 },
        { y: 0, opacity: 1, delay: 4, duration: 1.5, ease: "power2.out" }
      )
      .fromTo(
        "#hero h1",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=1"
      );
  }, []);

  useEffect(() => {
    setSearchHistory(loadHistory());
  }, []);

  const openModal = () => {
    setModalOpen(true);
    setStage("idle");
    setQuery(heroQuery || "");
    setResults([]);
  };

  const mapPropertyToResult = (p: any, i: number): SearchItem => {
    const fallback = [property1, property2, property3][i % 3] as string;
    const img = (Array.isArray(p.images) && p.images[0]) || p.localImage || fallback || "/placeholder.jpg";
    const title = p.title || `${p.type || "Bien"}${p.city ? " - " + p.city : ""}`;
    return {
      id: p.id,
      title,
      image: img,
      route: `/immobilier/${p.id}`,
      type: (p.type || p.status || "PROPRIETE").toString().toUpperCase(),
    };
  };

  const runSearch = async (q: string) => {
    setStage("loading");
    setResults([]);
    try {
      let items: SearchItem[] = [];

      try {
        const res = await api.get(`/search`, { params: { q } });
        if (Array.isArray(res.data) && res.data.length) {
          items = res.data.slice(0, 50).map((it: any, i: number) => ({
            id: it.id ?? `search-${i}`,
            title: it.title || it.name || "Élément",
            image: it.image || it.thumbnail || it.cover || "/placeholder.jpg",
            route:
              it.route ||
              it.url ||
              (it.type === "property" && it.id ? `/immobilier/${it.id}` : "/"),
            type: (it.type || "").toString().toUpperCase(),
          }));
        }
      } catch (_e) {
        // ignorer et passer au fallback properties
      }

      // 2) Fallback sur /properties
      if (!items.length) {
        try {
          const res = await api.get("/properties");
          const props = Array.isArray(res.data) ? res.data : [];
          const filtered = props
            .filter((p: any) => {
              const hay = `${p.title ?? ""} ${p.city ?? ""} ${p.description ?? ""} ${p.type ?? ""}`.toLowerCase();
              return hay.includes(q.toLowerCase());
            })
            .slice(0, 50);
          items = filtered.map(mapPropertyToResult);
        } catch (_e) {
          items = [];
        }
      }

      setResults(items);
      setStage("results");
    } catch (_e) {
      setResults([]);
      setStage("results");
    }
  };

  const handleModalSearch = async () => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setStage("results");
      return;
    }
    await runSearch(q);
    addHistory(q);
  };

  const handleSelect = (item: SearchItem) => {
    setModalOpen(false);
    navigate(item.route);
  };

  const isLoading = stage === "loading";

  useEffect(() => {
    const prev = prevStageRef.current;
    if (stage === "loading") {
      setRunnerVisible(true);
      setRunnerExit(false);
    }
    if (prev === "loading" && stage !== "loading") {
      setRunnerExit(true);
      const t = setTimeout(() => {
        setRunnerVisible(false);
        setRunnerExit(false);
      }, 350);
      prevStageRef.current = stage;
      return () => clearTimeout(t);
    }
    prevStageRef.current = stage;
  }, [stage]);
  /************** */

 const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 });
  const [lightPosition, setLightPosition] = useState({ x: 50, y: 50, opacity: 0 });
  const requestRef = useRef(null);

  // Interpolation fluide (inertie)
  const animate = () => {
    setCurrentRotation((prev) => {
      const lerp = 0.08;
      const newX = prev.x + (targetRotation.x - prev.x) * lerp;
      const newY = prev.y + (targetRotation.y - prev.y) * lerp;
      return { x: newX, y: newY };
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [targetRotation]);

  // Gestion du mouvement
  const handleMouseMove = (e) => {
    const parent = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - parent.left) / parent.width - 0.5;
    const y = (e.clientY - parent.top) / parent.height - 0.5;

    const rotateY = x * -25;
    const rotateX = y * 20;

    setTargetRotation({ x: rotateX, y: rotateY });

    // Position du reflet lumineux (en %)
    const lightX = ((e.clientX - parent.left) / parent.width) * 100;
    const lightY = ((e.clientY - parent.top) / parent.height) * 100;
    setLightPosition({ x: lightX, y: lightY, opacity: 0.25 });
  };

  // Quand la souris quitte la zone
  const handleMouseLeave = () => {
    setTargetRotation({ x: 0, y: 0 });
    setLightPosition({ x: 50, y: 50, opacity: 0 });
  };


  return (
    <>
      <section id="hero" className="relative min-h-[600px] flex items-center justify-center overflow-hidden " onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}>
        <div className="perspective-[500px] w-full h-screen rounded-lg bg-black overflow-hidden absolute" style={{
          transformStyle: "preserve-3d",
        }}>
          <img
            src={heroImage}
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
            style={{ transform: `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg) scale(1.05)`, }} />
             {/* Reflet dynamique */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${lightPosition.x}% ${lightPosition.y}%, rgba(255,255,255,${lightPosition.opacity}) 0%, transparent 60%)`,
            mixBlendMode: "overlay",
          }}
        />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-20 text-center">

          <h1 className="mb-6 lg:mt-0 -mt-2 text-2xl  md:text-5xl lg:text-7xl tracking-wide font-bold text-white">
            La super-application
            <br />
            de l'habitat
          </h1>

          <p className="mb-12 text-xl text-white drop-shadow-md">Immobilier, services et produits — tout en un, guidé par l'IA</p>

          <div className="mx-auto max-w-3xl">
            {/* Barre de recherche (ouvre le modal) */}
            <div className="flex flex-col md:flex-row gap-3 bg-white rounded-2xl p-3 shadow-2xl cursor-text" onClick={openModal}>
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  onFocus={openModal}
                  readOnly
                  placeholder="Cliquez pour lancer une recherche avancée"
                  className="pl-12 h-12 border-0 bg-transparent text-base focus-visible:ring-0 placeholder:text-gray-500"
                />
              </div>
              <Button size="lg" className="md:w-auto pointer-events-none">Rechercher</Button>
            </div>
          </div>
        </div>

        {/* Modal plein écran */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="p-0 border-0 sm:max-w-[100vw] sm:w-[80vw] sm:h-[90vh] overflow-hidden w-11/12 h-11/12 max-w-none bg-white">
            <div className="relative w-full h-full flex flex-col">
              {/* Bouton Close stylisé */}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Fermer"
                className="group absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-gray-200 shadow hover:bg-white transition"
              >
                {/* Barre longue */}
                <span className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 h-0.5 w-6 bg-gray-800 transition-all duration-300 group-hover:rotate-45 group-hover:top-1/2"></span>
                {/* Barre courte */}
                <span className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 h-0.5 w-4 bg-gray-800 transition-all duration-300 group-hover:-rotate-45 group-hover:w-6 group-hover:top-1/2"></span>
              </button>
              {/* Bouton Historique */}
              <button
                type="button"
                onClick={() => setHistoryOpen((s) => !s)}
                aria-label="Historique"
                className="group absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-gray-200 shadow hover:bg-white transition flex items-center justify-center"
              >
                <History className="h-5 w-5 text-gray-700" />
              </button>

              {/* Overlay pour fermer l'historique */}
              {historyOpen && (
                <div
                  className="absolute inset-0 bg-black/10 z-40"
                  onClick={() => setHistoryOpen(false)}
                />
              )}

              {/* Sidebar Historique */}
              <aside
                className={`absolute top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 shadow-xl transform rounded-e-2xl transition-transform duration-300 ${historyOpen ? 'translate-x-0' : '-translate-x-full'}`}
              >
                <div className="h-full flex flex-col">
                  <div className="px-4 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-gray-700" />
                      <span className="text-sm font-semibold text-gray-800">Historique</span>
                    </div>
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => { setSearchHistory([]); saveHistory([]); }}
                    >
                      Vider
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {searchHistory.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500">Aucun historique.</div>
                    ) : (
                      <ul className="divide-y">
                        {searchHistory.map((item, idx) => (
                          <li
                            key={idx}
                            className="p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => { setQuery(item.q); setHistoryOpen(false); setStage('loading'); runSearch(item.q); }}
                          >
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.q}</div>
                            <div className="text-xs text-gray-500">{new Date(item.date).toLocaleString()}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </aside>

              {/* Barre supérieure visible en mode loading/results */}
              {stage !== "idle" && (
                <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
                  <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher..."
                        className="pl-9 h-11"
                      />
                    </div>
                    <Button onClick={handleModalSearch} disabled={isLoading} className="h-11 min-w-32 overflow-hidden">
                      {runnerVisible ? (
                        <span className="inline-flex items-center">
                          <img
                            src={start}
                            alt="recherche"
                            className={`w-10 transition-transform duration-300 ease-out ${runnerExit ? 'translate-x-[200%]' : 'translate-x-0'}`}
                          />
                          {isLoading ? ' Recherche...' : ''}
                        </span>
                      ) : (
                        isLoading ? "Recherche..." : "Rechercher"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Contenu principal du modal */}
              <div className="flex-1 overflow-auto">
                {stage === "idle" && (
                  <div className="h-full w-full flex items-center justify-center p-6">
                    <div className="w-full max-w-2xl">
                      <div className="text-center mb-6">
                        <h2 className="redhawk text-2xl md:text-4xl font-bold text-gray-900 mb-2">Recherche avancée</h2>
                        <p className="text-gray-600">Saisissez un mot-clé (ex: ville, type de bien, caractéristiques)</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              autoFocus
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder="Ex - 2 chambres, Saint-Pierre, < 300 000 €"
                              className="pl-10 h-12"
                            />
                          </div>
                          <Button size="lg" className="h-12 min-w-32" onClick={handleModalSearch}>
                            Rechercher
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {stage === "loading" && (
                  <div className="h-full w-full flex flex-col items-center justify-center p-6">

                    <LoadingSpinner size="lg" text="Recherche en cours" />
                  </div>
                )}

                {stage === "results" && (
                  <div className="max-w-5xl mx-auto p-4">
                    {results.length > 0 ? (
                      (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.map((r, idx) => (
                          <div
                            key={(r.id as any) ?? idx}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:shadow cursor-pointer"
                            onClick={() => handleSelect(r)}
                          >
                            <img
                              src={r.image || "/placeholder.jpg"}
                              alt={r.title}
                              className="w-16 h-16 rounded object-cover border"
                              loading="lazy"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-gray-900 line-clamp-2">{r.title}</div>
                              {r.type && <div className="text-xs text-gray-500 mt-0.5">{r.type}</div>}
                            </div>
                          </div>
                        ))}
                      </div>)
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center py-20 text-center text-gray-600">
                        {query.trim() ? (
                          <>
                            <div className="text-lg font-semibold mb-2">Désolé, aucun résultat ne correspond à votre demande.</div>
                            <div className="text-sm">Essayez d'autres mots-clés ou vérifiez l'orthographe.</div>
                          </>
                        ) : (
                          <div className="text-lg font-semibold">Veuillez saisir un terme de recherche.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
};

export default Hero;
