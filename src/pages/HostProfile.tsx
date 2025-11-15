import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, MessageCircle, Shield, Languages, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import MessageOwnerModal from "@/components/MessageOwnerModal";
import { VerificationBadge } from "@/components/VerificationBadge";
import SEOHead from "@/components/SEOHead";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { format } from "date-fns";

interface HostData {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_superhost: boolean;
  id_verified: boolean;
  average_rating: number | null;
  total_reviews: number | null;
  languages_spoken: string[] | null;
  profession: string | null;
  response_rate: number | null;
  hosting_since: string | null;
}

interface Property {
  id: string;
  title: string;
  images: string[];
  price: string;
  price_type: string;
  city: string;
  category: string;
}

export default function HostProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [host, setHost] = useState<HostData | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchHostData();
    }
  }, [userId]);

  const fetchHostData = async () => {
    try {
      setIsLoading(true);

      // Fetch host profile
      const { data: hostData, error: hostError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (hostError) throw hostError;

      setHost(hostData);

      // Fetch host's properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select("id, title, images, price, price_type, city, category")
        .eq("user_id", userId)
        .eq("status", "approved")
        .limit(6);

      if (propertiesError) throw propertiesError;

      setProperties(propertiesData || []);
    } catch (error) {
      console.error("Error fetching host data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!host) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("hostNotFound") || "Host not found"}</h1>
          <Button onClick={() => navigate("/")}>{t("backToHome") || "Back to Home"}</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const hostingSince = host.hosting_since || host.created_at;
  const yearJoined = hostingSince ? new Date(hostingSince).getFullYear() : null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${host.name} - ${t("aboutHost") || "About the Host"}`}
        description={`View ${host.name}'s profile, verified properties, and reviews on Holibayt`}
      />
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Host Header */}
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-primary/20">
                <AvatarImage src={host.avatar_url || ""} alt={host.name || "Host"} />
                <AvatarFallback className="text-2xl font-bold">
                  {host.name?.charAt(0) || "H"}
                </AvatarFallback>
              </Avatar>

              {/* Host Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{host.name || t("anonymous")}</h1>
                    {host.is_superhost && (
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        ⭐ {t("superhost") || "Superhost"}
                      </Badge>
                    )}
                  </div>
                  {host.profession && (
                    <p className="text-muted-foreground">{host.profession}</p>
                  )}
                  {yearJoined && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("hostSince") || "Host since"} {yearJoined}
                    </p>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {host.total_reviews && host.total_reviews > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-xl font-bold">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        {host.average_rating?.toFixed(1) || "N/A"}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {host.total_reviews} {t("reviews")}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <div className="text-xl font-bold">{properties.length}</div>
                    <p className="text-sm text-muted-foreground">
                      {t("propertiesListed") || "Properties"}
                    </p>
                  </div>

                  {host.response_rate && (
                    <div>
                      <div className="text-xl font-bold">{host.response_rate}%</div>
                      <p className="text-sm text-muted-foreground">
                        {t("responseRate")}
                      </p>
                    </div>
                  )}

                  {host.id_verified && (
                    <div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-600">{t("verified")}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("identityVerified") || "ID Verified"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Languages */}
                {host.languages_spoken && host.languages_spoken.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Languages className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">{t("languagesSpoken") || "Languages"}</p>
                      <p className="text-sm text-muted-foreground">
                        {host.languages_spoken.join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contact Button */}
                <Button
                  size="lg"
                  onClick={() => setShowMessageModal(true)}
                  className="w-full md:w-auto"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {t("contactHost") || "Contact Host"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Section */}
        {properties.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {t("propertiesBy") || "Properties by"} {host.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card
                  key={property.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                      <img
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1">{property.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        {property.city}
                      </div>
                      <p className="text-lg font-bold">
                        {property.price}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          {property.price_type === "per_night" ? t("perNight") : t("perMonth")}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Message Modal */}
      {showMessageModal && (
        <MessageOwnerModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          ownerName={host.name || "Host"}
          ownerEmail=""
          propertyTitle={`${t("contactHost")} - ${host.name}`}
          propertyId=""
          isSecureMode={true}
        />
      )}
    </div>
  );
}
