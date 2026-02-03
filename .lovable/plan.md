

## Homepage Redesign to Match Screenshots

### Overview
I'll update the homepage to match the 8 screenshots exactly, ensuring the same fonts, colors, wording, and layout.

---

### 1. Hero Section Updates (`src/components/HeroSection.tsx`)

**Current vs Screenshot Differences:**
- Tab toggle styling needs to change from pill-shaped to full-width rectangular tabs
- Search form fields need visual updates
- Guest display should show "2" instead of dropdown label

**Changes:**
- **Tab Toggle:** Change from rounded pill toggle to full-width rectangular tabs inside a rounded container
  - "Hotels" tab: Green background (`#2F6B4F`), white text when active
  - "Short Stay" tab: White background, dark text when active
  - Both tabs should span ~50% width each
- **Search Form:** Maintain the 4-column layout (Destination, Check-in, Check-out, Guests)
- **Search Button:** Full-width green button with search icon

---

### 2. Two Ways Section Updates (`src/components/TwoWaysSection.tsx`)

**Screenshot Analysis:**
- Title: "Two ways to experience Algeria" (Playfair Display, italic)
- Subtitle: "Whether you seek the refinement of luxury hotels or the intimacy of verified homes, Holibayt curates exceptional stays tailored to your journey."
- Cards have:
  - Full image with icon badge (top-left, white circle)
  - Title below image: "Hotels" / "Short Stay" (Playfair Display)
  - Description text
  - Feature bullets with icons (shield, star, clock)
  - CTA Button: "Explore Hotels →" / "Explore Homes →"

**Changes:**
- Add feature bullets section to each card:
  - Hotels: Professional service & 24/7 reception, Premium amenities & dining options, Flexible booking & instant confirmation
  - Short Stay: Every home personally verified by our team, Unique properties with local character, Full kitchens & home-like amenities
- Add CTA buttons: "Explore Hotels →" and "Explore Homes →"
- Add stats section below cards: "Trusted by travelers across Algeria" with 2,500+ Properties, 50,000+ Happy Guests, 4.9 Average Rating

---

### 3. Cities Section Updates (`src/components/CitiesSection.tsx`)

**Screenshot Analysis:**
- Title: "Explore by City" (Playfair Display, italic)
- Subtitle: "Discover the unique character of Algeria's most captivating destinations"
- 4 city cards: Algiers (248 properties), Oran (156 properties), Constantine (89 properties), Tlemcen (64 properties)
- Cards with rounded corners, image overlay, city name and property count at bottom
- "View all destinations →" link at bottom

**Changes:**
- Update title wording to match exactly
- Keep the same 4 cities but update property counts to match screenshot (or keep dynamic)
- Cards remain similar but ensure styling matches

---

### 4. Featured Stays Section Updates (`src/components/FeaturedStaysSection.tsx`)

**Screenshot Analysis:**
- Title: "Featured Stays" (Playfair Display, italic)
- Subtitle: "Handpicked accommodations that define luxury and authenticity"
- 4 property cards with:
  - "Featured" badge (gold/tan color)
  - Property image
  - Title (two lines): "Le Royal Mansour", "Mediterranean Villa", "Sahara Desert Resort", "Casbah Heritage House"
  - Star rating (right-aligned): 4.9, 4.8, 4.7, 4.9
  - Location with pin icon
  - Price: €180.00/night, €120.00/night, €150.00/night, €95.00/night
  - Review count: 324 reviews, 156 reviews, 203 reviews, 287 reviews

**Changes:**
- Update sample data to match screenshot exactly
- Price format: "€180.00 / night" with "324 reviews" on same line
- Layout adjustments to match screenshot

---

### 5. Why Choose Section Updates (`src/components/WhyChooseSection.tsx`)

