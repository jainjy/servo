import React, { useEffect, useState } from 'react'

const AdvertisementBanner = ({ position = 'header' }) => {
  const [advertisements, setAdvertisements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAds = async () => {
      try {
        const response = await fetch(`/api/advertisements/active?position=${position}`)
        const result = await response.json()
        
        if (result.success) {
          setAdvertisements(result.advertisements)
        }
      } catch (error) {
        console.error('Erreur chargement publicités:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAds()
  }, [position])

  const handleAdClick = async (adId, targetUrl) => {
    try {
      // Enregistrer le clic
      await fetch(`/api/advertisements/${adId}/click`, { method: 'POST' })
      
      // Rediriger si une URL cible est définie
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.error('Erreur enregistrement clic:', error)
    }
  }

  if (loading || advertisements.length === 0) {
    return null
  }

  return (
    <div className={`ad-container ad-${position}`}>
      {advertisements.map((ad) => (
        <div 
          key={ad.id}
          className="ad-banner cursor-pointer transition-opacity hover:opacity-90"
          onClick={() => handleAdClick(ad.id, ad.targetUrl)}
        >
          <img 
            src={ad.imageUrl} 
            alt={ad.title}
            className="w-full h-auto rounded-lg"
          />
          {ad.description && (
            <div className="ad-description mt-2 text-sm text-muted-foreground">
              {ad.description}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default AdvertisementBanner