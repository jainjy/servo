// Simple localStorage-backed store for demo: store demandes sent to artisans
export interface StoredDemande {
  id: string
  titre: string
  description: string
  client?: string
  metier?: string
  lieu?: string
  date?: string
  urgent?: string
  artisanId?: string
  status?: 'sent' | 'accepted' | 'refused' | 'confirmed' | 'finished'
  // Optional textual devis or a PDF file stored as a data URL (base64)
  devis?: string
  devisFile?: { name: string; dataUrl: string }
  // Optional signed document uploaded by client
  signedFile?: { name: string; dataUrl: string }
  signedAt?: string
  // Appointment proposed/confirmed by artisan
  appointmentDate?: string
  appointmentTime?: string
  // Invoice file uploaded by artisan
  factureFile?: { name: string; dataUrl: string }
  factureSentAt?: string
  // Review left by the client once the work is finished
  rating?: number
  reviewText?: string
  reviewAt?: string
  createdAt: string
}

const KEY = 'mock_tr_demandes'

export function saveDemande(demande: StoredDemande) {
  const existing = loadDemandes()
  const updated = [demande, ...existing]
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function loadDemandes(): StoredDemande[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as StoredDemande[]
  } catch (e) {
    console.error('Failed to load demandes', e)
    return []
  }
}

export function updateDemandeStatus(id: string, status: StoredDemande['status']) {
  const demandes = loadDemandes()
  const updated = demandes.map(d => d.id === id ? { ...d, status } : d)
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function getDemandeById(id: string) {
  const demandes = loadDemandes()
  return demandes.find(d => d.id === id) as StoredDemande | undefined
}

export function updateDemande(id: string, changes: Partial<StoredDemande>) {
  const demandes = loadDemandes()
  const updated = demandes.map(d => d.id === id ? { ...d, ...changes } : d)
  localStorage.setItem(KEY, JSON.stringify(updated))
}
