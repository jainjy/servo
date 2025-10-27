import { useState } from "react";
import '@/styles/font.css'

export default function Publicite() {
    const [openModal, setOpenModal] = useState(false);

    const partenaires = [
        {
            nom: "Notariat Conseil",
            logo: "https://i.pinimg.com/originals/be/51/11/be511136e442c3997fefd9cd85c92e25.jpg",
            lien: "#",
            description: "Cabinet partenaire en droit immobilier et successoral.",
        },
        {
            nom: "Promoteur Horizon",
            logo: "https://i.pinimg.com/1200x/a4/a9/ab/a4a9abd8e09b78ab6415eee77bcab6d1.jpg",
            lien: "#",
            description: "Promoteur engagé dans la défiscalisation et le neuf durable.",
        },
        {
            nom: "AssurPlus",
            logo: "https://i.pinimg.com/1200x/0c/15/7b/0c157b76e871d6eec5690a7f4d7b2fa2.jpg",
            lien: "#",
            description: "Assurances vie et patrimoine pour toute la famille.",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-gray-100 mt-12 flex flex-col">
            {/* HEADER */}
            <header className="relative overflow-hidden border-b h-60 border-gray-800 py-8 text-center">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                >
                    <source src="/vids.mp4" type="video/mp4" />
                </video>
                <div className="absolute bg-black/75 backdrop-blur-sm top-0 left-0 w-full h-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">

                    <h1 className="text-4xl azonix tracking-wider font-semibold text-white">
                        Espace Publicitaire & Partenaires
                    </h1>
                    <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                        Nos encarts publicitaires sont conçus pour valoriser les acteurs du
                        secteur. Rejoignez nos partenaires dès aujourd’hui.
                    </p>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 max-w-6xl mx-auto px-6 py-12 space-y-16">
                {/* Encarts publicitaires */}
                <section>
                    <h2 className="text-2xl text-slate-800 font-semibold mb-6 border-l-4 border-slate-500 pl-3">
                        Espaces publicitaires disponibles
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-800 hover:bg-gray-700 transition rounded-xl p-6 flex flex-col justify-center items-center text-center border border-gray-700 cursor-pointer"
                            >
                                <div className="h-28 w-full bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">Espace #{i + 1}</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-2">
                                    Emplacement publicitaire disponible.
                                </p>
                                <button
                                    onClick={() => setOpenModal(true)}
                                    className="mt-auto bg-slate-600 hover:bg-slate-500 rounded-lg px-4 py-2 text-sm font-semibold"
                                >
                                    Proposer une publicité
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Partenaires actuels */}
                <section>
                    <h2 className="text-2xl text-slate-800 font-semibold mb-6 border-l-4 border-blue-800 pl-3">
                        Nos premiers partenaires
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {partenaires.map((p, i) => (
                            <a
                                key={i}
                                href={p.lien}
                                className="bg-gray-800 hover:bg-gray-700 transition rounded-xl p-4 shadow-lg flex flex-col items-center text-center"
                            >
                                <div className="w-full h-40 mb-5 overflow-hidden rounded-lg">
                                    <img
                                        src={p.logo}
                                        alt={p.nom}
                                        className="h-full w-full object-cover opacity-90"
                                    />
                                </div>
                                <h3 className="font-semibold">{p.nom}</h3>
                                <p className="text-gray-400 text-sm mt-2">{p.description}</p>
                            </a>
                        ))}
                    </div>

                    <p className="text-gray-800 text-center text-xs font-semibold mt-6">
                        Ces partenaires bénéficient actuellement d’un espace gratuit de
                        visibilité. D’autres seront bientôt disponibles à la vente.
                    </p>
                </section>

                {/* Appel à partenariat */}
                <section className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                    <h3 className="text-xl font-semibold mb-3">
                        Devenez partenaire publicitaire
                    </h3>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                        Vous souhaitez promouvoir vos services sur notre plateforme ? Nous
                        proposons différents formats d’encarts selon la visibilité et la
                        durée souhaitée.
                    </p>
                    <button
                        onClick={() => setOpenModal(true)}
                        className="bg-slate-900 hover:bg-slate-700 rounded-lg px-6 py-2 font-semibold"
                    >
                        Demander une offre
                    </button>
                </section>
            </main>

            {/* MODALE */}
            {openModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-xl relative">
                        <h3 className="text-xl font-semibold mb-4">
                            Demande d’espace publicitaire
                        </h3>
                        <form className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nom de l’entreprise"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="email"
                                placeholder="Adresse e-mail"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Site web (facultatif)"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                            />
                            <textarea
                                placeholder="Décrivez votre projet ou votre type de publicité souhaité"
                                rows={4}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                            <button className="bg-blue-600 hover:bg-blue-500 rounded-lg w-full py-2 font-semibold">
                                Envoyer la demande
                            </button>
                        </form>
                        <button
                            onClick={() => setOpenModal(false)}
                            className="mt-4 w-full text-gray-400 hover:text-gray-200 text-sm"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
