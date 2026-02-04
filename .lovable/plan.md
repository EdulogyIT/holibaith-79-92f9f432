

## Fix Fonts to Match Screenshot Exactly

### Problem Identified
The **Playfair Display Italic** font variant is not being loaded from Google Fonts. The current import only loads regular weights (400-700) without the italic styles, so the `italic` CSS class has no effect.

### Screenshot Analysis
Looking at the reference screenshot:
- **"Discover Algeria differently."** - Uses Playfair Display **Italic** (elegant cursive serif with period at the end)
- **"Hotels and verified homes across Algeria."** - Uses Inter regular font (not italic)
- **Tab buttons** - Regular Inter font, no icons (just "Hotels" and "Short Stay" text)
- **Form labels** - Regular Inter font ("Destination", "Check-in", "Check-out", "Guests")
- **Search button** - Regular Inter font with search icon
- **Bottom tagline** - Regular Inter font

---

### Changes Required

#### 1. Update Google Fonts Import (`index.html`)

**Current (line 13):**
```html
family=Playfair+Display:wght@400;500;600;700
```

**Updated:**
```html
family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700
```

This loads both regular (0) and italic (1) variants of Playfair Display in all weights.

---

#### 2. Update Hero Section (`src/components/HeroSection.tsx`)

**Tab Buttons (lines 98-115):**
- Remove icons from tab buttons - screenshot shows only text
- Keep text styling as regular Inter font

**Current:**
```tsx
<IconComponent className="h-4 w-4" />
<span>{mode.label}</span>
```

**Change to:**
```tsx
<span>{mode.label}</span>
```

**Tab container width:**
- The screenshot shows tabs are wider (about 550px instead of max-w-xs)
- Update `max-w-xs` to `max-w-xl` for wider tabs

---

### Summary of Changes

| File | Change |
|------|--------|
| `index.html` | Add italic variants to Playfair Display font import |
| `src/components/HeroSection.tsx` | Remove icons from tab buttons, widen tab container |

### Visual Result
After these changes:
- ✅ Main title will display in elegant cursive Playfair Display Italic
- ✅ Tab buttons will show just "Hotels" and "Short Stay" text without icons
- ✅ All other text remains in regular Inter font as in the screenshot

