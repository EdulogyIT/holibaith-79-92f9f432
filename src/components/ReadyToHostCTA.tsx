import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, ArrowRight } from "lucide-react";

const ReadyToHostCTA = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const stats = [
    { value: '2,500+', label: 'Properties' },
    { value: '50,000+', label: 'Happy Guests' },
    { value: '4.9', label: 'Average Rating' },
  ];

  return (
    <section className="relative py-24 bg-[#2F6B4F] overflow-hidden">
      {/* Mountain/Landscape Overlay - subtle texture */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 1200 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path 
            d="M0,300 L200,200 L400,280 L600,150 L800,220 L1000,120 L1200,200 L1200,400 L0,400 Z" 
            fill="currentColor" 
            className="text-white"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Home Icon in White Circle */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Home className="h-8 w-8 text-[#2F6B4F]" />
          </div>
        </div>

        {/* Title */}
        <h2 className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-white mb-4">
          Share your space with travelers
        </h2>
        
        {/* Subtitle */}
        <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-inter font-light leading-relaxed">
          Join Algeria's premier hospitality platform and connect with travelers seeking authentic luxury experiences
        </p>

        {/* Two Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => navigate("/publish-property")}
            className="bg-white text-[#2F6B4F] hover:bg-white/90 font-inter font-semibold px-8 py-6 text-base rounded-lg group"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => navigate("/about")}
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 font-inter font-semibold px-8 py-6 text-base rounded-lg bg-transparent"
          >
            Learn More
          </Button>
        </div>

        {/* Stats Row */}
        <div className="flex justify-center items-center gap-6 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-playfair font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/80 font-inter">{stat.label}</div>
              </div>
              {index < stats.length - 1 && (
                <div className="hidden md:block h-10 w-px bg-white/30 mx-6 md:mx-12" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReadyToHostCTA;
