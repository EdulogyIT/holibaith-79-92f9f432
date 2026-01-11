import { useLanguage } from "@/contexts/LanguageContext";
import verifiedImage from "@/assets/property-villa-mediterranean.jpg";
import curatedImage from "@/assets/property-luxury-apartment.jpg";
import localImage from "@/assets/city-constantine.jpg";
import premiumImage from "@/assets/city-alger.jpg";

const WhyChooseSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      id: 'verified',
      title: t('verifiedPropertiesTitle'),
      description: t('verifiedPropertiesDesc'),
      image: verifiedImage
    },
    {
      id: 'curated',
      title: t('curatedExcellenceTitle'),
      description: t('curatedExcellenceDesc'),
      image: curatedImage
    },
    {
      id: 'local',
      title: t('localExpertiseTitle'),
      description: t('localExpertiseDesc'),
      image: localImage
    },
    {
      id: 'premium',
      title: t('premiumServiceTitle'),
      description: t('premiumServiceDesc'),
      image: premiumImage
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair italic text-foreground mb-4">
            {t('whyChooseTitleNew')}
          </h2>
          <p className="text-lg text-muted-foreground font-inter font-light max-w-3xl mx-auto">
            {t('whyChooseSubtitleNew')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.id} className="group relative overflow-hidden rounded-2xl">
              <div className="relative h-80 overflow-hidden rounded-2xl">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-playfair font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground font-inter leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;