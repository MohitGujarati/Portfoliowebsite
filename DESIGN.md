# Design System & Aesthetics Guidelines

This document outlines the design language, color palettes, typography, and layout rules for the portfolio website.

## Color Palette

The site features a dual-theme system (Dark Mode by default, with Light Mode support). 

### Dark Theme (Default)
- **Background:** `#0c0d10` - A deep, almost-black space gray.
- **Surface:** `#14161b` - Used for cards and elevated components.
- **Surface 2:** `#1b1e25` - Used for secondary elevated layers or hover states.
- **Lines/Borders:** `#262a33` - Subtle dividers.
- **Primary Text:** `#eceef2` - Soft, highly legible off-white.
- **Muted Text:** `#9aa1ae` - Used for dates, tags, and secondary information.
- **Accent Color:** `#c8f560` - A vibrant, neon lime green. Used for links, highlights, and terminal elements.
- **Accent Soft / Glow:** `rgba(200, 245, 96, 0.12)` - Used for background ambient gradients and hover backgrounds.

### Light Theme
- **Background:** `#f6f5f0` - A warm, paper-like off-white.
- **Surface:** `#ffffff` - Pure white for cards.
- **Surface 2:** `#efeee7` - Slightly darker beige for secondary layers.
- **Lines/Borders:** `#e0ded5` - Soft gray lines.
- **Primary Text:** `#15171c` - Very dark gray, almost black.
- **Muted Text:** `#5b616d` - Medium gray.
- **Accent Color:** `#4a7a0c` - A deep, readable forest green.

## Typography

The project uses three highly specific, modern fonts loaded via `next/font/google`:

1. **Sans-Serif (Primary Font):** `Inter Tight`
   - Used for all standard body copy, headings, and UI elements.
   - Weights: Regular (400), Medium (500), Semi-Bold (600), Bold (700).

2. **Monospace (Terminal & Code):** `JetBrains Mono`
   - Used in the interactive terminal, code blocks, small tags, and technical UI elements (like the `$ ` prompt).
   - Weights: Regular (400), Medium (500), Bold (700).

3. **Serif (Accents & Quotes):** `Instrument Serif`
   - Used for `<em>` tags, blockquotes, and sophisticated visual flair.

## Layout & Spacing

- **Container Max-Width:** `1120px` - Keeps the content readable on ultra-wide screens without stretching too far.
- **Side Padding:** `24px` on the left and right of the main container.
- **Base Font Size:** `17px` for optimal readability.
- **Line Height:** `1.6` for body text.
- **Border Radius:** `18px` for primary cards and large elements. `6px` for small interactive elements like `<kbd>`.

## UI/UX Details & Micro-animations

- **Background Ambient Glow:** The dark mode features a subtle, fixed radial gradient using the accent color that follows the top of the viewport to give a "glowing" effect behind the content.
- **Grid Pattern:** A very faint dotted grid pattern sits behind the content, creating a subtle technical/engineering aesthetic.
- **Smooth Scrolling:** Enabled globally via `scroll-behavior: smooth`.
- **Transitions:** Hover states and theme switching utilize a smooth `0.3s` color transition.
- **Focus States:** High accessibility focus rings (`2px solid var(--accent)`) with a `3px` offset to clearly show keyboard navigation.
