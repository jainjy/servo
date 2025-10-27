
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
  ]
    ; // exemple d’image

  return (
    <div
      className="
        w-11/12 flex h-20 mx-auto overflow-auto 
        [scrollbar-width:none]
        [mask-image:linear-gradient(to_right,transparent,black,transparent)]
        group
        my-5
      "
    >

      <div
        className="
          flex w-max gap-5 pr-4
          animate-[move_15s_linear_infinite] animation-pausable
        "
      >
        {imageSrc.map((image, i) => (
          <div
            key={i}
            className="
              flex-none py-5 flex justify-center items-center h-full w-16 lg:w-40 rounded-sm
            "
          >

            <img
              className="object-cover "
              src={image.src}
              alt="Image" width={100} height={100}
            />
          </div>
        ))}
      </div>


      <div
        aria-hidden
        className="
          flex w-max gap-5 pr-4 
          animate-[move_15s_linear_infinite]  animation-pausable
        "
      >
        {imageSrc.map((image, i) => (
          <div
            key={i}
            className="
              flex-none  flex justify-center items-center  h-full w-16 lg:w-40 rounded-sm
            "
          >

            <img
              src={image.src}
              alt="Image" width={100} height={100}
            />
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
  );
}
