import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const propertyTypes = [
  {
    key: "apartments",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=800&fit=crop",
    count: "156+"
  },
  {
    key: "villas",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=800&fit=crop",
    count: "43+"
  },
  {
    key: "traditionalHouses",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=800&fit=crop",
    count: "67+"
  },
  {
    key: "beachfront",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=800&fit=crop",
    count: "28+"
  }
];

const BrowseByTypeSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-foreground mb-10">
          {t("browseByType")}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {propertyTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => navigate(`/short-stay?type=${type.key}`)}
              className="relative group overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
            >
              <img
                src={type.image}
                alt={t(type.key)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-left">
                <h3 className="text-card font-semibold text-lg">{t(type.key)}</h3>
                <p className="text-card/80 text-sm">{type.count} {t("properties")}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByTypeSection;
