import { TrendingUp } from "lucide-react";

const StatCard = ({ stat }) => {
    const IconComponent = stat.icon;
        return (
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-gray-500 uppercase font-semibold tracking-wide">{stat.title}</span>
                    <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6" />
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-xs text-blue-600 flex items-center gap-2"><TrendingUp className="w-4 h-4" />{stat.change}</div>
            </div>
        );
}
 
export default StatCard;