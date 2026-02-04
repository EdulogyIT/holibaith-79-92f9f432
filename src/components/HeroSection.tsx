import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Search, MapPin, Home, Building2, Calendar as CalendarIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import algeriaHero from "@/assets/algeria-architecture-hero.jpg";
import { DateRangePicker } from "@/components/DateRangePicker";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { GuestsSelector } from "@/components/GuestsSelector";

const HeroSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'hotels' | 'stay'>('stay');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    location: '',
    dateRange: undefined as { from?: Date; to?: Date } | undefined,
    travelers: {
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0
    }
  });

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.location.trim() !== '';
  };

  const modes = [
    {
      id: 'hotels' as const,
      icon: Building2,
      label: t('hotels')
    },
    {
      id: 'stay' as const,
      icon: Home,
      label: t('shortStay')
    }
  ];

  const handleSearch = () => {
    if (!isFormValid()) return;

    const searchParams = new URLSearchParams();
    if (formData.location) searchParams.append('location', formData.location);
    
    if (selectedMode === 'stay') {
      if (formData.dateRange?.from) searchParams.append('checkIn', formData.dateRange.from.toISOString());
      if (formData.dateRange?.to) searchParams.append('checkOut', formData.dateRange.to.toISOString());
      searchParams.append('adults', formData.travelers.adults.toString());
      searchParams.append('children', formData.travelers.children.toString());
      navigate(`/short-stay?${searchParams.toString()}`);
    } else {
      navigate(`/hotels?${searchParams.toString()}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={algeriaHero} 
          alt="Architecture algérienne moderne" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 sm:pt-24 md:pt-20">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair italic font-medium text-white mb-4 leading-tight">
              {t('discoverAlgeriaDifferently')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-inter font-light max-w-2xl mx-auto leading-relaxed">
              {t('hotelsAndVerifiedHomes')}
            </p>
          </div>
          
          {/* Mode Selector - Full Width Rectangular Tabs */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-lg w-full max-w-xl">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-inter font-medium text-sm transition-all duration-300",
                    selectedMode === mode.id
                      ? "bg-[#2F6B4F] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Card */}
          <Card className="max-w-4xl mx-auto p-4 sm:p-6 bg-white/98 backdrop-blur-md border-0 shadow-2xl rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination */}
              <div className="md:col-span-1">
                <label className="block text-xs font-inter font-medium text-muted-foreground mb-1.5 text-left">
                  {t('destination')}
                </label>
                <div className="relative">
                  <LocationAutocomplete
                    value={formData.location}
                    onChange={(value) => updateFormField('location', value)}
                    placeholder={t('whereTo')}
                    className="w-full h-12 font-inter text-sm pl-10 rounded-xl border-input"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Check-in */}
              <div className="md:col-span-1">
                <label className="block text-xs font-inter font-medium text-muted-foreground mb-1.5 text-left">
                  {t('checkInLabel')}
                </label>
                <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-inter h-12 rounded-xl border-input bg-background",
                        !formData.dateRange?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span className="text-sm">
                        {formData.dateRange?.from ? format(formData.dateRange.from, "MMM dd") : t('selectDate')}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 z-[100] w-auto" align="start">
                    <DateRangePicker
                      value={formData.dateRange}
                      onChange={(range) => updateFormField('dateRange', range)}
                      allowPast={false}
                      onApply={() => setIsCheckInOpen(false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out */}
              <div className="md:col-span-1">
                <label className="block text-xs font-inter font-medium text-muted-foreground mb-1.5 text-left">
                  {t('checkOutLabel')}
                </label>
                <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-inter h-12 rounded-xl border-input bg-background",
                        !formData.dateRange?.to && "text-muted-foreground"
                      )}
                      disabled={!formData.dateRange?.from}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span className="text-sm">
                        {formData.dateRange?.to ? format(formData.dateRange.to, "MMM dd") : t('selectDate')}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 z-[100] w-auto" align="start">
                    <DateRangePicker
                      value={formData.dateRange}
                      onChange={(range) => updateFormField('dateRange', range)}
                      allowPast={false}
                      onApply={() => setIsCheckOutOpen(false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div className="md:col-span-1">
                <label className="block text-xs font-inter font-medium text-muted-foreground mb-1.5 text-left">
                  {t('guestsLabel')}
                </label>
                <GuestsSelector
                  value={formData.travelers}
                  onChange={(value) => updateFormField('travelers', value)}
                  keepOpen={true}
                />
              </div>
            </div>

            {/* Search Button */}
            <Button 
              onClick={handleSearch}
              disabled={!isFormValid()}
              size="lg"
              className={cn(
                "w-full h-12 mt-4 font-inter font-semibold text-base rounded-xl transition-all duration-300",
                isFormValid() 
                  ? "bg-[hsl(160,50%,30%)] hover:bg-[hsl(160,50%,25%)] text-white shadow-lg hover:shadow-xl" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Search className="mr-2 h-5 w-5" />
              <span>{t('search')}</span>
            </Button>
          </Card>

          {/* Bottom Tagline */}
          <div className="mt-8 text-center">
            <p className="text-sm md:text-base text-white/90 font-inter font-light">
              {t('noBookingFees')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
