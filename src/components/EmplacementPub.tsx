import '@/styles/font.css'
import Video from './Video';
import vids from '/Home.mp4'

export default function EmplacementPub() {
    return (
        <>
            <div className="w-full h-96 px-8">
                <div className="bg-slate-900 p-2 w-full h-full rounded-lg">
                    <div className="w-full h-full rounded-lg flex lg:flex-row flex-col justify-center items-center 
      bg-gradient-to-br from-slate-900 via-slate-600 to-black 
      relative overflow-hidden">
                        <div className='flex-1  h-full w-full'>
                            <Video src={vids} className='' />
                        </div>

                        {/* effet de lumière subtil */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-black/40 via-transparent to-white/10 mix-blend-overlay"></div>
                        <div className='flex-1 p-5 gap-3 flex flex-col justify-center items-start h-full'>
                            <h1 className="text-xs lg:text-xl azonix font-extrabold text-white mix-blend-overlay">
                                🎬 RÉVOLUTIONNEZ VOTRE EXPÉRIENCE VIDÉO AVEC NOTRE LECTEUR ULTIME ! 🌟
                            </h1>
                            <span className='text-white text-xs tracking-wide lg:text-sm  font-extralight '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure dolorem commodi aut quos odio sit. Ipsum nisi quis possimus perferendis numquam optio in voluptatibus itaque eos vitae. Ipsam, voluptates eveniet?</span>
                            <button className=' hover:bg-white/70 transition bg-white px-5 py-3 rounded-full font-semibold mt-7 cursor-pointer '>En savoir plus</button>
                        </div>
                        <span className='absolute right-4 bottom-4 underline text-white text-xs font-semibold'>Publicité</span>
                    </div>
                </div>
            </div>

        </>
    )
}