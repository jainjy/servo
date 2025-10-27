import React, { useState, useEffect } from "react";
import home from '@/assets/investissement.jfif'

// --- A. DONNÉES ET COULEURS (Ajustées) ---
const primaryColor = "indigo";
const accentColor = "purple";
const gradientClasses = "bg-slate-900";
const hoverBorderClass = `hover:border-${accentColor}-600`;
const hoverTextClass = `group-hover:text-${accentColor}-600`;

const KEY_ACTIONS = [
    {
        id: 1,
        text: "Découvrir la Solution",
        type: "SCPI",
        link: "/investir/scpi",
        description: "Immobilier Géré (SCPI & Ass. Vie)",
        iconPath: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
        isModal: false,
    },
    {
        id: 2,
        text: "Découvrir la Solution",
        type: "CROWDFUNDING",
        link: "/investir/crowdfunding",
        description: "Financement Participatif Immobilier",
        iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2H6.5M5 11.5H9M5 15.5H9m3 4v-4H10",
        isModal: false,
    },
    {
        id: 3,
        text: "Découvrir la Solution",
        type: "CRYPTO",
        link: "/investir/crypto",
        description: "Gestion de Crypto-actifs & Blockchain",
        iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
        isModal: false,
    },
    {
        id: 4,
        text: "Découvrir la Solution",
        type: "ISR",
        link: "/investir/isr",
        description: "Fonds à Impact Social et Environnemental (ISR)",
        iconPath: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
        isModal: false,
    },
];

const INVESTISSEMENTS_OPPORTUNITES = [
    {
        id: 10,
        title: "Expertise Immobilière Complète",
        description: "Nous gérons l'achat, la vente et la gestion locative pour maximiser la valeur de vos biens. Une solution clé en main.",
        image: "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=800&q=80",
        buttonText: "Contacter l'Agence",
        link: "/services/immobilier",
        iconPath: "M12 8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm-7 0a7 7 0 1014 0A7 7 0 005 8z",
    },
    {
        id: 20,
        title: "Conseil en Stratégie de Diversification",
        description: "Optimisez votre portefeuille en intégrant des actifs alternatifs et des stratégies fiscales avancées pour un rendement maximal.",
        image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&w=800&q=80",
        buttonText: "Consulter un Expert",
        link: "/services/conseil",
        iconPath: "M9 12h6m-3-3v6m-6 3h12a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
];

// --- B. SKELETON & TRANSITION ---
const SkeletonCard = () => (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm animate-pulse h-64 md:h-72">
        <div className="h-48 w-full bg-gray-100"></div>
        <div className="p-6">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
        </div>
    </div>
);

const SkeletonButton = () => (
    <div className="h-48 bg-gray-200 rounded-2xl shadow-lg animate-pulse"></div>
)

const TransitionWrapper = ({ children, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    const delay = 50 + index * 100;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`transition-all duration-500 ease-out 
                         ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            {children}
        </div>
    );
}

// --- C. KeyActionButton ---
const KeyActionButton = ({ item }) => {
    return (
        <a
            href={item.link}
            aria-label={`Accéder à : ${item.description}`}
            className={`block h-full p-7 rounded-3xl border-2 border-gray-100 shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1
                         ${hoverBorderClass} group bg-white`}
        >
            <div className="flex flex-col h-full justify-between">
                {/* Icône entourée */}
                <div className={`flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-${accentColor}-50 transition duration-300`}>
                    <svg className={`w-6 h-6 text-${accentColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.iconPath} />
                    </svg>
                </div>

                {/* TITRE PRINCIPAL */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug flex-grow">
                    {item.description}
                </h3>

                {/* Description */}
                <div className="mb-4">
                    <p className={`text-xs font-semibold uppercase text-gray-400 transition`}>
                        {item.type}
                    </p>
                </div>

                {/* BOUTON D'APPEL À L'ACTION */}
                <span
                    className={`inline-flex justify-center items-center w-full text-white font-semibold tracking-wide 
                                 px-4 py-3 rounded-xl text-md text-center
                                 ${gradientClasses} shadow-lg transition duration-300 ease-in-out 
                                 transform group-hover:scale-[1.01] group-hover:shadow-2xl`}
                >
                    {item.text}
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </span>
            </div>
        </a>
    );
};

// --- D. InfoCard ---
const InfoCard = ({ item }) => {
    const textColorClass = `text-${accentColor}-600`;

    return (
        <a
            href={item.link}
            aria-label={`Découvrir le service : ${item.title}`}
            className={`group block bg-white h-full border border-gray-200 rounded-3xl overflow-hidden shadow-2xl
                         hover:shadow-3xl ${hoverBorderClass} transition duration-500 ease-in-out transform hover:-translate-y-1`}
        >
            <img
                src={item.image}
                alt={`Illustration : ${item.title}`}
                className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.05] group-hover:opacity-85"
                loading="lazy"
            />
            <div className="p-8 flex flex-col h-[calc(100%-14rem)]">
                <div className="flex-grow">
                    <h2 className={`text-3xl font-extrabold text-gray-900 mb-3 transition ${hoverTextClass}`}>
                        {item.title}
                    </h2>
                    <p className="text-gray-600 text-lg font-normal leading-relaxed">{item.description}</p>
                </div>
                <span className={`mt-6 text-lg font-bold ${textColorClass} flex items-center`}>
                    {item.buttonText}
                    <svg className="ml-2 w-5 h-5 transition duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </span>
            </div>
        </a>
    );
};

// --- E. COMPOSANT PRINCIPAL (Investissement) ---
const Investissement = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const finalDelay = 1500 + 500;
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, finalDelay);
        return () => clearTimeout(timer);
    }, []);

    const buttonsContent = KEY_ACTIONS.map((item, index) => (
        <TransitionWrapper key={item.id} index={index + 1}>
            <KeyActionButton item={item} />
        </TransitionWrapper>
    ));

    const infoCardsContent = INVESTISSEMENTS_OPPORTUNITES.map((item, index) => (
        <TransitionWrapper key={item.id} index={index + KEY_ACTIONS.length + 1}>
            <InfoCard item={item} />
        </TransitionWrapper>
    ));

    return (
        <section id="investissements" className="min-h-screen pt-16 px-4 sm:px-6 lg:px-0">
            <TransitionWrapper index={0}>
                <header className="relative text-center overflow-hidden border-b mb-2 h-72 sm:mb-12">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 backdrop-blur-sm bg-black/50 z-10"></div>
                        <img src={home} alt="" className="absolute -top-28 w-screen h-screen" />
                    </div>
                    <div className="relative z-20 max-w-8xl py-10 mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-300 mb-6 leading-tight">
                            Accélérez votre <span className="inline-block">Patrimoine Financier</span>
                        </h1>
                        <p className="max-w-4xl mx-auto text-md font-semibold text-white mt-4">
                            Nous structurons des solutions d'investissement haut de gamme, de l'immobilier aux actifs numériques, pour atteindre vos objectifs à long terme.
                        </p>
                    </div>
                </header>
            </TransitionWrapper>
            <div className="max-w-7xl w-full mx-auto">
                {/* ZONE 1 : BOUTONS D'ACTION PRINCIPAUX */}
                <div className="">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
                        {isLoading ?
                            Array(4).fill(0).map((_, index) => <SkeletonButton key={index} />)
                            : buttonsContent}
                    </div>
                </div>

                <hr className="border-gray-200 mb-24" />
            </div>
        </section>
    );
};

export default Investissement;