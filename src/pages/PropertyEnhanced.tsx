import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Shield, AlertTriangle, MessageCircle, Calendar, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentButton } from "@/components/PaymentButton";
import { PropertyAvailabilityCalendar } from "@/components/PropertyAvailabilityCalendar";
import { GuestsSelector } from "@/components/GuestsSelector";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import ScheduleVisitModal from "@/components/ScheduleVisitModal";
import MessageOwnerModal from "@/components/MessageOwnerModal";
import { PropertyReviews } from "@/components/PropertyReviews";
import { usePropertyTranslation } from "@/hooks/usePropertyTranslation";
import { GuestFavouriteBadge } from "@/components/GuestFavouriteBadge";
import { PropertyShareButton } from "@/components/PropertyShareButton";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyImageGallery } from "@/components/PropertyImageGallery";
import { PropertyHighlights } from "@/components/PropertyHighlights";
import { KeyDetailsTable } from "@/components/KeyDetailsTable";
import { VerifiedOwnerSection } from "@/components/VerifiedOwnerSection";
import { HostDetailsSection } from "@/components/HostDetailsSection";
import { HolibaytPayExplainer } from "@/components/HolibaytPayExplainer";
import { SimilarProperties } from "@/components/SimilarProperties";
import { RecentlySoldRented } from "@/components/RecentlySoldRented";
import { NeighborhoodInsights } from "@/components/NeighborhoodInsights";
import CurrencySelector from "@/components/CurrencySelector";
import { WishlistButton } from "@/components/WishlistButton";
import { buyRentTranslations } from "@/contexts/LanguageTranslations";
import { PropertyTrustBadge } from "@/components/PropertyTrustBadge";
import { useWishlist } from "@/hooks/useWishlist";
import { PropertyAmenities } from "@/components/PropertyAmenities";
import { PropertyThingsToKnow } from "@/components/PropertyThingsToKnow";
import { PropertyTrustInfoBlocks } from "@/components/PropertyTrustInfoBlocks";
import { RentPaymentSafetyBadge } from "@/components/RentPaymentSafetyBadge";
import { RentVerificationStatus } from "@/components/RentVerificationStatus";
import { DigitalLeaseOption } from "@/components/DigitalLeaseOption";
import { LegalSupportButton } from "@/components/LegalSupportButton";
import GooglePropertyMap from "@/components/GooglePropertyMap";

interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  district?: string;
  full_address?: string;
  price: string;
  price_type: string;
  price_currency?: string;
  category: string;
  bedrooms?: string;
  bathrooms?: string;
  area: string;
  images: string[];
  property_type: string;
  features?: any;
  description?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  created_at: string;
  user_id?: string;
  commission_rate?: number;
  check_in_time?: string;
  check_out_time?: string;
  fees?: any;
  verified?: boolean;
  financing_available?: boolean;
  holibayt_pay_eligible?: boolean;
  new_build?: boolean;
  contract_digitally_available?: boolean;
  condition?: string;
  availability_status?: string;
  minimum_rental_term?: string;
  furnished?: boolean;
  cancellation_policy?: string;
  house_rules?: any;
  safety_features?: any;
  latitude?: number | null;
  longitude?: number | null;
}

interface Profile {
  name?: string;
  avatar_url?: string;
  kyc_approved_at?: string;
  languages_spoken?: string[];
  response_rate?: number;
  transaction_count?: number;
  average_rating?: number;
  id_verified?: boolean;
  ownership_verified?: boolean;
}

