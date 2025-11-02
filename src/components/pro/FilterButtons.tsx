const FilterButtons = ({ filters, selectedFilter, onFilterChange }) => {
    return <>
        <div className="flex gap-2 mb-5 flex-wrap">
            {filters.map(filter => (
                <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedFilter === filter ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white'
                        }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    </>
}
 
export default FilterButtons;