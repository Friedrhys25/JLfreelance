---
name: Identity Editorial
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c8c6c5'
  primary: '#c8c6c5'
  on-primary: '#303030'
  primary-container: '#131313'
  on-primary-container: '#7f7e7d'
  inverse-primary: '#5f5e5e'
  secondary: '#c8c6c6'
  on-secondary: '#303030'
  secondary-container: '#474747'
  on-secondary-container: '#b6b5b4'
  tertiary: '#c4c7c8'
  on-tertiary: '#2d3132'
  tertiary-container: '#101415'
  on-tertiary-container: '#7b7f80'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e4e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1b1c1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e0e3e4'
  tertiary-fixed-dim: '#c4c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#444748'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  surface-glass: rgba(19, 19, 19, 0.4)
  outline-light: '#e4e2e11a'
  text-outline: '#c4c7c7'
typography:
  display-xl:
    fontFamily: Anton
    fontSize: 96px
    fontWeight: '400'
    lineHeight: 100px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  container-max: 1440px
---

## Brand & Style
The brand identity is "Editorial Brutalism"—a fusion of high-fashion typography and raw, technical efficiency. It is designed for premium service environments (like modern hair studios) that demand both aesthetic sophistication and functional power. The UI should evoke a sense of commanding elegance, professional precision, and modern luxury.

The style leverages **Minimalism** through heavy use of whitespace and a restricted palette, **Glassmorphism** for layered technical panels, and **Brutalism** through high-impact, condensed typography and visible structural borders. A subtle film grain overlay (4% opacity) provides a tactile, analog quality that prevents the dark mode from feeling overly "digital."

## Colors
The color palette is a "Fidelity" dark mode centered around deep charcoals and warm grays. 
- **Primary:** A soft, desaturated metallic silver used for active states and highlights.
- **Surface:** The foundation is a true dark charcoal (#131313). 
- **Accents:** Use a high-contrast off-white for primary text and a muted variant for secondary metadata. 
- **Functional:** Use transparency and blur rather than solid colors for container depth. The "Glass" effect uses a semi-transparent surface with a 16px backdrop blur to create a sense of light passing through dark materials.

## Typography
The system uses a high-contrast typographic pairing. **Anton** serves as the display face, providing a powerful, commanding, and editorial feel in all-caps. **Hanken Grotesk** is the functional workhorse, providing extreme legibility for data-heavy POS screens. 

Use the "Outline" text effect (1px stroke) for large display headers to create layering and depth without adding visual weight. Tracking should be tightened for display roles and significantly opened (0.15em) for labels and metadata to maintain a technical, "coded" aesthetic.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy with a 1440px maximum container width. Use a 12-column system for desktop screens. 

Spacing is based on a 4px base unit. Margins are generous (64px on desktop) to support the editorial aesthetic. Content should be grouped in sections with significant vertical separation (32px to 128px) to emphasize a clean, non-cluttered hierarchy. Hero sections should leverage a split grid (e.g., 7 columns for text, 5 for visual) to create asymmetrical balance.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Tonal Layers** rather than heavy shadows. 

- **Level 0 (Background):** Solid #131313 with a noise texture overlay.
- **Level 1 (Sub-surface):** `surface-container-low` for large section backgrounds.
- **Level 2 (Floating Panels):** Glass panels using `rgba(19, 19, 19, 0.4)` with 16px blur and a 1px `outline-light` border.
- **Level 3 (Interactive):** `surface-container-highest` for hover states.

Shadows should be reserved for the "Tape" accent effect or extremely subtle object separation (`shadow-sm`).

## Shapes
The shape language is "Soft-Brutalist." It uses a base 4px (0.25rem) radius for standard components and buttons, maintaining a sharp, efficient look. 

- **Small elements (Buttons/Inputs):** 4px (rounded-DEFAULT).
- **Medium elements (Cards/Panels):** 8px (rounded-lg).
- **Large elements (Outer containers):** 12px (rounded-xl).
- **Accents:** Use imperfect, slightly rotated rectangular "Tape" shapes (8-10px height) as decorative accents on card headers to mimic a physical studio environment.

## Components
- **Buttons:** Primary buttons are solid `on-surface` (white/off-white) with `surface` (black) text. They use a 4px radius and 95% scale-on-click interaction. Secondary buttons use a 2px solid border with no fill.
- **Cards (Glass Panels):** Must include a 1px border at 10% opacity and a backdrop blur of at least 16px. Headers within cards should be separated by a 1px horizontal rule.
- **Navigation:** Top bar is semi-transparent with a `backdrop-blur-xl` and a sharp 4px black shadow to create a distinct "ledge" effect.
- **Status Indicators:** Use small, high-density icons (Material Symbols) with a `fill` variation of 1 for active states and 0 for inactive.
- **Inputs:** Fields should be styled like the "Access Control" list items: `surface-container` background, 4px radius, and a subtle border that highlights on focus.