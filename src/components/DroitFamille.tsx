import { useState } from "react";
import '@/styles/font.css'

export default function DroitFamille() {
    const [openModal, setOpenModal] = useState(null);

    const closeModal = () => setOpenModal(null);

    return (
        <div className="min-h-screen bg-slate-50 text-gray-100 mt-12 flex flex-col">
            {/* HEADER */}
            <header
                style={{ backgroundImage: 'url("/fam.jfif")', backgroundSize: 'cover' }}
                className="relative border-b py-8 bg-black overflow-hidden h-60 text-center">
                <div className="absolute bg-black/75 backdrop-blur-sm top-0 left-0 w-full h-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                    <h1 className="text-5xl font-semibold text-slate-100 azonix tracking-widest">Droit de la famille</h1>
                    <p className="text-gray-400 text-sm mt-5">Accompagnement juridique et notarial complet pour protéger votre famille et votre patrimoine</p>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-16">
                {/* Section 1 - Domaines d'intervention */}
                <section>
                    <h2 className="text-2xl text-slate-900 font-semibold mb-6 border-l-4 border-slate-500 pl-3">
                        Nos domaines d'intervention
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {["Divorce et séparation", "Succession et héritage", "Protection du patrimoine"].map((item) => (
                            <div
                                key={item}
                                className="bg-gray-800 hover:bg-gray-700 transition rounded-xl p-6 shadow-lg"
                            >
                                <h3 className="text-lg font-semibold mb-2">{item}</h3>
                                <p className="text-sm text-gray-400">
                                    Nous vous accompagnons dans vos démarches de {item.toLowerCase()} avec écoute et expertise juridique.
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 2 - Services principaux */}
                <section>
                    <h2 className="text-2xl text-slate-900 font-semibold mb-6 border-l-4 border-slate-500 pl-3">
                        Nos services spécialisés
                    </h2>

                    <div className="space-y-4">
                        <button
                            onClick={() => setOpenModal("conseil-notaire")}
                            className="w-full text-left bg-slate-800 hover:bg-slate-700 transition p-4 rounded-lg font-medium"
                        >
                            Consultation avec un notaire pour conseil
                        </button>

                        <button
                            onClick={() => setOpenModal("avocat-divorce")}
                            className="w-full text-left bg-slate-700 hover:bg-slate-600 transition p-4 rounded-lg font-medium"
                        >
                            Accompagnement par un avocat pour divorce
                        </button>

                        <button
                            onClick={() => setOpenModal("huissier")}
                            className="w-full text-left bg-slate-800 hover:bg-slate-700 transition p-4 rounded-lg font-medium"
                        >
                            Intervention d'un commissaire de justice (huissier)
                        </button>

                        <button
                            onClick={() => setOpenModal("succession")}
                            className="w-full text-left bg-slate-700 hover:bg-slate-600 transition p-4 rounded-lg font-medium"
                        >
                            Ouverture et gestion de succession
                        </button>

                        <button
                            onClick={() => setOpenModal("societe-familiale")}
                            className="w-full text-left bg-slate-800 hover:bg-slate-700 transition p-4 rounded-lg font-medium"
                        >
                            Création de société familiale (SCI ou SARL)
                        </button>

                        <button
                            onClick={() => setOpenModal("protection-patrimoine")}
                            className="w-full text-left bg-slate-700 hover:bg-slate-600 transition p-4 rounded-lg font-medium"
                        >
                            Protection du patrimoine et de la famille
                        </button>
                    </div>
                </section>
            </main>

            {/* MODALES */}
            {openModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-xl">
                        <h3 className="text-xl font-semibold mb-4">
                            {openModal === "conseil-notaire" && "Consultation avec un notaire"}
                            {openModal === "avocat-divorce" && "Accompagnement divorce par avocat"}
                            {openModal === "huissier" && "Intervention d'un commissaire de justice"}
                            {openModal === "succession" && "Ouverture de succession"}
                            {openModal === "societe-familiale" && "Création de société familiale"}
                            {openModal === "protection-patrimoine" && "Protection du patrimoine familial"}
                        </h3>

                        {/* FORMULAIRES */}
                        {openModal === "conseil-notaire" && (
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="tel"
                                    placeholder="Téléphone"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Sélectionnez le type de conseil</option>
                                    <option value="patrimoine">Protection patrimoniale</option>
                                    <option value="succession">Succession et donation</option>
                                    <option value="contrat">Contrat de mariage</option>
                                    <option value="autre">Autre</option>
                                </select>
                                <textarea
                                    placeholder="Décrivez votre situation et vos questions"
                                    rows={4}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                                <button className="bg-blue-600 hover:bg-blue-500 rounded-lg w-full py-2 font-semibold">
                                    Demander une consultation
                                </button>
                            </form>
                        )}

                        {openModal === "avocat-divorce" && (
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="tel"
                                    placeholder="Téléphone"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm">
                                    <option value="">Type de divorce</option>
                                    <option value="consentement">Divorce par consentement mutuel</option>
                                    <option value="contentieux">Divorce contentieux</option>
                                    <option value="acceptation">Divorce accepté</option>
                                    <option value="alteration">Divorce pour altération du lien conjugal</option>
                                </select>
                                <textarea
                                    placeholder="Situation familiale et patrimoniale"
                                    rows={4}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                ></textarea>
                                <button className="bg-blue-600 hover:bg-blue-500 rounded-lg w-full py-2 font-semibold">
                                    Contacter un avocat
                                </button>
                            </form>
                        )}

                        {openModal === "huissier" && (
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm">
                                    <option value="">Type d'intervention</option>
                                    <option value="signification">Signification d'acte</option>
                                    <option value="paiement">Sommation de payer</option>
                                    <option value="injonction">Injonction de faire</option>
                                    <option value="constat">Constat d'huissier</option>
                                    <option value="expulsion">Expulsion</option>
                                </select>
                                <textarea
                                    placeholder="Détails de la mission requise"
                                    rows={4}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                ></textarea>
                                <button className="bg-blue-600 hover:bg-blue-500 rounded-lg w-full py-2 font-semibold">
                                    Demander l'intervention
                                </button>
                            </form>
                        )}

                        {openModal === "succession" && (
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom du défunt"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Votre nom et qualité (héritier, exécuteur testamentaire...)"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm">
                                    <option value="">Situation successorale</option>
                                    <option value="testament">Avec testament</option>
                                    <option value="sans-testament">Sans testament</option>
                                    <option value="donation">Avec donation antérieure</option>
                                </select>
                                <textarea
                                    placeholder="Composition du patrimoine et situation familiale"
                                    rows={4}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                ></textarea>
                                <button className="bg-blue-600 hover:bg-blue-500 rounded-lg w-full py-2 font-semibold">
                                    Ouvrir la succession
                                </button>
                            </form>
                        )}

                        {openModal === "societe-familiale" && (
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm">
                                    <option value="">Type de société</option>
                                    <option value="sci">SCI (Société Civile Immobilière)</option>
                                    <option value="sarl">SARL Familiale</option>
                                    <option value="autre">Autre structure</option>
                                </select>
                                <textarea
                                    placeholder="Objectif de la société et composition familiale des associés"
                                    rows={4}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                ></textarea>
                                <button className="bg-blue-600 hover:bg-blue-500 rounded-lg w-full py-2 font-semibold">
                                    Étudier le projet
                                </button>
                            </form>
                        )}

                        {openModal === "protection-patrimoine" && (
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm">
                                    <option value="">Type de protection recherchée</option>
                                    <option value="succession">Transmission successorale</option>
                                    <option value="donation">Donation familiale</option>
                                    <option value="assurance-vie">Assurance vie</option>
                                    <option value="demembrement">Démembrement de propriété</option>
                                    <option value="autre">Autre dispositif</option>
                                </select>
                                <textarea
                                    placeholder="Description de votre patrimoine et objectifs de protection"
                                    rows={4}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                ></textarea>
                                <button className="bg-blue-600 hover:bg-blue-500 rounded-lg w-full py-2 font-semibold">
                                    Demander un audit patrimonial
                                </button>
                            </form>
                        )}

                        <button
                            onClick={closeModal}
                            className="mt-6 w-full text-gray-400 hover:text-gray-200 text-sm"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}