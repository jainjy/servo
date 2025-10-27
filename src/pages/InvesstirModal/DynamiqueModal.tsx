import React from 'react';
import { useNavigate } from 'react-router-dom';

const accentColor = "violet";
const gradientClasses = "bg-gradient-to-r from-sky-400 to-violet-600";
const CTA_TEXT = "S'investir Maintenant";

const CTAButton = ({ link, onClose, children, customClasses = "bg-violet-600 hover:bg-violet-700" }) => {
    const navigate = useNavigate();
    
    const handleClick = (e) => {
        e.preventDefault();
        onClose(); // Ferme le modal
        navigate(link); // Navigue vers la page
    };

    return (
        <button
            onClick={handleClick}
            className={`inline-flex items-center px-8 py-3 text-white rounded-full transition font-bold shadow-lg
                        ${customClasses} hover:scale-[1.02] transform duration-300`}
        >
            {children}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
        </button>
    );
};

const SCPI_DETAILS = {
    title: "Société Civile de Placement Immobilier (SCPI)",
    subtitle: "L'immobilier géré, sans les contraintes locatives",
    description: "La SCPI vous permet d'investir dans un parc immobilier diversifié (bureaux, commerces, santé) géré par des professionnels. Vous percevez des revenus locatifs potentiels proportionnels à votre investissement, sans vous soucier de la recherche de locataires, des travaux ou des impayés.",
    advantages: [
        "Diversification Immobilière : Répartition des risques sur plusieurs actifs.",
        "Gestion Déléguée : Aucune contrainte de gestion locative ou de syndic.",
        "Rendement Potentiel : Accès à des revenus potentiels réguliers (dividendes).",
        "Accessibilité : Investissement possible avec un capital de départ réduit.",
    ],
};

// --- COMPOSANTS DE CONTENU SPÉCIFIQUES ---
const SCPIContent = ({ onClose }) => (
    <div className="p-4 sm:p-8 max-h-[95vh] overflow-y-auto bg-gray-50">
        <header className="text-center mb-6 pt-4">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{SCPI_DETAILS.title}</h1>
            <p className="text-xl font-light text-violet-600">{SCPI_DETAILS.subtitle}</p>
        </header>
    
        <section className="bg-white p-6 rounded-xl shadow mb-8 border-l-4 border-sky-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Qu'est-ce qu'une SCPI ?</h2>
            <p className="text-gray-700 leading-relaxed">{SCPI_DETAILS.description}</p>
        </section>

        <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-5 text-center">Vos Avantages Clés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SCPI_DETAILS.advantages.map((advantage, index) => (
                    <div key={index} className="flex items-start bg-white p-4 rounded-xl shadow">
                        <svg className="flex-shrink-0 w-5 h-5 mr-3 mt-1 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-700 text-sm font-medium">{advantage}</p>
                    </div>
                ))}
            </div>
        </section>

        <div className="text-center mt-8 pb-4">
            <CTAButton link="/investir/scpi" onClose={onClose} customClasses={gradientClasses}>
                {CTA_TEXT}
            </CTAButton>
        </div>
    </div>
);

const CrowdfundingContent = ({ onClose }) => (
    <div className="p-8 max-h-[95vh] overflow-y-auto bg-white">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">💰 Crowdfunding Immobilier : Les Projets</h1>
        <p className="text-gray-700 mb-6 border-l-4 border-amber-400 pl-3">Découvrez nos opportunités de financement participatif. Investissez directement dans des projets de construction ou de rénovation immobilière.</p>
        <div className="bg-amber-50 p-6 rounded-lg shadow-inner mb-8">
            <h3 className="font-semibold text-lg text-amber-800">Taux de Rendement Moyen Historique :</h3>
            <p className="text-2xl font-bold text-amber-600">8.5% à 10%</p>
            <p className="text-sm text-gray-600 mt-2">Risque de perte en capital. Investissement illiquide.</p>
        </div>
        
        <div className="text-center mt-8">
            <CTAButton link="/investir/crowdfunding" onClose={onClose} customClasses="bg-amber-600 hover:bg-amber-700">
                {CTA_TEXT}
            </CTAButton>
        </div>
    </div>
);

