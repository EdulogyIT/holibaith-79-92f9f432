import { Card } from "@/components/ui/card";
import { Building2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import hotelImage from "@/assets/property-luxury-apartment.jpg";
import villaImage from "@/assets/property-villa-mediterranean.jpg";

const TwoWaysSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const ways = [
    {
      id: 'hotels',
      icon: Building2,
      title: t('hotelsCardTitle'),
      description: t('hotelsCardDesc'),
      bullets: [
        t('hotelsBullet1'),
        t('hotelsBullet2'),
        t('hotelsBullet3'),
        t('hotelsBullet4')
      ],
      image: hotelImage,
      route: '/hotels'
    },
    {
      id: 'short-stay',
      icon: Home,
      title: t('shortStayCardTitle'),
      description: t('shortStayCardDesc'),
      bullets: [
        t('shortStayBullet1'),
        t('shortStayBullet2'),
        t('shortStayBullet3'),
        t('shortStayBullet4')
      ],
      image: villaImage,
      route: '/short-stay'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
            {t('twoWaysTitle')}
          </h2>
          <p className="text-lg text-muted-foreground font-inter font-light max-w-3xl mx-auto leading-relaxed">
            {t('twoWaysSubtitle')}
          </p>
        </div>

        {/* Two Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {ways.map((way) => {
            const IconComponent = way.icon;
            return (
              <Card
                key={way.id}
                className="group overflow-hidden border-0 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer bg-card"
                onClick={() => navigate(way.route)}
              >
                {/* Image Section */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={way.image}
                    alt={way.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Icon Badge */}
                  <div className="absolute top-6 left-6 bg-card/95 backdrop-blur-sm rounded-full p-4 shadow-lg">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <h3 className="text-2xl font-playfair font-bold text-foreground mb-3">
                    {way.title}
                  </h3>
                  <p className="text-muted-foreground font-inter leading-relaxed mb-6">
                    {way.description}
                  </p>

                  {/* Bullet Points */}
                  <ul className="space-y-3">
                    {way.bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                        <span className="text-sm text-muted-foreground font-inter">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TwoWaysSection;
