import { supabase } from '@/integrations/supabase/client';
import { differenceInDays, isWeekend, parseISO } from 'date-fns';

interface PricingBreakdown {
  nights: number;
  basePrice: number;
  nightlyRates: { date: string; rate: number; isWeekend: boolean }[];
  subtotal: number;
  lengthOfStayDiscount: { amount: number; percent: number; type: string } | null;
  earlyBirdDiscount: { amount: number; percent: number } | null;
  lastMinuteDiscount: { amount: number; percent: number } | null;
  promotionalDiscount: { amount: number; percent: number } | null;
  cleaningFee: number;
  extraGuestFee: number;
  petFee: number;
  securityDeposit: number;
  serviceFee: number;
  serviceFeePercent: number;
  taxAmount: number;
  taxRate: number;
  totalBeforeTax: number;
  total: number;
  savings: number;
}

export const calculateBookingPrice = async (
  propertyId: string,
  checkInDate: Date,
  checkOutDate: Date,
  guestCount: number,
  petCount: number = 0
): Promise<PricingBreakdown> => {
  console.log('🔍 [PricingCalc] Starting calculation...', { propertyId, guestCount, petCount });
  
  try {
    // 1. Fetch property details
    console.log('📊 [PricingCalc] Step 1: Fetching property...');
    const propertyStart = Date.now();
    
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('price, category')
      .eq('id', propertyId)
      .maybeSingle();

    console.log(`✅ [PricingCalc] Property fetched in ${Date.now() - propertyStart}ms`);

    if (propertyError || !property) {
      console.error('❌ [PricingCalc] Property fetch error:', propertyError);
      throw new Error('Property not found');
    }

    const basePrice = parseFloat(property.price);
    
    // Fetch platform service fee based on property category
    const { data: serviceFeeSettings } = await supabase
      .from('platform_service_fees')
      .select('fee_percentage')
      .eq('category', property.category || 'short-stay')
      .eq('is_active', true)
      .maybeSingle();
    
    const serviceFeePercent = serviceFeeSettings?.fee_percentage || 15;
    console.log('💰 [PricingCalc] Base price:', basePrice, 'Service Fee:', serviceFeePercent + '%');

    // 2. Calculate nights
    const nights = differenceInDays(checkOutDate, checkInDate);
    if (nights < 1) throw new Error('Invalid date range');
    console.log('📅 [PricingCalc] Nights:', nights);

    // 3. Fetch pricing data with 5s timeout
    console.log('🔄 [PricingCalc] Step 2: Fetching pricing data...');
    const fetchStart = Date.now();
    
    const seasonalPromise = supabase
      .from('property_seasonal_pricing')
      .select('*')
      .eq('property_id', propertyId)
      .order('start_date')
      .then(result => result);

    const feesPromise = supabase
      .from('pricing_fees')
      .select('*')
      .eq('property_id', propertyId)
      .maybeSingle()
      .then(result => result);

    const rulesPromise = supabase
      .from('pricing_rules')
      .select('*')
      .eq('property_id', propertyId)
      .eq('is_active', true)
      .then(result => result);

    // 5-second timeout for database queries
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout (5s)')), 5000)
    );

    let seasonalPrices, fees, rules;
    
    try {
      const [seasonalResult, feesResult, rulesResult] = await Promise.race([
        Promise.all([seasonalPromise, feesPromise, rulesPromise]),
        timeout
      ]) as any;

      seasonalPrices = seasonalResult?.data || [];
      fees = feesResult?.data;
      rules = rulesResult?.data || [];
      
      console.log(`✅ [PricingCalc] Data fetched in ${Date.now() - fetchStart}ms`, {
        seasonalCount: seasonalPrices?.length || 0,
        hasFees: !!fees,
        rulesCount: rules?.length || 0
      });
    } catch (timeoutError) {
      console.error(`⚠️ [PricingCalc] Database timeout after ${Date.now() - fetchStart}ms:`, timeoutError);
      
      // IMMEDIATE FALLBACK - Return simple pricing
      const simpleSubtotal = basePrice * nights;
      const simpleServiceFee = simpleSubtotal * (serviceFeePercent / 100);
      const simpleTotal = simpleSubtotal + simpleServiceFee;
      
      console.log('🔄 [PricingCalc] Using simple fallback pricing:', { simpleTotal });
      
      return {
        nights,
        basePrice,
        nightlyRates: [],
        subtotal: simpleSubtotal,
        lengthOfStayDiscount: null,
        earlyBirdDiscount: null,
        lastMinuteDiscount: null,
        promotionalDiscount: null,
        cleaningFee: 0,
        extraGuestFee: 0,
        petFee: 0,
        securityDeposit: 0,
        serviceFee: simpleServiceFee,
        serviceFeePercent: serviceFeePercent,
        taxAmount: 0,
        taxRate: 0,
        totalBeforeTax: simpleTotal,
        total: simpleTotal,
        savings: 0,
      };
    }

    // 6. Calculate nightly rates
    console.log('🧮 [PricingCalc] Step 3: Calculating nightly rates...');
    const nightlyRates: { date: string; rate: number; isWeekend: boolean }[] = [];
    let subtotal = 0;

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(checkInDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      const isWeekendDay = isWeekend(currentDate);

      let nightRate = basePrice;
      const applicableSeason = seasonalPrices?.find(
        (season) => dateStr >= season.start_date && dateStr <= season.end_date
      );

      if (applicableSeason) {
        nightRate = parseFloat(applicableSeason.price_per_night.toString());
        if (isWeekendDay && applicableSeason.weekend_multiplier) {
          nightRate *= parseFloat(applicableSeason.weekend_multiplier.toString());
        }
      }

      nightlyRates.push({ date: dateStr, rate: nightRate, isWeekend: isWeekendDay });
      subtotal += nightRate;
    }
    
    console.log('✅ [PricingCalc] Subtotal before discounts:', subtotal);

    // 7. Apply length-of-stay discounts
    let lengthOfStayDiscount = null;
    const lengthRule = rules?.find(
      (r) => r.rule_type === 'length_discount' && nights >= (r.conditions as any)?.min_nights
    );
    if (lengthRule) {
      const discountAmount = (subtotal * lengthRule.discount_percent) / 100;
      lengthOfStayDiscount = {
        amount: discountAmount,
        percent: lengthRule.discount_percent,
        type: (lengthRule.conditions as any)?.type || 'length',
      };
      subtotal -= discountAmount;
    }

    // 8. Apply early bird discount
    let earlyBirdDiscount = null;
    const daysUntilCheckIn = differenceInDays(checkInDate, new Date());
    const earlyBirdRule = rules?.find(
      (r) =>
        r.rule_type === 'early_bird' &&
        daysUntilCheckIn >= (r.conditions as any)?.days_in_advance
    );
    if (earlyBirdRule) {
      const discountAmount = (subtotal * earlyBirdRule.discount_percent) / 100;
      earlyBirdDiscount = {
        amount: discountAmount,
        percent: earlyBirdRule.discount_percent,
      };
      subtotal -= discountAmount;
    }

    // 9. Apply last-minute discount
    let lastMinuteDiscount = null;
    const lastMinuteRule = rules?.find(
      (r) =>
        r.rule_type === 'last_minute' &&
        daysUntilCheckIn <= (r.conditions as any)?.days_before_checkin
    );
    if (lastMinuteRule) {
      const discountAmount = (subtotal * lastMinuteRule.discount_percent) / 100;
      lastMinuteDiscount = {
        amount: discountAmount,
        percent: lastMinuteRule.discount_percent,
      };
      subtotal -= discountAmount;
    }

    // 10. Apply promotional discount (date-specific)
    let promotionalDiscount = null;
    const promoRule = rules?.find((r) => {
      if (r.rule_type !== 'promotion') return false;
      if (!r.start_date || !r.end_date) return false;
      const today = new Date().toISOString().split('T')[0];
      return today >= r.start_date && today <= r.end_date;
    });
    if (promoRule) {
      const discountAmount = (subtotal * promoRule.discount_percent) / 100;
      promotionalDiscount = {
        amount: discountAmount,
        percent: promoRule.discount_percent,
      };
      subtotal -= discountAmount;
    }

    // 11. Add cleaning fee
    const cleaningFee = fees?.cleaning_fee ? parseFloat(fees.cleaning_fee.toString()) : 0;

    // 12. Add extra guest fee
    const extraGuestThreshold = fees?.extra_guest_threshold || 2;
    const extraGuestFee =
      guestCount > extraGuestThreshold && fees?.extra_guest_fee
        ? (guestCount - extraGuestThreshold) * parseFloat(fees.extra_guest_fee.toString())
        : 0;

    // 13. Add pet fee
    const petFee =
      petCount > 0 && fees?.pet_fee
        ? petCount * parseFloat(fees.pet_fee.toString())
        : 0;

    // 14. Calculate service fee (from platform settings)
    const serviceFee = subtotal * (serviceFeePercent / 100);

    // 15. Calculate tax
    const taxRate = fees?.tax_rate ? parseFloat(fees.tax_rate.toString()) : 0;
    const totalBeforeTax = subtotal + cleaningFee + extraGuestFee + petFee + serviceFee;
    const taxAmount = (totalBeforeTax * taxRate) / 100;

    // 16. Security deposit (not added to total, held separately)
    const securityDeposit = fees?.security_deposit ? parseFloat(fees.security_deposit.toString()) : 0;

    // 17. Calculate total
    const total = totalBeforeTax + taxAmount;

    // 18. Calculate total savings
    const savings =
      (lengthOfStayDiscount?.amount || 0) +
      (earlyBirdDiscount?.amount || 0) +
      (lastMinuteDiscount?.amount || 0) +
      (promotionalDiscount?.amount || 0);

    console.log('✅ [PricingCalc] Calculation complete!', { 
      subtotal, 
      fees: cleaningFee + extraGuestFee + petFee, 
      serviceFee, 
      taxAmount, 
      total,
      savings 
    });

    return {
      nights,
      basePrice,
      nightlyRates,
      subtotal,
      lengthOfStayDiscount,
      earlyBirdDiscount,
      lastMinuteDiscount,
      promotionalDiscount,
      cleaningFee,
      extraGuestFee,
      petFee,
      securityDeposit,
      serviceFee,
      serviceFeePercent: serviceFeePercent,
      taxAmount,
      taxRate,
      totalBeforeTax,
      total,
      savings,
    };
  } catch (error) {
    console.error('Error calculating booking price:', error);
    console.error('Error details:', {
      propertyId,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      guestCount,
      petCount,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};