const CryptoContent = ({ onClose }) => (
    <div className="p-8 max-h-[95vh] overflow-y-auto bg-gray-900 text-white">
        <h1 className="text-3xl font-bold text-sky-400 mb-4">₿ Analyse et Expertise Crypto</h1>
        <p className="text-gray-300 mb-6 border-l-4 border-sky-400 pl-3">
            Découvrez nos outils d'analyse pour évaluer les risques et opportunités des crypto-actifs et de la blockchain.
        </p>

        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
            <h3 className="font-semibold text-lg text-white mb-3">Stratégies d'investissement :</h3>
            <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start"><span className="text-sky-400 mr-2">▪</span> Dollar-Cost Averaging (DCA)</li>
                <li className="flex items-start"><span className="text-sky-400 mr-2">▪</span> Analyse fondamentale (Use Case, Tokenomics)</li>
                <li className="flex items-start"><span className="text-sky-400 mr-2">▪</span> Gestion des risques (Volatilité et Sécurité)</li>
            </ul>
        </div>
        
        <p className="text-sm text-gray-500 mt-4 mb-8">
            Avertissement : Les crypto-actifs sont très volatils et présentent un risque de perte en capital.
        </p>

        <div className="text-center mt-8">
            <CTAButton link="/investir/crypto" onClose={onClose} customClasses="bg-sky-600 hover:bg-sky-700">
                {CTA_TEXT}
            </CTAButton>
        </div>
    </div>
);

const ISRContent = ({ onClose }) => (
    <div className="p-8 max-h-[95vh] overflow-y-auto bg-white">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">🌱 Fonds Impact Social (ISR)</h1>
        <p className="text-gray-700 mb-6 border-l-4 border-emerald-400 pl-3">Investissez de manière responsable. Nos fonds ISR sélectionnent des entreprises qui respectent des critères environnementaux, sociaux et de gouvernance (ESG).</p>
        <ul className="space-y-3 mb-8">
            <li className="flex items-start text-gray-700"><span className="text-emerald-500 mr-3 text-xl">✓</span> Impact environnemental positif</li>
            <li className="flex items-start text-gray-700"><span className="text-emerald-500 mr-3 text-xl">✓</span> Éthique sociale et bonne gouvernance</li>
            <li className="flex items-start text-gray-700"><span className="text-emerald-500 mr-3 text-xl">✓</span> Performance financière durable</li>
        </ul>
        
        <div className="text-center mt-8">
            <CTAButton link="/investir/isr" onClose={onClose} customClasses="bg-emerald-600 hover:bg-emerald-700">
                {CTA_TEXT}
            </CTAButton>
        </div>
    </div>
);

// --- LOGIQUE DE SÉLECTION DU CONTENU ---
const getModalContent = (contentType) => {
    switch (contentType) {
        case 'SCPI':
            return SCPIContent;
        case 'CROWDFUNDING':
            return CrowdfundingContent;
        case 'CRYPTO':
            return CryptoContent; 
        case 'ISR':
            return ISRContent;
        default:
            return null;
    }
}

/**
 * Modale unifiée et dynamique
 */
const DynamicInvestmentModal = ({ isOpen, onClose, contentType }) => {
    if (!isOpen || !contentType) return null;

    const ContentComponent = getModalContent(contentType);

    if (!ContentComponent) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] transform transition-all duration-300 scale-100 opacity-100 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-900 transition bg-white rounded-full p-1 shadow-md"
                    aria-label="Fermer la modale"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <ContentComponent onClose={onClose} />
            </div>
        </div>
    );
};

export default DynamicInvestmentModal;