import { Card } from "@/components/ui/card";
import { Building2, Home, Shield, Star, Clock, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
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
      image: hotelImage,
      route: '/hotels',
      cta: t('exploreHotels') || 'Explore Hotels',
      bullets: [
        { icon: Shield, text: t('hotelsBullet1') || 'Professional service & 24/7 reception' },
        { icon: Star, text: t('hotelsBullet2') || 'Premium amenities & dining options' },
        { icon: Clock, text: t('hotelsBullet3') || 'Flexible booking & instant confirmation' },
      ]
    },
    {
      id: 'short-stay',
      icon: Home,
      title: t('shortStayCardTitle'),
      description: t('shortStayCardDesc'),
      image: villaImage,
      route: '/short-stay',
      cta: t('exploreHomes') || 'Explore Homes',
      bullets: [
        { icon: Check, text: t('shortStayBullet1') || 'Every home personally verified by our team' },
        { icon: Star, text: t('shortStayBullet2') || 'Unique properties with local character' },
        { icon: Home, text: t('shortStayBullet3') || 'Full kitchens & home-like amenities' },
      ]
    }
  ];

  const stats = [
    { value: '2,500+', label: t('propertiesPlus') || 'Properties' },
    { value: '50,000+', label: t('happyGuests') || 'Happy Guests' },
    { value: '4.9', label: t('averageRating') || 'Average Rating' },
  ];

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair italic text-foreground mb-4">
            {t('twoWaysTitle')}
          </h2>
          <p className="text-lg text-muted-foreground font-inter font-light max-w-3xl mx-auto leading-relaxed">
            {t('twoWaysSubtitle')}
          </p>
        </div>

        {/* Two Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {ways.map((way) => {
            const IconComponent = way.icon;
            return (
              <Card
                key={way.id}
                className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500 bg-card rounded-2xl"
              >
                {/* Image Section */}
                <div className="relative h-64 md:h-72 overflow-hidden">
                  <img
                    src={way.image}
                    alt={way.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Icon Badge - Top Left on Image */}
                  <div className="absolute top-6 left-6 bg-white rounded-full p-3 shadow-lg">
                    <IconComponent className="h-5 w-5 text-[#2F6B4F]" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-playfair font-semibold text-foreground mb-3">
                    {way.title}
                  </h3>
                  <p className="text-muted-foreground font-inter leading-relaxed mb-6">
                    {way.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-3 mb-6">
                    {way.bullets.map((bullet, index) => {
                      const BulletIcon = bullet.icon;
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2F6B4F]/10 flex items-center justify-center">
                            <BulletIcon className="h-3 w-3 text-[#2F6B4F]" />
                          </div>
                          <span className="text-sm text-muted-foreground font-inter">{bullet.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => navigate(way.route)}
                    className="bg-[#2F6B4F] hover:bg-[#2F6B4F]/90 text-white font-inter font-medium px-6 py-3 rounded-lg group/btn"
                  >
                    {way.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <p className="text-muted-foreground font-inter mb-6">{t('trustedByTravelers') || 'Trusted by travelers across Algeria'}</p>
          <div className="flex justify-center items-center gap-8 md:gap-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-playfair font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-inter mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoWaysSection;