const PropertyEnhanced = () => {
  const { id } = useParams();
  const { t, currentLang } = useLanguage();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { wishlistIds, toggleWishlist } = useWishlist(user?.id);
  
  // New booking UI state
  const [selectedDates, setSelectedDates] = useState<{ checkIn: Date | undefined; checkOut: Date | undefined }>({
    checkIn: undefined,
    checkOut: undefined
  });
  const [guestCounts, setGuestCounts] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [pricingBreakdown, setPricingBreakdown] = useState<any>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [checkInPopoverOpen, setCheckInPopoverOpen] = useState(false);
  const [checkOutPopoverOpen, setCheckOutPopoverOpen] = useState(false);
  const navigate = useNavigate();
  
  useScrollToTop();

  // i18n helper
  const tKey = (key: string) => {
    const translations = buyRentTranslations[currentLang] || buyRentTranslations.EN;
    return translations[key] || key;
  };

  // Property category checks (needed for useEffect hooks)
  const isBuy = property?.category === "buy" || property?.category === "sale";
  const isRent = property?.category === "rent";
  const isShortStay = property?.category === "short-stay";

  useEffect(() => {
    if (id) void fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Debugging logs
  useEffect(() => {
    console.log('🏠 PropertyEnhanced mounted/updated', {
      propertyId: property?.id,
      category: property?.category,
      isShortStay: property?.category === 'short-stay'
    });
  }, [property]);

  useEffect(() => {
    console.log('📅 Selected dates changed:', selectedDates);
  }, [selectedDates]);

  useEffect(() => {
    console.log('👥 Guest counts changed:', guestCounts);
  }, [guestCounts]);

  useEffect(() => {
    console.log('🚪 Popover states:', { checkInPopoverOpen, checkOutPopoverOpen });
  }, [checkInPopoverOpen, checkOutPopoverOpen]);

  // Calculate pricing when dates or guests change (for short-stay)
  useEffect(() => {
    if (isShortStay && selectedDates.checkIn && selectedDates.checkOut) {
      const fetchPricing = async () => {
        setPricingLoading(true);
        try {
          const totalGuests = guestCounts.adults + guestCounts.children;
          const { calculateBookingPrice } = await import("@/utils/pricingCalculator");
          const breakdown = await calculateBookingPrice(
            property!.id,
            selectedDates.checkIn!,
            selectedDates.checkOut!,
            totalGuests,
            guestCounts.pets
          );
          setPricingBreakdown(breakdown);
          console.log('💰 Pricing calculated:', breakdown);
        } catch (error) {
          console.error("Error calculating pricing:", error);
        } finally {
          setPricingLoading(false);
        }
      };
      void fetchPricing();
    }
  }, [selectedDates, guestCounts, isShortStay, property]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching property:', error);
        setError('Property not found');
        return;
      }
      if (!data) {
        setError('Property not found');
        return;
      }

      setProperty(data);

      if (data.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user_id)
          .maybeSingle();
        if (profileData) setProfile(profileData);
      }
    } catch (e) {
      console.error('Error fetching property:', e);
      setError('Failed to load property');
    } finally {
      setIsLoading(false);
    }
  };

  const { translatedText: translatedTitle } = usePropertyTranslation(
    property?.title,
    currentLang,
    'property_title'
  );
  const { translatedText: translatedDescription } = usePropertyTranslation(
    property?.description,
    currentLang,
    'property_description'
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">{error || "Property not found"}</h1>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const verificationYear = profile?.kyc_approved_at
    ? new Date(profile.kyc_approved_at).getFullYear()
    : new Date().getFullYear();
  const isInWishlist = wishlistIds.has(property.id);

  return (
    // HARD STOP any sideways scroll
    <div className="min-h-screen bg-cream overflow-x-hidden">
      <Navigation />
      
      {/* Safe paddings; never exceed viewport width */}
      <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-8 pt-18 sm:pt-20 pb-8">
        {/* Grid stacks on mobile; only splits on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          {/* MAIN */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
            {/* Gallery wrapped to avoid bleed */}
            <div className="rounded-xl overflow-hidden w-full max-w-full">
              <PropertyImageGallery 
                images={property.images} 
                title={translatedTitle}
                isInWishlist={isInWishlist}
                onWishlistToggle={() => toggleWishlist(property.id)}
              />
            </div>

            {/* Title + location + actions */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between min-w-0">
                {/* LEFT */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight break-words">
                    {translatedTitle}
                  </h1>
                  <div className="mt-2 flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span className="text-sm sm:text-base break-words">
                      {property.location}, {property.city}
                    </span>
                  </div>

                  {/* Badges wrap on small screens */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {property.verified && (
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="w-3 h-3" />
                        {t("verified")}
                      </Badge>
                    )}
                    {property.holibayt_pay_eligible && (
                      <Badge variant="default">Holibayt Pay™</Badge>
                    )}
                    {property.new_build && (
                      <Badge variant="outline">{t("newBuild")}</Badge>
                    )}
                    {isRent && property.furnished && (
                      <Badge variant="outline">{tKey("furnished")}</Badge>
                    )}
                  </div>
                </div>

                {/* RIGHT actions */}
                <div className="flex flex-wrap gap-2 md:ml-4 min-w-0">
                  <PropertyShareButton propertyId={property.id} propertyTitle={translatedTitle} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Compact owner - ALWAYS SHOW */}
            <>
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow w-full max-w-full">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  {isBuy ? "Meet the seller" : isRent ? "Meet your landlord" : "Meet your host"}
                </h3>
                <VerifiedOwnerSection
                  name={profile?.name || "Property Owner"}
                  avatarUrl={profile?.avatar_url}
                  verifiedSince={verificationYear.toString()}
                  city={property.city}
                  languages={profile?.languages_spoken || ["Arabic", "French"]}
                  transactionCount={profile?.transaction_count || 0}
                  responseRate={profile?.response_rate || 100}
                  averageRating={profile?.average_rating}
                  isVerified={profile?.id_verified || profile?.ownership_verified || false}
                  category={isBuy ? "buy" : (isRent ? "rent" : "short-stay")}
                />
              </div>
              <Separator />
            </>

            {/* About */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {isBuy || isRent ? tKey(isBuy ? "aboutThisProperty" : "aboutThisRental") : t("propertyDetails")}
              </h2>
              <p className={`text-muted-foreground leading-relaxed text-sm sm:text-base break-words ${!showFullDescription ? "line-clamp-6 sm:line-clamp-none" : ""}`}>
                {translatedDescription || "No description available"}
                {property.verified && (
                  <span className="block mt-3 text-xs sm:text-sm text-primary flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {tKey("verifiedByTeam")}
                  </span>
                )}
              </p>
              {translatedDescription && translatedDescription.length > 300 && (
                <Button
                  variant="link"
                  className="p-0 font-semibold"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Show less" : tKey("readMore") + " ›"}
                </Button>
              )}
            </div>

            <Separator />

            {/* Highlights */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{tKey("propertyHighlights")}</h3>
              <PropertyHighlights
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                features={property.features}
                category={property.category}
              />
            </div>

            <Separator />

            {/* Amenities */}
            <PropertyAmenities features={property.features} />

            <Separator />

            {/* Key details */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Key Details</h3>
              <KeyDetailsTable
                propertyType={property.property_type}
                condition={property.condition}
                ownership={property.verified ? "Verified by Holibayt" : "Pending verification"}
                availability={property.availability_status}
                minimumTerm={property.minimum_rental_term}
                furnished={property.furnished}
                category={property.category}
              />
            </div>

            <Separator />

            {/* Reviews */}
            <PropertyReviews propertyId={property.id} hostUserId={property.user_id || ""} />

            <Separator />

            {/* Availability Calendar for Short-Stay */}
            {isShortStay && (
              <>
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Availability</h2>
                  <PropertyAvailabilityCalendar
                    propertyId={property.id}
                    basePrice={property.price}
                    priceType={property.price_type}
                    minNights={1}
                    maxNights={365}
                    onDateSelect={(dates) => setSelectedDates(dates)}
                    onApply={() => {}}
                  />
                </div>
                <Separator />
              </>
            )}

            {/* Where you'll be */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Where you'll be</h2>
              <div className="w-full max-w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden">
                <GooglePropertyMap
                  location={`${property.location}, ${property.city}, Algeria`}
                  address={property.full_address}
                  latitude={property.latitude}
                  longitude={property.longitude}
                />
              </div>
              <NeighborhoodInsights
                city={property.city}
                location={property.location}
                district={property.district}
              />
            </div>

            <Separator />

            {/* Things to know */}
            <PropertyThingsToKnow 
              category={property.category as "buy" | "rent" | "short-stay"}
              checkInTime={property.check_in_time}
              checkOutTime={property.check_out_time}
              cancellationPolicy={property.cancellation_policy || "flexible"}
              houseRules={property.house_rules}
              safetyFeatures={property.safety_features}
            />

            <Separator />

            {/* Host details - ALWAYS SHOW */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {isBuy ? "About the seller" : isRent ? "About your landlord" : "Meet your host"}
              </h2>
              <HostDetailsSection 
                userId={property.user_id || ""} 
                onContactHost={() => setIsMessageModalOpen(true)}
              />
            </div>
            <Separator />

            {/* Holibayt Pay */}
            {property.holibayt_pay_eligible && (
              <>
                <HolibaytPayExplainer category={isBuy ? "buy" : "rent"} />
                <Separator />
              </>
            )}

            {/* Similar / recent */}
            <SimilarProperties
              currentPropertyId={property.id}
              city={property.city}
              category={property.category}
            />
            {(isBuy || isRent) && (
              <RecentlySoldRented
                city={property.city}
                category={isBuy ? "buy" : "rent"}
              />
            )}
          </div>

          {/* SIDEBAR (sticky only on lg+) */}
          <div className="lg:col-span-1 min-w-0">
            <Card
              className="max-w-full p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-shadow space-y-4 sm:space-y-6
                         lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
            >
              {/* Price */}
              <div>
                  <div className="flex items-start sm:items-baseline justify-between gap-3 mb-2">
                    <div className="text-2xl sm:text-3xl font-bold text-primary break-words">
                      {formatPrice(parseFloat(property.price), isShortStay ? "daily" : property.price_type, property.price_currency || "DZD")}
                    </div>
                  <div className="shrink-0">
                    <CurrencySelector />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {property.price_type === "per_month" && t("perMonth")}
                  {property.price_type === "per_night" && t("perNight")}
                </p>
                {property.fees?.security_deposit?.enabled && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {tKey("deposit")}: {formatPrice(property.fees.security_deposit.amount, property.price_type, property.price_currency || "DZD")} {tKey("depositHeldVia")}
                  </p>
                )}
              </div>

              {/* CTAs */}
              <div className="space-y-2.5 sm:space-y-3">
                {isShortStay ? (
                  <>
                    {/* Airbnb-style date and guest pickers */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Check-in */}
                        <Popover open={checkInPopoverOpen} onOpenChange={setCheckInPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal h-auto py-2"
                            >
                              <div className="flex flex-col w-full">
                                <span className="text-xs text-muted-foreground">Check-in</span>
                                <span className="text-sm font-semibold">
                                  {selectedDates.checkIn ? format(selectedDates.checkIn, "MMM dd") : "Add date"}
                                </span>
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <PropertyAvailabilityCalendar
                              propertyId={property.id}
                              basePrice={property.price}
                              priceType={property.price_type}
                              minNights={1}
                              maxNights={365}
                              onDateSelect={(dates) => {
                                console.log('📅 Check-in onDateSelect called', dates);
                                setSelectedDates(dates);
                              }}
                              onApply={() => {
                                console.log('📅 Check-in onApply called - closing popover');
                                setCheckInPopoverOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        {/* Check-out */}
                        <Popover open={checkOutPopoverOpen} onOpenChange={setCheckOutPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal h-auto py-2"
                            >
                              <div className="flex flex-col w-full">
                                <span className="text-xs text-muted-foreground">Checkout</span>
                                <span className="text-sm font-semibold">
                                  {selectedDates.checkOut ? format(selectedDates.checkOut, "MMM dd") : "Add date"}
                                </span>
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <PropertyAvailabilityCalendar
                              propertyId={property.id}
                              basePrice={property.price}
                              priceType={property.price_type}
                              minNights={1}
                              maxNights={365}
                              onDateSelect={(dates) => {
                                console.log('📅 Checkout onDateSelect called', dates);
                                setSelectedDates(dates);
                              }}
                              onApply={() => {
                                console.log('📅 Checkout onApply called - closing popover');
                                setCheckOutPopoverOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Guests selector */}
                      <GuestsSelector
                        value={guestCounts}
                        onChange={(newCounts) => {
                          console.log('👥 Guest counts updated', newCounts);
                          setGuestCounts(newCounts);
                        }}
                        keepOpen={true}
                      />

                      {/* Pricing breakdown */}
                      {pricingBreakdown && (
                          <div className="p-3 rounded-lg bg-muted/50 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{pricingBreakdown.nights} nights</span>
                            <span>{formatPrice(pricingBreakdown.subtotal, undefined, property.price_currency || "DZD")}</span>
                          </div>
                          {pricingBreakdown.cleaningFee > 0 && (
                            <div className="flex justify-between">
                              <span>Cleaning fee</span>
                              <span>{formatPrice(pricingBreakdown.cleaningFee, undefined, property.price_currency || "DZD")}</span>
                            </div>
                          )}
                          {pricingBreakdown.serviceFee > 0 && (
                            <div className="flex justify-between">
                              <span>Service fee</span>
                              <span>{formatPrice(pricingBreakdown.serviceFee, undefined, property.price_currency || "DZD")}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>{formatPrice(pricingBreakdown.total, undefined, property.price_currency || "DZD")}</span>
                          </div>
                        </div>
                      )}

                      {/* Reserve button */}
                      <Button
                        className="w-full bg-gradient-to-r from-magenta-500 to-magenta-600 hover:from-magenta-600 hover:to-magenta-700 text-white font-semibold shadow-lg hover:-translate-y-0.5 transition-transform"
                        size="lg"
                        disabled={!selectedDates.checkIn || !selectedDates.checkOut || pricingLoading}
                        onClick={() => {
                          console.log('🎯 Reserve button clicked', {
                            dates: selectedDates,
                            guests: guestCounts,
                            pricing: pricingBreakdown
                          });
                          
                          // Build URL with query params for dates and guests
                          const checkInStr = selectedDates.checkIn ? format(selectedDates.checkIn, 'yyyy-MM-dd') : '';
                          const checkOutStr = selectedDates.checkOut ? format(selectedDates.checkOut, 'yyyy-MM-dd') : '';
                          const totalGuests = (guestCounts.adults || 1) + (guestCounts.children || 0) + (guestCounts.infants || 0);
                          
                          const params = new URLSearchParams({
                            checkIn: checkInStr,
                            checkOut: checkOutStr,
                            guests: totalGuests.toString(),
                            pets: (guestCounts.pets || 0).toString()
                          });
                          
                          navigate(`/booking/confirm/${property.id}?${params.toString()}`);
                        }}
                      >
                        {pricingLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Calculating...
                          </>
                        ) : (
                          "Reserve"
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="w-full hover:-translate-y-0.5 transition-transform shadow-md"
                    size="lg"
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-sm sm:text-base">{isBuy ? t("requestVisit") : t("scheduleVisit")}</span>
                  </Button>
                )}
                
                <Button
                  onClick={() => setIsMessageModalOpen(true)}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">{t("chatSecurely")}</span>
                </Button>

                {(isBuy || isRent) && (
                  <LegalSupportButton propertyId={property.id} />
                )}

                {property.financing_available && isBuy && (
                  <Button variant="outline" className="w-full" size="sm">
                    {tKey("getPreApproved")}
                  </Button>
                )}
              </div>

              {/* Trust blocks */}
              <div className="pt-5 sm:pt-6 border-t">
                <PropertyTrustInfoBlocks
                  isVerified={property.verified}
                  holibaytPayEligible={property.holibayt_pay_eligible}
                  category={property.category as "sale" | "rent" | "short-stay"}
                />
              </div>

              {/* Rent-specific */}
              {isRent && (
                <div className="space-y-4 pt-5 sm:pt-6 border-t">
                  <RentPaymentSafetyBadge 
                    monthlyRent={parseFloat(property.price)}
                    deposit={property.fees?.security_deposit?.amount || 0}
                    currency={property.price_currency || "DZD"}
                  />
                  
                  {(profile?.id_verified || profile?.ownership_verified) && (
                    <RentVerificationStatus
                      isIdVerified={profile.id_verified || false}
                      isOwnershipVerified={profile.ownership_verified || false}
                      verificationDate={profile.kyc_approved_at}
                    />
                  )}
                  
                  <DigitalLeaseOption propertyId={property.id} hasActiveAgreement={false} />
                  
                  {property.fees?.security_deposit?.enabled && (
                    <Card className="border-2 border-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <Shield className="w-5 h-5 text-primary" />
                          Security Deposit Required
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          A refundable security deposit of{" "}
                          <span className="font-bold text-foreground">
                            {formatPrice(
                              property.fees.security_deposit.amount,
                              property.price_type,
                              property.price_currency || "DZD"
                            )}
                          </span>{" "}
                          is required before moving in.
                        </p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">
                          This deposit will be held securely via Holibayt Pay™ escrow and refunded at the end of your tenancy.
                        </p>
                        <PaymentButton
                          propertyId={property.id}
                          paymentType="security_deposit"
                          amount={property.fees.security_deposit.amount}
                          currency={property.price_currency || "DZD"}
                          description={`Security deposit for ${property.title}`}
                          className="w-full"
                        >
                          Pay Security Deposit
                        </PaymentButton>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Short-stay warning */}
              {isShortStay && (
                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-yellow-800 whitespace-normal break-words leading-relaxed">
                    {tKey("communicationWarning")}
                  </p>
                </div>
              )}

              {/* Guest favourite */}
              {property.category === "short-stay" && property.features?.average_rating && (
                <GuestFavouriteBadge 
                  rating={property.features.average_rating} 
                  reviewCount={property.features.total_reviews || 0} 
                />
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {(isBuy || isRent) && (
        <ScheduleVisitModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          propertyTitle={translatedTitle}
        />
      )}
      
      <MessageOwnerModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        ownerName={profile?.name || "Property Owner"}
        ownerEmail={property.contact_email || ""}
        propertyTitle={translatedTitle}
        propertyId={property.id}
        isSecureMode={true}
      />
    </div>
  );
};

export default PropertyEnhanced;
