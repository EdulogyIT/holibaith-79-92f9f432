
## Font and Text Case Fixes for Homepage

### Problem Identified
After reviewing the current homepage and comparing with the screenshots, there are two main issues:

1. **Missing Translation Keys** - Several translation keys are missing from the root level of the English translations, causing the `t()` function to return the camelCase key name instead of readable text:
   - `exploreHotels` → should display "Explore Hotels"
   - `exploreHomes` → should display "Explore Homes"
   - `trustedByTravelers` → should display "Trusted by travelers across Algeria"
   - `propertiesPlus` → should display "Properties"
   - `happyGuests` → should display "Happy Guests"
   - `becomeHost` → should display "Become a Host" (in Navigation)
   - `hostDashboard` → should display "Host Dashboard" (in Navigation)
   - `affiliateProgram` → should display "Affiliate Program"
   - `listYourProperty` → should display "List Your Property"

2. **Italic Font Styling** - Some titles that should be italic are not, and vice versa. Based on screenshots:
   - "Two ways to experience Algeria" - should be Playfair Display *italic*
   - "Explore by City" - should be Playfair Display *italic*
   - "Featured Stays" - should be Playfair Display *italic*
   - "Why Choose Holibayt" - should be Playfair Display *regular* (not italic)
   - "Share your space with travelers" - should be Playfair Display *italic*

---

### Files to Modify

#### 1. `src/contexts/LanguageContext.tsx`
Add missing translation keys at the root level of the EN translations:

**New keys to add (around line 1720 after Footer section):**
```text
// Two Ways Section CTAs
exploreHotels: 'Explore Hotels',
exploreHomes: 'Explore Homes',
trustedByTravelers: 'Trusted by travelers across Algeria',
propertiesPlus: 'Properties',
happyGuests: 'Happy Guests',

// Navigation
becomeHost: 'Become a Host',
listYourProperty: 'List Your Property',
hostDashboard: 'Host Dashboard',
```

Also add corresponding French translations (around line 254):
```text
// Two Ways Section CTAs
exploreHotels: 'Explorer les hôtels',
exploreHomes: 'Explorer les maisons',
trustedByTravelers: 'Approuvé par les voyageurs à travers l\'Algérie',
propertiesPlus: 'Propriétés',
happyGuests: 'Voyageurs satisfaits',
becomeHost: 'Devenir hôte',
listYourProperty: 'Publier une propriété',
```

#### 2. `src/components/TwoWaysSection.tsx`
The component is using the translation keys correctly, but without fallbacks. Update to ensure proper display:
- Line 21: `cta: t('exploreHotels') || 'Explore Hotels'` - already has fallback
- Line 35: `cta: t('exploreHomes') || 'Explore Homes'` - already has fallback
- Lines 45-47: Stats section - already has fallbacks
- Line 126: `trustedByTravelers` - already has fallback

#### 3. `src/components/WhyChooseSection.tsx`
- Line 41: Ensure title is NOT italic - currently correct (`font-playfair` without `italic` class)

#### 4. `src/components/HeroSection.tsx`
- Line 87: Title should be italic - currently correct (`font-playfair italic`)

#### 5. `src/components/CitiesSection.tsx`
- Line 78: Title should be italic - currently correct (`font-playfair italic`)

#### 6. `src/components/FeaturedStaysSection.tsx`
- Line 109: Title should be italic - currently correct (`font-playfair italic`)

#### 7. `src/components/ReadyToHostCTA.tsx`
- Line 38: Title should be italic - currently correct (`font-playfair italic`)

---

### Implementation Summary

**Main Change Required:**
Add the missing translation keys to `src/contexts/LanguageContext.tsx` in both English and French sections:

| Key | English | French |
|-----|---------|--------|
| exploreHotels | Explore Hotels | Explorer les hôtels |
| exploreHomes | Explore Homes | Explorer les maisons |
| trustedByTravelers | Trusted by travelers across Algeria | Approuvé par les voyageurs à travers l'Algérie |
| propertiesPlus | Properties | Propriétés |
| happyGuests | Happy Guests | Voyageurs satisfaits |
| becomeHost | Become a Host | Devenir hôte |
| listYourProperty | List Your Property | Publier une propriété |
| hostDashboard | Host Dashboard | Tableau de bord hôte |

**Font styling is already correct** - the italic classes are properly applied on the section titles.

---

### Technical Notes
The `t()` function in `LanguageContext.tsx` returns the key name when a translation is not found. By adding these keys to the root level of translations, the proper readable text will display instead of camelCase key names.
