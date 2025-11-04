import { Eye, Play, User } from "lucide-react";

const VideoCard = ({ video }) => {
    const IconComponent = video.icon;
    return (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className={`relative h-48 bg-gradient-to-br ${video.gradient} flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <IconComponent className={`w-16 h-16 ${video.iconColor}`} />
                <div className="absolute w-16 h-16 bg-white bg-opacity-95 rounded-full flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Play className="w-6 h-6 ml-1" fill="currentColor" />
                </div>
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-semibold">{video.duration}</div>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <span className="inline-block bg-gray-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase">{video.category}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {video.views}
                    </span>
                </div>
                <h4 className="text-base font-semibold text-gray-800 mb-3 leading-tight">{video.title}</h4>
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="flex items-center gap-2"><User className="w-4 h-4" />{video.author}</span>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;