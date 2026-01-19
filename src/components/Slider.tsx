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
    {
      src: "https://i.pinimg.com/1200x/9d/1b/af/9d1baf24622b6c568ed6f41f826c7105.jpg",
      alt: "Image",
    },
    {
      src: "https://i.pinimg.com/1200x/4d/7a/ec/4d7aecb5e539968fec979b35f5618527.jpg",
      alt: "Image",
    },
    {
      src: "https://i.pinimg.com/736x/f0/64/d7/f064d7192801ed944991351e99efdbf2.jpg",
      alt: "Image",
    },
    {
      src: "https://i.pinimg.com/736x/bb/d6/2a/bbd62ab19fe388ef4dac11d2f21be3f7.jpg",
      alt: "Image",
    },
    {
      src: "https://i.pinimg.com/1200x/83/5d/9d/835d9d7c0f06a49b079418cd59914762.jpg",
      alt: "Image",
    },
    {
      src: "https://i.pinimg.com/736x/52/52/5c/52525c7b87e0600a27bf66a9ec1e04f2.jpg",
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
            animate-[move_20s_linear_infinite] animation-pausable
          "
        >
          {imageSrc.map((image, i) => (
            <a href={image.link} target="_blank" rel="noopener noreferrer">
              <div
                key={i}
                className="
                flex-none py-7 flex justify-center items-center h-full w-28 lg:w-52
                transition-all duration-500 ease-in-out
              "
              >

                <img
                  className="object-cover w-full h-full filter rounded-lg bg-gradient-to-r from-black/80 to-slate-900/90  hover:grayscale hover:scale-105 transition-all duration-500 brightness-110 contrast-110"
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
            animate-[move_20s_linear_infinite] animation-pausable
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
                  className="object-cover rounded-lg w-full h-full bg-gradient-to-r from-black/80 to-slate-900/90 filter hover:scale-105 hover:grayscale brightness-110 contrast-110"
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
  );
}