import AdvertisementPopup from '@/components/AdvertisementPopup';

export default function Test() {
  const imageSrc = [
    {
      src: "/olimmo.png",
      alt: "Image",
      link: "https://www.olimmoreunion.re/"
    },
    {
      src: "/Reunion.png",
      alt: "Image",
      link: "https://www.guyhoquet-reunion.fr/"
    },
    // {
    //   src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1769599947673-6uoigp0lcvw.jpg",
    //   alt: "Image",
    // },
    {
      src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1769515428367-ifzbh3rk92c.png",
      alt: "Image",
    },
    {
      src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768987856807-5aze4kvdkyd.png",
      alt: "Image",
    },
    {
      src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768987792594-y2xzfeeb35e.jpg",
      alt: "Image",
    },
    {
      src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768987729304-3i63o0deunq.png",
      alt: "Image",
    },
    {
      src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768836430476-9b69z2jvyil.png",
      alt: "Image",
    },
    {
      src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768836629052-zn3mvhzd7lg.webp",
      alt: "Image",
    },
    {
      src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768836948448-54bqjn3oh5a.png",
      alt: "Image",
    },
    {
      src: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1769515594088-g834n4v5m57.png",
      alt: "Image",
    }
  ];

  return (
    <div >
      {/* Publicité section Travevaux */}
      < AdvertisementPopup position="section-accueil-partenaire-officiel" size="medium" />

      <div className="relative my-4">
        <span className="absolute bg-white px-2 right-20 -top-5 text-sm lg:text-xl tracking-widest font-serif font-bold z-40 text-black/80 ">LES PARTENAIRES OFFICIELS</span>
        {/* Lignes horizontales décoratives */}
        <div className="absolute -top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/70 to-transparent opacity-80 z-10"></div>
        <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/70 to-transparent opacity-80 z-10"></div>
        <div className="absolute -top-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/60 to-transparent opacity-80 z-10"></div>
        <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/60 to-transparent opacity-80 z-10"></div>

        {/* Effet de surbrillance blanc */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 pointer-events-none z-0"></div>

        <div
          className="
          relative
          w-11/12 flex h-32 lg:h-56 mx-auto overflow-auto 
          [scrollbar-width:none]
          [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]
          group
          
          rounded-2xl
          backdrop-blur-xl
          bg-gradient-to-br from-white/10 to-white/5
          border border-white/20
          
          shadow-white/10
        "
        >

          <div
            className="
            flex w-max gap-2 lg:gap-10 pr-2 lg:pr-10
            animate-[move_30s_linear_infinite] animation-pausable
          "
          >
            {imageSrc.map((image, i) => (
              <a href={image.link} target="_blank" rel="noopener noreferrer">
                <div
                  key={i}
                  className="
                flex-none py-7 flex justify-center items-center  h-full w-28 lg:w-52
                transition-all duration-500 ease-in-out
              "
                >

                  <img
                    className="object-cover w-full h-full filter border-gray-500/10 border rounded-lg bg-gradient-to-r from-black/80 to-slate-900/90  hover:grayscale hover:scale-105 transition-all duration-500 brightness-110 contrast-110"
                    src={image.src}
                    alt={image.alt}
                    width={130}
                    height={130}
                  />

                </div>
              </a>

            ))}
          </div>

          <div
            aria-hidden
            className="
            flex w-max gap-2 lg:gap-10 pr-2 lg:pr-10
            animate-[move_30s_linear_infinite] animation-pausable
          "
          >
            {imageSrc.map((image, i) => (
              <a href={image.link} >
                <div
                  key={i}
                  className="
                flex-none py-7 flex justify-center items-center h-full w-28 lg:w-52
                transition-all duration-500 ease-in-out
               
              "
                >

                  <img
                    className="object-cover rounded-lg w-full h-full border-gray-500/10 border bg-gradient-to-r from-black/80 to-slate-900/90 filter hover:scale-105 hover:grayscale brightness-110 contrast-110"
                    src={image.src}
                    alt={image.alt}
                    width={130}
                    height={130}
                  />

                </div>
              </a>

            ))}
          </div>

          <style>{`
          @keyframes move {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          .group:hover .animation-pausable {
            animation-play-state: paused !important;
          }
        `}</style>
        </div>
      </div>
    </div>
  );
}