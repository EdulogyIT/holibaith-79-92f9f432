-- Add default pricing fees for all properties that don't have them
INSERT INTO pricing_fees (
  property_id, 
  cleaning_fee, 
  tax_rate, 
  security_deposit, 
  extra_guest_fee, 
  extra_guest_threshold, 
  pet_fee
)
SELECT 
  id,
  50.00 as cleaning_fee,
  19.00 as tax_rate,
  500.00 as security_deposit,
  20.00 as extra_guest_fee,
  2 as extra_guest_threshold,
  25.00 as pet_fee
FROM properties
WHERE id NOT IN (SELECT property_id FROM pricing_fees);

-- Add default length-of-stay discount rule (7+ nights = 10% off)
INSERT INTO pricing_rules (
  property_id, 
  rule_type, 
  discount_percent, 
  conditions, 
  is_active
)
SELECT 
  id,
  'length_discount' as rule_type,
  10 as discount_percent,
  '{"min_nights": 7, "type": "weekly"}'::jsonb as conditions,
  true as is_active
FROM properties
WHERE id NOT IN (
  SELECT property_id 
  FROM pricing_rules 
  WHERE rule_type = 'length_discount'
);

-- Add default early bird discount (30+ days advance = 5% off)
INSERT INTO pricing_rules (
  property_id, 
  rule_type, 
  discount_percent, 
  conditions, 
  is_active
)
SELECT 
  id,
  'early_bird' as rule_type,
  5 as discount_percent,
  '{"days_in_advance": 30}'::jsonb as conditions,
  true as is_active
FROM properties
WHERE id NOT IN (
  SELECT property_id 
  FROM pricing_rules 
  WHERE rule_type = 'early_bird'
);