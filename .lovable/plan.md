

## Fix Search Bar Width and Button Color to Match Screenshot

### Issues Identified

Looking at the current code:
1. **Width Mismatch**: The tab toggle uses `max-w-xl` (~576px) but the search card uses `max-w-4xl` (~896px) - they should be the same width
2. **Button Color**: The search button uses `hsl(160,50%,30%)` instead of the exact green `#2F6B4F` used in the tabs

---

### Changes Required

#### `src/components/HeroSection.tsx`

**1. Match widths - Line 116:**
Change the search Card from `max-w-4xl` to `max-w-xl` so it matches the tab toggle width above it:

```tsx
// Current
<Card className="max-w-4xl mx-auto p-4 sm:p-6 ...">

// Updated
<Card className="max-w-xl mx-auto p-4 sm:p-6 ...">
```

**2. Fix search button color - Lines 217-218:**
Update the button to use the exact same green `#2F6B4F` as the tabs:

```tsx
// Current
isFormValid() 
  ? "bg-[hsl(160,50%,30%)] hover:bg-[hsl(160,50%,25%)] text-white shadow-lg hover:shadow-xl"

// Updated  
isFormValid() 
  ? "bg-[#2F6B4F] hover:bg-[#265A42] text-white shadow-lg hover:shadow-xl"
```

---

### Visual Result
After these changes:
- ✅ Tab toggle and search form will have the same width
- ✅ Search button will be the exact same green (#2F6B4F) as the active tab
- ✅ Consistent, aligned appearance matching the screenshot