**Screenshot Analysis:**
- Title: "Why Choose Holibayt" (Playfair Display, regular - not italic)
- Subtitle: "Redefining hospitality in Algeria with uncompromising quality"
- 4 cards with:
  - Square images with dark gradient overlay at bottom
  - Title text on image: "Verified Properties", "Curated Excellence", "Local Expertise", "Premium Service"
  - Description below image

**Changes:**
- Title should NOT be italic (currently is italic - remove)
- Keep the same 4 feature cards
- Descriptions:
  - Verified Properties: "Every property is personally inspected and verified by our team to ensure the highest standards"
  - Curated Excellence: "Handpicked accommodations that represent the best of Algerian hospitality and luxury"
  - Local Expertise: "Authentic experiences guided by locals who know and love their cities"
  - Premium Service: "24/7 dedicated support ensuring your journey is seamless from booking to checkout"

---

### 6. Add New "Share Your Space" CTA Section

**Screenshot Analysis (Screenshot 7):**
- Dark green background (`#2F6B4F`) with mountain/landscape overlay
- Home icon in white circle at top center
- Title: "Share your space with travelers" (Playfair Display, italic, white)
- Subtitle: "Join Algeria's premier hospitality platform and connect with travelers seeking authentic luxury experiences"
- Two buttons:
  - "Get Started →": White background, dark text
  - "Learn More": Outline style, white border, white text
- Stats at bottom: 2,500+ Properties | 50,000+ Happy Guests | 4.9 Average Rating

**Changes:**
- Create new component or update `ReadyToHostCTA.tsx` to match this design
- Add home icon circle
- Update wording to match
- Add two buttons instead of one
- Add stats row at bottom with vertical dividers

---

### 7. Update Index.tsx Section Order

**Current Order:**
1. HeroSection
2. TwoWaysSection
3. CitiesSection
4. WhyChooseSection
5. FeaturedStaysSection

**New Order (based on screenshots):**
1. HeroSection
2. TwoWaysSection (with stats)
3. CitiesSection (Explore by City)
4. FeaturedStaysSection
5. WhyChooseSection
6. ShareYourSpaceCTA (new)
7. Footer

---

### 8. Translation Keys Updates (`src/contexts/LanguageContext.tsx`)

Add/update the following English keys:
```text
twoWaysSubtitle: 'Whether you seek the refinement of luxury hotels or the intimacy of verified homes, Holibayt curates exceptional stays tailored to your journey.'
exploreHotels: 'Explore Hotels'
exploreHomes: 'Explore Homes'
trustedByTravelers: 'Trusted by travelers across Algeria'
propertiesPlus: 'Properties'
happyGuests: 'Happy Guests'
averageRating: 'Average Rating'
shareYourSpaceTitle: 'Share your space with travelers'
shareYourSpaceSubtitle: 'Join Algeria\'s premier hospitality platform and connect with travelers seeking authentic luxury experiences'
getStarted: 'Get Started'
```

---

### Files to Modify

1. **`src/components/HeroSection.tsx`** - Tab toggle styling
2. **`src/components/TwoWaysSection.tsx`** - Add feature bullets, CTA buttons, stats section
3. **`src/components/CitiesSection.tsx`** - Minor wording/styling updates
4. **`src/components/FeaturedStaysSection.tsx`** - Update sample data, layout tweaks
5. **`src/components/WhyChooseSection.tsx`** - Remove italic from title, update descriptions
6. **`src/components/ReadyToHostCTA.tsx`** - Complete redesign to match screenshot
7. **`src/pages/Index.tsx`** - Reorder sections, add ReadyToHostCTA
8. **`src/contexts/LanguageContext.tsx`** - Add new translation keys

---

### Design Specifications

**Colors:**
- Primary Green: `#2F6B4F` (tabs, buttons, CTA background)
- Gold/Tan Badge: `#D4A574` or similar (Featured badge)
- Text Dark: `#1F2937`
- Text Muted: `#6B7280`

**Typography:**
- Hero title: Playfair Display, italic
- Section titles: Playfair Display, some italic, some regular
- Body text: Inter/system font, regular

