import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Search, MapPin, Home, Key, Bed, Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import algeriaHero from "@/assets/algeria-architecture-hero.jpg";
import { DateRangePicker } from "@/components/DateRangePicker";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { GuestsSelector } from "@/components/GuestsSelector";
import { TrustIndicators } from "@/components/TrustIndicators";
import { HolibaytPayBadge } from "@/components/HolibaytPayBadge";

const HeroSection = () => {
  const { t } = useLanguage();
  const { getCurrencySymbol, formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'hotels' | 'stay'>('stay');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  
  // Form states for validation
  const [formData, setFormData] = useState({
    location: '',
    propertyType: '',
    budget: '',
    housingType: '',
    maxRent: '',
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

  // Validation logic - only location is required
  const isFormValid = () => {
    return formData.location.trim() !== '';
  };

  // Stay Date Picker Component using unified DateRangePicker
  const StayDatePicker = () => {
    return (
      <div className="flex flex-1 gap-2">
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-inter text-sm h-12",
                  !formData.dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateRange?.from ? format(formData.dateRange.from, "dd/MM/yy") : t('checkIn')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DateRangePicker
                value={formData.dateRange}
                onChange={(range) => updateFormField('dateRange', range)}
                allowPast={false}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-inter text-sm h-12",
                  !formData.dateRange?.to && "text-muted-foreground"
                )}
                disabled={!formData.dateRange?.from}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateRange?.to ? format(formData.dateRange.to, "dd/MM/yy") : t('checkOut')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DateRangePicker
                value={formData.dateRange}
                onChange={(range) => updateFormField('dateRange', range)}
                allowPast={false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  };

  const modes = [
    {
      id: 'hotels' as const,
      icon: Home,
      label: t('hotels')
    },
    {
      id: 'stay' as const,
      icon: Bed,
      label: t('shortStay')
    }
  ];

  const getSearchPlaceholder = () => {
    switch (selectedMode) {
      case 'hotels':
        return t('cityNeighborhood');
      case 'stay':
        return t('stayDestination');
      default:
        return t('cityNeighborhood');
    }
  };

  // Removed renderSearchFields - fields are now directly in JSX

  const handleSearch = () => {
    if (!isFormValid()) {
      return; // Don't proceed if form is invalid
    }

    // Build search parameters from form data
    const searchParams = new URLSearchParams();
    
    if (formData.location) searchParams.append('location', formData.location);
    
    switch (selectedMode) {
      case 'hotels':
        if (formData.propertyType) searchParams.append('type', formData.propertyType);
        if (formData.budget) searchParams.append('budget', formData.budget);
        navigate(`/hotels?${searchParams.toString()}`);
        break;
      case 'stay':
        if (formData.dateRange?.from) searchParams.append('checkIn', formData.dateRange.from.toISOString());
        if (formData.dateRange?.to) searchParams.append('checkOut', formData.dateRange.to.toISOString());
        searchParams.append('adults', formData.travelers.adults.toString());
        searchParams.append('children', formData.travelers.children.toString());
        searchParams.append('infants', formData.travelers.infants.toString());
        searchParams.append('pets', formData.travelers.pets.toString());
        navigate(`/short-stay?${searchParams.toString()}`);
        break;
      default:
        navigate('/hotels');
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
        <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/30 to-background/35"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 sm:pt-20 md:pt-16">
        {/* Hero Content */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12 px-4">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-medium text-foreground mb-3 sm:mb-4 leading-tight px-2">
              {t('discoverAlgeriaDifferently')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-inter font-light max-w-2xl mx-auto leading-relaxed px-4 mb-6">
              {t('hotelsAndVerifiedHomes')}
            </p>
          </div>
          
          {/* Mode Selector */}
          <div className="mb-6 sm:mb-8 px-2 flex justify-center">
            <div className="inline-flex flex-wrap sm:flex-nowrap bg-card/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-1 sm:p-1.5 border border-border/30 shadow-elegant justify-center gap-1 max-w-full w-full sm:w-auto">
              {modes.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-4 rounded-lg sm:rounded-xl font-inter font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 min-h-[44px] sm:min-h-[48px] flex-1 sm:flex-initial sm:min-w-[100px] ${
                      selectedMode === mode.id
                        ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="whitespace-nowrap text-xs sm:text-sm md:text-base">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Search Card */}
<Card className="search-card max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-card/95 backdrop-blur-md border-border/30 shadow-2xl rounded-2xl sm:rounded-3xl overflow-x-hidden mx-4">
  <div className="flex flex-col gap-4">
    {/* Location Input - Full Width Row */}
    <div className="relative w-full">
      <LocationAutocomplete
        value={formData.location}
        onChange={(value) => updateFormField('location', value)}
        placeholder={t('whereTo')}
        className="w-full h-14 sm:h-16 font-inter text-base pl-12"
      />
      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    </div>

    {/* Date and Guests Row */}
    {selectedMode === 'stay' && (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-inter h-14 sm:h-16 bg-background border-input",
                  !formData.dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5" />
                <span>{formData.dateRange?.from ? format(formData.dateRange.from, "MMM dd, yyyy") : t('checkIn')}</span>
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
        
        <div className="flex-1">
          <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-inter h-14 sm:h-16 bg-background border-input",
                  !formData.dateRange?.to && "text-muted-foreground"
                )}
                disabled={!formData.dateRange?.from}
              >
                <CalendarIcon className="mr-3 h-5 w-5" />
                <span>{formData.dateRange?.to ? format(formData.dateRange.to, "MMM dd, yyyy") : t('selectDate')}</span>
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
        
        <div className="flex-1">
          <GuestsSelector
            value={formData.travelers}
            onChange={(value) => updateFormField('travelers', value)}
            keepOpen={true}
          />
        </div>
      </div>
    )}

    {/* Search Button - Full Width */}
    <Button 
      onClick={handleSearch}
      disabled={!isFormValid()}
      size="lg"
      className={cn(
        "w-full h-14 sm:h-16 font-inter font-semibold text-base transition-all duration-300",
        isFormValid() 
          ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl" 
          : "bg-muted text-muted-foreground cursor-not-allowed"
      )}
    >
      <Search className="mr-2 h-5 w-5" />
      <span>{t('search')}</span>
    </Button>
  </div>
</Card>

          {/* Bottom Tagline */}
          <div className="mt-8 text-center">
            <p className="text-sm md:text-base text-muted-foreground font-inter font-light">
              {t('noBookingFees')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
