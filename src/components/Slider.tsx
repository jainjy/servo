import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Enregistrement du plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const imageSrc = [
  {
    src: "/olimmo.png",
    alt: "Image",
    link: "https://www.olimmoreunion.re/",
    hasBackground: false
  },
  {
    src: "/Reunion.png",
    alt: "Image",
    link: "https://www.guyhoquet-reunion.fr/",
    hasBackground: true
  },
  {
    src: "/logo-habitat-sur.jpg",
    alt: "Image",
    link: "https://www.facebook.com/share/1L35wnjwrp/?mibextid=wwXIfr",
    hasBackground: false
  },
  {
    src: "/logo-kayak-transparent.png",
    alt: "Image",
    link: "https://share.google/2uYXjkFjIDncmxSsu",
    hasBackground: false 
  },
  {
    src: "/logo-geometre-cabinet-beguin.png",
    alt: "Image",
    link: "https://www.geometre-expert.fr/cabinet/cabinet-beguin-geometres-experts/",
    hasBackground: false
  },
  {
    src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1769515428367-ifzbh3rk92c.png",
    alt: "Image",
    hasBackground: false
  },
  {
    src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768987856807-5aze4kvdkyd.png",
    alt: "Image",
    hasBackground: true
  },
  {
    src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768987792594-y2xzfeeb35e.jpg",
    alt: "Image",
    hasBackground: false
  },
  {
    src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768987729304-3i63o0deunq.png",
    alt: "Image",
    hasBackground: false
  },
  {
    src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768836430476-9b69z2jvyil.png",
    alt: "Image",
    hasBackground: true
  },
  {
    src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768836629052-zn3mvhzd7lg.webp",
    alt: "Image",
    hasBackground: false
  },
  {
    src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768836948448-54bqjn3oh5a.png",
    alt: "Image",
    hasBackground: false
  },
  {
    src: "STPM-CONTRUCTION-logo.jpeg",
    alt: "STPM-CONTRUCTION",
    hasBackground: false
  }
];

const LogoSlider = ({ bgVariant = 'dark' }) => {
  const duplicatedImages = [...imageSrc, ...imageSrc];
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const containerRef = useRef(null);

  const getBackgroundColor = () => {
    switch(bgVariant) {
      case 'darker':
        return '#1a1a1a';
      case 'dark':
        return '#2d2d2d';
      case 'medium':
        return '#404040';
      case 'light':
        return '#f5f5f5';
      default:
        return '#2d2d2d';
    }
  };

  const getHoverColor = () => {
    switch(bgVariant) {
      case 'darker':
        return '#2d2d2d';
      case 'dark':
        return '#3d3d3d';
      case 'medium':
        return '#525252';
      case 'light':
        return '#ffffff';
      default:
        return '#3d3d3d';
    }
  };

  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return;

    const track = trackRef.current;
    const container = containerRef.current;
    
    // Calculer la largeur d'un seul set d'images
    const imageWidth = 150 + 20; // largeur image + gap
    const totalWidth = imageSrc.length * imageWidth;
    
    // Animation de base (infinie)
    animationRef.current = gsap.to(track, {
      x: -totalWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: function(x) {
          return (parseFloat(x) % totalWidth) + 'px';
        }
      }
    });

    // ScrollTrigger pour contrôler la vitesse
    ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        if (!animationRef.current) return;
        
        const velocity = self.getVelocity();
        const direction = self.direction;
        
        // Facteurs de vitesse
        let speedFactor = 1;
        
        if (direction === 1) { // Scroll vers le bas
          // Accélération proportionnelle à la vitesse de scroll (max 4x)
          speedFactor = 1 + Math.min(Math.abs(velocity) / 300, 3);
        } else if (direction === -1) { // Scroll vers le haut
          // Inversion légère (max -0.8x)
          speedFactor = -0.3 - Math.min(Math.abs(velocity) / 500, 0.5);
        }
        
        // Appliquer le facteur de vitesse
        gsap.to(animationRef.current, {
          timeScale: speedFactor,
          duration: 0.3,
          overwrite: true
        });
      }
    });

    // Nettoyage
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const styles = `
    .logo-slider-container {
      width: 100%;
      overflow: hidden;
      background: transparent;
      padding: 20px 0;
    }

    .logo-track {
      display: flex;
      gap: 20px;
      width: fit-content;
      will-change: transform;
    }

    .logo-track:hover {
      animation-play-state: paused;
    }

    .logo-item {
      flex-shrink: 0;
      width: 150px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
    }

    .logo-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-content.with-background {
      background-color: ${getBackgroundColor()};
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }

    .logo-content.with-background:hover {
      background-color: ${getHoverColor()};
      transform: scale(1.02);
    }

    .logo-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: filter 0.3s ease;
    }

    .logo-image.with-background {
      filter: brightness(1.1) contrast(1.1);
    }

    .logo-image.with-background:hover {
      filter: brightness(1.2) contrast(1.1);
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="logo-slider-container" ref={containerRef}>
        <div className="logo-track" ref={trackRef}>
          {duplicatedImages.map((image, index) => (
            <a
              key={index}
              href={image.link || '#'}
              target={image.link ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="logo-item"
            >
              <div className={`logo-content ${image.hasBackground ? 'with-background' : ''}`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`logo-image ${image.hasBackground ? 'with-background' : ''}`}
                  loading="lazy"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default LogoSlider;