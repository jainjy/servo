import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, LucideIcon } from "lucide-react";
import { ChangeEvent } from "react";
import { ServiceCategory } from "../data/servicesData";
import { Colors } from "../data/colors";

interface ServiceFiltersProps {
  activeServiceCategory: string;
  setActiveServiceCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  serviceCategories: ServiceCategory[];
  trackBusinessInteraction: (
    id: string,
    name: string,
    action: string,
    metadata?: Record<string, any>
  ) => void;
  colors: Colors;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  activeServiceCategory,
  setActiveServiceCategory,
  searchTerm,
  setSearchTerm,
  serviceCategories,
  trackBusinessInteraction,
  colors
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    trackBusinessInteraction(
      "search",
      "Recherche services",
      "search",
      {
        term: searchTerm,
        category: activeServiceCategory,
      }
    );
  };

  const handleCategoryClick = (category: ServiceCategory) => {
    trackBusinessInteraction(
      "filter_category",
      category.label,
      "filter_select",
      {
        category: category.value,
      }
    );
    setActiveServiceCategory(category.value);
  };

  return (
    <>
      {/* Barre de recherche unifiée */}
      <motion.div
        className="max-w-2xl mx-auto grid place-items-center lg:flex gap-4 mb-8 lg:mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex-1 relative">
          <Input
            placeholder="Rechercher un service (création, comptabilité, juridique...)"
            className="pl-12 pr-4 py-3 rounded-xl border-2 bg-white transition-all duration-300"
            style={{
              borderColor: colors.separator,
              backgroundColor: colors.cardBg,
            }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search
            className="absolute left-4 top-3.5 h-5 w-5"
            style={{ color: colors.textSecondary }}
          />
        </div>
        <motion.div>
          <Button
            className="rounded-xl px-8 py-3 font-semibold border-2 transition-all duration-300"
            style={{
              backgroundColor: colors.primaryDark,
              color: colors.lightBg,
              borderColor: colors.primaryDark,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryLight;
              e.currentTarget.style.borderColor = colors.primaryLight;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryDark;
              e.currentTarget.style.borderColor = colors.primaryDark;
            }}
            onClick={handleSearchClick}
          >
            Rechercher
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Filtres des services avec icônes */}
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 100,
            },
          },
        }}
        className="mb-12"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex flex-wrap gap-3 mb-4 lg:mb-8 justify-center">
          {serviceCategories.map((category, index) => {
            const IconComponent = category.icon as LucideIcon;
            return (
              <motion.div key={index}>
                <Button
                  variant={
                    activeServiceCategory === category.value
                      ? "default"
                      : "outline"
                  }
                  className="rounded-xl font-semibold px-4 lg:px-6 py-3 transition-all duration-300 flex items-center gap-2"
                  style={
                    activeServiceCategory === category.value
                      ? {
                          backgroundColor: colors.primaryDark,
                          color: colors.lightBg,
                          borderColor: colors.primaryDark,
                        }
                      : {
                          borderColor: colors.separator,
                          color: colors.textPrimary,
                          backgroundColor: "transparent",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (activeServiceCategory !== category.value) {
                      e.currentTarget.style.borderColor = colors.primaryDark;
                      e.currentTarget.style.color = colors.primaryDark;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeServiceCategory !== category.value) {
                      e.currentTarget.style.borderColor = colors.separator;
                      e.currentTarget.style.color = colors.textPrimary;
                    }
                  }}
                  onClick={() => handleCategoryClick(category)}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default ServiceFilters;