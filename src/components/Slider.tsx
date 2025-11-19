export default function Test() {
  const imageSrc = [
    {
      src: "/logo1.png",
      alt: "Image",
    },
    {
      src: "/logo2.png",
      alt: "Image",
    },
    {
      src: "/logo1.png",
      alt: "Image",
    },
    {
      src: "/logo2.png",
      alt: "Image",
    },
    {
      src: "/logo1.png",
      alt: "Image",
    },
    {
      src: "/logo2.png",
      alt: "Image",
    },
    {
      src: "/logo1.png",
      alt: "Image",
    },
    {
      src: "/logo2.png",
      alt: "Image",
    }
  ];

  return (
    <div className="relative my-4">
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
          w-11/12 flex h-56 mx-auto overflow-auto 
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
            flex w-max gap-10 pr-10
            animate-[move_20s_linear_infinite] animation-pausable
          "
        >
          {imageSrc.map((image, i) => (
            <div
              key={i}
              className="
                flex-none py-7 flex justify-center items-center h-full w-28 lg:w-52
                transition-all duration-500 ease-in-out
                group-hover:scale-105
                hover:!scale-110
              "
            >
              <div className="
                p-4 
                backdrop-blur-2xl
                bg-white/10
                border border-white/20
                rounded-2xl
                
                shadow-black/20
                transition-all duration-500
                hover:bg-white/15
                hover:border-white/30
                hover:shadow-2xl hover:shadow-white/10
              ">
                <img
                  className="object-contain filter  hover:grayscale transition-all duration-500 brightness-110 contrast-110"
                  src={image.src}
                  alt={image.alt} 
                  width={130} 
                  height={130}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          aria-hidden
          className="
            flex w-max gap-10 pr-10
            animate-[move_20s_linear_infinite] animation-pausable
          "
        >
          {imageSrc.map((image, i) => (
            <div
              key={i}
              className="
                flex-none py-7 flex justify-center items-center h-full w-28 lg:w-52
                transition-all duration-500 ease-in-out
                group-hover:scale-105
              "
            >
              <div className="
                p-4 
                backdrop-blur-2xl
                bg-white/10
                border border-white/20
                rounded-2xl
                
                shadow-black/20
                transition-all duration-500
              ">
                <img
                  className="object-contain filter hover:grayscale brightness-110 contrast-110"
                  src={image.src}
                  alt={image.alt} 
                  width={130} 
                  height={130}
                />
              </div>
            </div>
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
  );
}