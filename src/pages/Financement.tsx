import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function Financement() {
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header/>
        <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 animate-fadeIn">
          Financement de Votre Projet
        </h1>
        <p className="text-gray-600 mb-8 max-w-xl animate-fadeIn">
          Obtenez un accompagnement personnalisé pour financer la création de
          votre espace, que ce soit un projet professionnel ou personnel.
        </p>

        <div className="flex gap-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3"
            onClick={() => setShowServiceModal(true)}
          >
            Voir nos services
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3"
            onClick={() => setShowSimulationModal(true)}
          >
            Simuler un financement
          </Button>
        </div>
      </main>

      {showServiceModal && (
        <ServiceModal
          onClose={() => setShowServiceModal(false)}
          onContactClick={() => setShowContactModal(true)}
        />
      )}

      {showSimulationModal && (
        <SimulationModal
          onClose={() => setShowSimulationModal(false)}
          onContactClick={() => setShowContactModal(true)}
        />
      )}

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}


      <style >{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(3deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>

    </div>
    
  );
}

// ----------- Composant ServiceModal -----------

function ServiceModal({
  onClose,
  onContactClick,
}: {
  onClose: () => void;
  onContactClick: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-4">Nos services de financement</h2>
      <p className="text-gray-600 mb-6">
        Nous vous accompagnons à chaque étape : étude de faisabilité, plan de
        financement et mise en relation avec nos partenaires bancaires.
      </p>
      <Button onClick={onContactClick} className="bg-blue-600 hover:bg-blue-700">
        Nous contacter
      </Button>
    </Modal>
  );
}

// ----------- Composant SimulationModal -----------

function SimulationModal({
  onClose,
  onContactClick,
}: {
  onClose: () => void;
  onContactClick: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-4">Simulez votre financement</h2>
      <p className="text-gray-600 mb-6">
        Calculez vos mensualités et trouvez la meilleure offre pour votre projet.
      </p>
      <Button onClick={onContactClick} className="bg-green-600 hover:bg-green-700">
        Contacter un conseiller
      </Button>
    </Modal>
  );
}

// ----------- Composant ContactModal -----------

function ContactModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-4">Contactez-nous</h2>
      <p className="text-gray-600 mb-6">
        Laissez-nous vos coordonnées, et notre équipe vous recontactera dans les plus
        brefs délais.
      </p>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nom"
          className="border rounded-lg p-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border rounded-lg p-2"
          required
        />
        <textarea
          placeholder="Votre message"
          className="border rounded-lg p-2"
          rows={3}
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Envoyer
        </Button>
      </form>
    </Modal>
  );
}

// ----------- Composant Modal générique -----------

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card className="p-6 bg-white rounded-2xl shadow-lg max-w-lg w-full animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        {children}
      </Card>
    </div>
  );
}
