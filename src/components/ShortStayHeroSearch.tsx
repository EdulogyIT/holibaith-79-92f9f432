// src/components/ShortStayHeroSearch.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Search, Calendar, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DateRangePicker } from "@/components/DateRangePicker";
import { GuestsSelector } from "@/components/GuestsSelector";
import LocationAutocomplete from "@/components/LocationAutocomplete";

type DateRange = { from?: Date; to?: Date };
type SearchVals = {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  travelers?: string | number;
  adults?: number;
  children?: number;
  infants?: number;
  pets?: number;
};

type ShortStayHeroSearchProps = {
  onSearch?: (vals: SearchVals) => void;
  onFilterClick?: () => void;
};

const parseISODate = (s?: string | null) => {
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

const ShortStayHeroSearch: React.FC<ShortStayHeroSearchProps> = ({ onSearch, onFilterClick }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const [formData, setFormData] = useState<{
    location: string;
    propertyType: string;
    dateRange: DateRange | undefined;
    guests: { adults: number; children: number; infants: number; pets: number };
  }>({
    location: "",
    propertyType: "",
    dateRange: undefined,
    guests: { adults: 1, children: 0, infants: 0, pets: 0 },
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(routerLocation.search);
    const location = urlParams.get("location") || "";
    const checkIn = parseISODate(urlParams.get("checkIn"));
    const checkOut = parseISODate(urlParams.get("checkOut"));
    const adults = parseInt(urlParams.get("adults") || "1", 10);
    const children = parseInt(urlParams.get("children") || "0", 10);
    const infants = parseInt(urlParams.get("infants") || "0", 10);
    const pets = parseInt(urlParams.get("pets") || "0", 10);

    setFormData({
      location,
      propertyType: urlParams.get("type") || "",
      dateRange: checkIn || checkOut ? { from: checkIn, to: checkOut } : undefined,
      guests: { adults, children, infants, pets },
    });
  }, [routerLocation.search]);

  const updateFormField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const performSearch = (vals: SearchVals) => {
    if (onSearch) {
      onSearch(vals);
      return;
    }
    const qs = new URLSearchParams();
    if (vals.location) qs.set("location", String(vals.location));
    if (formData.propertyType) qs.set("type", formData.propertyType);
    if (vals.checkIn) qs.set("checkIn", String(vals.checkIn));
    if (vals.checkOut) qs.set("checkOut", String(vals.checkOut));
    if (vals.adults) qs.set("adults", String(vals.adults));
    if (vals.children) qs.set("children", String(vals.children));
    if (vals.infants) qs.set("infants", String(vals.infants));
    if (vals.pets) qs.set("pets", String(vals.pets));
    navigate(`/short-stay?${qs.toString()}`);
  };

  const handleSearch = () => {
    performSearch({
      location: formData.location,
      checkIn: formData.dateRange?.from ? formData.dateRange.from.toISOString() : undefined,
      checkOut: formData.dateRange?.to ? formData.dateRange.to.toISOString() : undefined,
      adults: formData.guests.adults,
      children: formData.guests.children,
      infants: formData.guests.infants,
      pets: formData.guests.pets,
    });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const totalGuests = formData.guests.adults + formData.guests.children;

  return (
    <>
      {/* Sticky Search Bar */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 z-40 transition-all duration-300 bg-card/95 backdrop-blur-md shadow-lg border-b border-border/50",
          isScrolled ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <form onSubmit={onSubmit} className="flex items-center gap-2 justify-center">
            <div className="flex items-center bg-card border border-border rounded-full shadow-sm overflow-hidden">
              <div className="px-4 py-2 border-r border-border">
                <LocationAutocomplete
                  value={formData.location}
                  onChange={(value) => updateFormField("location", value)}
                  placeholder={t("searchDestinations")}
                  className="border-0 shadow-none h-10 text-sm min-w-[150px] bg-transparent focus:ring-0"
                />
              </div>
              <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="px-4 py-3 text-sm text-left hover:bg-muted/50 border-r border-border min-w-[100px]"
                  >
                    <div className="text-xs text-muted-foreground">{t("checkIn")}</div>
                    <div className={cn("font-medium", !formData.dateRange?.from && "text-muted-foreground")}>
                      {formData.dateRange?.from ? format(formData.dateRange.from, "MMM dd") : t("addDates")}
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]" align="center">
                  <DateRangePicker
                    value={formData.dateRange}
                    onChange={(range) => updateFormField("dateRange", range)}
                    allowPast={false}
                    onApply={() => setIsCheckInOpen(false)}
                  />
                </PopoverContent>
              </Popover>
              <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="px-4 py-3 text-sm text-left hover:bg-muted/50 border-r border-border min-w-[100px]"
                  >
                    <div className="text-xs text-muted-foreground">{t("checkOut")}</div>
                    <div className={cn("font-medium", !formData.dateRange?.to && "text-muted-foreground")}>
                      {formData.dateRange?.to ? format(formData.dateRange.to, "MMM dd") : t("addDates")}
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]" align="center">
                  <DateRangePicker
                    value={formData.dateRange}
                    onChange={(range) => updateFormField("dateRange", range)}
                    allowPast={false}
                    onApply={() => setIsCheckOutOpen(false)}
                  />
                </PopoverContent>
              </Popover>
              <div className="px-3">
                <GuestsSelector
                  value={formData.guests}
                  onChange={(guests) => updateFormField("guests", guests)}
                  keepOpen
                />
              </div>
              <Button
                type="submit"
                className="bg-[#2F6B4F] hover:bg-[#265a42] text-white rounded-full h-10 w-10 p-0 m-1"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {onFilterClick && (
              <Button
                type="button"
                variant="outline"
                onClick={onFilterClick}
                className="rounded-full px-4 h-10 border-border"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {t("filters")}
              </Button>
            )}
          </form>
        </div>
      </div>

      {/* Hero Section - Light Background */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
              {t("findYourPerfectStay")}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              {t("verifiedHomesLocalHosts")}
            </p>
          </div>

          {/* Search Form - Pill Style */}
          <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="flex-1 flex flex-col md:flex-row items-stretch bg-card border border-border rounded-2xl md:rounded-full shadow-sm overflow-hidden">
                {/* Where */}
                <div className="flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-border">
                  <label className="text-xs font-medium text-foreground block mb-1">{t("where")}</label>
                  <LocationAutocomplete
                    value={formData.location}
                    onChange={(value) => updateFormField("location", value)}
                    placeholder={t("searchDestinations")}
                    className="border-0 shadow-none h-8 text-sm bg-transparent focus:ring-0 p-0"
                  />
                </div>

                {/* Check-in */}
                <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex-1 px-5 py-4 text-left hover:bg-muted/30 border-b md:border-b-0 md:border-r border-border"
                    >
                      <div className="text-xs font-medium text-foreground mb-1">{t("checkIn")}</div>
                      <div className={cn("text-sm", !formData.dateRange?.from && "text-muted-foreground")}>
                        {formData.dateRange?.from ? format(formData.dateRange.from, "dd MMM yyyy") : t("addDates")}
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[100]" align="center">
                    <DateRangePicker
                      value={formData.dateRange}
                      onChange={(range) => updateFormField("dateRange", range)}
                      allowPast={false}
                      onApply={() => setIsCheckInOpen(false)}
                    />
                  </PopoverContent>
                </Popover>

                {/* Check-out */}
                <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex-1 px-5 py-4 text-left hover:bg-muted/30 border-b md:border-b-0 md:border-r border-border"
                    >
                      <div className="text-xs font-medium text-foreground mb-1">{t("checkOut")}</div>
                      <div className={cn("text-sm", !formData.dateRange?.to && "text-muted-foreground")}>
                        {formData.dateRange?.to ? format(formData.dateRange.to, "dd MMM yyyy") : t("addDates")}
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[100]" align="center">
                    <DateRangePicker
                      value={formData.dateRange}
                      onChange={(range) => updateFormField("dateRange", range)}
                      allowPast={false}
                      onApply={() => setIsCheckOutOpen(false)}
                    />
                  </PopoverContent>
                </Popover>

                {/* Who */}
                <div className="flex-1 px-5 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-foreground mb-1">{t("who")}</div>
                    <GuestsSelector
                      value={formData.guests}
                      onChange={(guests) => updateFormField("guests", guests)}
                      keepOpen
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-[#2F6B4F] hover:bg-[#265a42] text-white rounded-full h-12 w-12 p-0 ml-3 flex-shrink-0"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Filters Button */}
              {onFilterClick && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onFilterClick}
                  className="rounded-full px-5 h-14 md:h-auto border-border flex items-center gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>{t("filters")}</span>
                </Button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default ShortStayHeroSearch;
