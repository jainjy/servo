import React from 'react';
import {
  X,
  CheckCircle,
  Info,
  Shield,
  Clock,
  Star,
  FileText,
  AlertCircle,
  Users,
  Calendar,
} from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: any;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Overlay pour fermer */}
      <button
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Fermer la modale"
      />

      {/* Modal avec hauteur fixe */}
      <div className="relative z-10 w-full max-w-5xl h-[85vh] rounded-xl overflow-hidden bg-white shadow-xl flex flex-col">
        {/* Header sticky */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
          <div className="flex items-stretch">
            {/* Logo/Image fixe */}
            <div className="flex items-center justify-center px-1 py-1 border-r border-slate-200 min-w-[200px] ">
              <div className="flex flex-col items-center gap-2 ">
                <div className="flex h-16 w-36 items-center justify-center rounded-xl">
                  {typeof data.icon === 'function' ? (
                    <data.icon className="h-7 w-7" />
                  ) : data.imageUrl ? (
                    <img
                      src={data.imageUrl}
                      alt={data.title}
                      className="h-full rounded-lg w-full object-cover"
                    />
                  ) : (
                    <img
                      src={data.icon}
                      alt={data.title}
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Titre et description sticky */}
            <div className="flex-1 px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="pr-4">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {data.title}
                  </h1>
                  <p className="mt-2 text-slate-600 text-xs">
                    {data.description}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors flex-shrink-0"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne principale (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Couvertures principales */}
                <section className="bg-white rounded-lg border border-slate-200 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <Shield className="h-5 w-5 text-slate-900" />
                    <h2 className="text-lg font-semibold text-slate-900">
                      Couvertures principales
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.features?.map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-800 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Avantages clés */}
                {data.details?.avantages && (
                  <section className="bg-white rounded-lg border border-slate-200 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <Star className="h-5 w-5 text-slate-900" />
                      <h2 className="text-lg font-semibold text-slate-900">
                        Avantages clés
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {data.details.avantages.map(
                        (avantage: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3"
                          >
                            <div className="h-2 w-2 rounded-full bg-slate-900 mt-2 flex-shrink-0" />
                            <p className="text-slate-700 text-xs">{avantage}</p>
                          </div>
                        )
                      )}
                    </div>
                  </section>
                )}

                {/* Informations pratiques */}
                {data.details?.infosPratiques && (
                  <section className="bg-white rounded-lg border border-slate-200 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-slate-900" />
                      <h2 className="text-lg font-semibold text-slate-900">
                        Informations pratiques
                      </h2>
                    </div>
                    <div>
                      {data.details.infosPratiques.map(
                        (info: string, index: number) => (
                          <div
                            key={index}
                            className="flex gap-4 p-3 rounded-md bg-slate-50"
                          >
                            <div className="h-8 w-8 rounded-full border border-slate-300 text-sm font-semibold text-slate-700 flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </div>
                            <p className="text-slate-700 pt-1 text-xs">{info}</p>
                          </div>
                        )
                      )}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar sticky (1/3) */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  {/* En bref */}
                  <div className="bg-white rounded-lg border border-slate-200 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <Info className="h-5 w-5 text-slate-900" />
                      <h2 className="text-lg font-semibold text-slate-900">
                        En bref
                      </h2>
                    </div>
                    
                    <div className="space-y-5">
                      {data.details?.délaiTraitement && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-700" />
                            <h3 className="text-sm font-medium text-slate-700">
                              Délai de traitement
                            </h3>
                          </div>
                          <p className="text-slate-700 pl-6 text-xs">
                            {data.details.délaiTraitement}
                          </p>
                        </div>
                      )}

                      {data.details?.niveauCouverture && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-slate-700" />
                            <h3 className="text-sm font-medium text-slate-700">
                              Niveaux disponibles
                            </h3>
                          </div>
                          <p className="text-slate-700 pl-6 text-xs">
                            {data.details.niveauCouverture}
                          </p>
                        </div>
                      )}

                      {data.details?.documentsRequis && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-700" />
                            <h3 className="text-sm font-medium text-slate-700">
                              Documents requis
                            </h3>
                          </div>
                          <ul className="space-y-2 pl-6 text-xs">
                            {data.details.documentsRequis.map(
                              (doc: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                                  <span className="text-slate-700">{doc}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Conseils */}
                  {data.details?.conseils && (
                    <div className="bg-white rounded-lg border border-slate-200 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <Users className="h-5 w-5 text-slate-900" />
                        <h2 className="text-lg font-semibold text-slate-900">
                          Nos conseils
                        </h2>
                      </div>
                      <div className="space-y-3">
                        {data.details.conseils.map(
                          (conseil: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="h-2 w-2 rounded-full bg-slate-900 mt-2 flex-shrink-0" />
                              <p className="text-slate-700 text-xs">{conseil}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Exclusions (pleine largeur) */}
            {data.details?.exclusions && (
              <section className="mt-6 bg-white rounded-lg border border-red-200 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h2 className="text-lg font-semibold text-red-700">
                    Exclusions importantes
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.details.exclusions.map(
                    (exclusion: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-md border border-red-200 bg-red-50"
                      >
                        <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-red-600" />
                        </div>
                        <p className="text-red-800 text-xs">{exclusion}</p>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer fixe */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-3">
          <p className="text-sm text-slate-600 text-center">
            Ces informations sont fournies à titre indicatif. Seul le contrat d'assurance fait référence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;