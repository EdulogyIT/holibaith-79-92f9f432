import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronRight } from "lucide-react";

interface MobileRateCardProps {
  price: string | number;
  priceType?: "daily" | "weekly" | "monthly";
  priceCurrency?: string;
  onViewProperty: () => void;
}

export const MobileRateCard = ({ 
  price, 
  priceType = "daily", 
  priceCurrency,
  onViewProperty 
}: MobileRateCardProps) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const getPriceLabel = () => {
    switch (priceType) {
      case "weekly": return t("perWeek") || "/week";
      case "monthly": return t("perMonth") || "/month";
      default: return t("perNight") || "/night";
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-t border-border" />
      
      {/* Content */}
      <div className="relative px-4 py-3 flex items-center justify-between gap-3">
        {/* Price section */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-semibold text-foreground">
              {formatPrice(Number(price), priceCurrency || "DZD")}
            </span>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {getPriceLabel()}
            </span>
          </div>
        </div>

        {/* CTA Button - WCAG compliant 48x48 touch target */}
        <Button
          onClick={onViewProperty}
          size="lg"
          className="min-h-[48px] min-w-[120px] shrink-0 gap-2"
        >
          {t("viewProperty") || "View"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
