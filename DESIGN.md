---
name: Precision Enterprise
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#525657'
  on-tertiary: '#ffffff'
  tertiary-container: '#6b6e70'
  on-tertiary-container: '#eff1f3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2.5rem
  container-margin: 2rem
  gutter: 1rem
  sidebar-width: 280px
---

## Brand & Style
The design system is engineered for a high-stakes manufacturing environment where clarity, speed of resolution, and institutional trust are paramount. The aesthetic merges **Premium Corporate** reliability with **Glassmorphism** accents to soften the industrial nature of ERP workflows. 

The UI should evoke a sense of "High-Fidelity Control"—everything feels intentional, structured, and responsive. We lean into a refined Modern Corporate style that utilizes whitespace and subtle translucency to prevent the information-dense environment of a textile IT management system from feeling overwhelming.

## Colors
The palette is rooted in a professional "Enterprise Blue" that signals authority and technical stability. 

- **Primary:** Used for main actions, active states, and brand identifiers.
- **Surface & Backgrounds:** The base layer is a pure white (`#FFFFFF`) for clarity, while the secondary background for grouping elements is a sophisticated Light Gray (`#F1F5F9`).
- **Semantic Colors:** Success, Error, and Warning colors must maintain high visibility to alert IT staff of ticket urgency and manufacturing downtime risks.
- **Glassmorphism Effects:** Overlays and card accents use semi-transparent white (`rgba(255, 255, 255, 0.7)`) with a 12px backdrop-blur to create depth without sacrificing readability.

## Typography
This design system utilizes **Inter** exclusively to leverage its exceptional legibility in data-heavy interfaces.

- **Headlines:** Use a tighter letter-spacing for headlines to create a compact, authoritative feel.
- **Body:** The standard size for ticket details and complaint logs is `body-md` (14px) to balance information density with readability.
- **Labels:** Use the uppercase `label-md` for table headers and form category labels to establish a clear hierarchy.
- **Mobile Adjustments:** Headlines above 24px should scale down by 15% on mobile devices while maintaining line-height ratios.

## Layout & Spacing
The layout follows a **Fixed Sidebar / Fluid Content** model optimized for high-resolution desktop monitors common in administrative offices.

- **Sidebar:** A persistent 280px navigation rail on the left provides instant access to Dashboard, Ticket Queue, Inventory IT, and Reports.
- **Grid:** Use a 12-column grid for content areas. Content should be housed in "Glass" containers that span 4, 6, or 12 columns.
- **Rhythm:** An 8px linear scale is the primary driver for spacing, ensuring all elements align to a predictable vertical rhythm. 
- **Responsive:** On tablets, the sidebar collapses into an icon rail. On mobile, the sidebar moves to a bottom navigation bar or a hamburger menu, and container margins reduce to 1rem.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Glassmorphism**, avoiding the heavy shadows of traditional ERPs.

1.  **Level 0 (Base):** Light Gray (`#F8FAFC`) background.
2.  **Level 1 (Cards):** White background with a 1px border (`#E2E8F0`) and a very soft, diffused shadow (`offset-y: 4px, blur: 20px, opacity: 0.04`).
3.  **Level 2 (Glass Overlays):** Used for side-panels or modal headers. `rgba(255, 255, 255, 0.7)` with `backdrop-filter: blur(12px)`.
4.  **Interactive:** Hover states on cards should slightly increase the shadow spread and reduce the border opacity to create a "lift" effect.

## Shapes
In line with the 16px requirement, all primary containers and UI cards use the `rounded-lg` (1rem / 16px) token.

- **Small Elements:** Buttons and input fields use the base `rounded` (0.5rem / 8px) to maintain a professional, slightly sharper appearance than the larger containers.
- **Selection States:** Checkboxes use a 4px corner radius to feel distinct from circular radio buttons.

## Components

### Buttons
- **Primary:** Solid `#2563EB` with white text. 8px corner radius. Subtle 10% darkening on hover.
- **Secondary:** Light Gray background (`#F1F5F9`) with `#1E293B` text.
- **Ghost:** No background, primary color text, used for less urgent actions like "Cancel" or "View Log."

### Input Fields
- **Default State:** 1px solid `#CBD5E1` border, 8px roundedness.
- **Focus State:** 2px solid `#2563EB` with a soft blue outer glow (3px spread).
- **Labels:** Always positioned above the field in `label-md` style.

### Glass Cards
- Used for Dashboard widgets (e.g., "Active Downtime," "Open Tickets"). 
- Requires a 16px border-radius and the backdrop-blur effect. 
- Headers within cards should have a subtle 1px bottom border.

### Status Chips
- **Urgent:** Red background (10% opacity) with Bold Red text.
- **In-Progress:** Blue background (10% opacity) with Bold Blue text.
- **Resolved:** Green background (10% opacity) with Bold Green text.
- Chips should use the `pill-shaped` roundedness for high contrast against rectangular cards.

### Data Tables
- Row height: 56px for standard, 48px for compact mode.
- Zebra striping: Use `#F8FAFC` for even rows.
- Hover state: Highlight the entire row with a subtle `#F1F5F9` tint.