-- Create platform_service_fees table for admin-controlled service fees
CREATE TABLE IF NOT EXISTS public.platform_service_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_percentage numeric NOT NULL DEFAULT 15,
  fee_type text NOT NULL DEFAULT 'percentage',
  category text NOT NULL CHECK (category IN ('short-stay', 'rent', 'buy')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_service_fees ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active service fees"
  ON public.platform_service_fees
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage service fees"
  ON public.platform_service_fees
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default service fees
INSERT INTO public.platform_service_fees (fee_percentage, fee_type, category) 
VALUES 
  (15, 'percentage', 'short-stay'),
  (10, 'percentage', 'rent'),
  (3, 'percentage', 'buy')
ON CONFLICT DO NOTHING;

-- Update properties table to set default currency to USD
ALTER TABLE public.properties 
  ALTER COLUMN price_currency SET DEFAULT 'USD';

-- Update existing properties without currency to USD
UPDATE public.properties 
SET price_currency = 'USD' 
WHERE price_currency IS NULL OR price_currency = 'EUR';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_platform_service_fees_category 
  ON public.platform_service_fees(category, is_active);