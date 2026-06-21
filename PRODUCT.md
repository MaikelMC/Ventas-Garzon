# Product

## Register

product

## Users

Dual audience serving two distinct but overlapping groups in Santiago de Cuba:

**1. Cuban households (consumer)** — Mobile-first shoppers buying groceries and household essentials (aseo, alimentos). Variable connection speeds, often on older Android devices. Price-sensitive, value convenience and trust. Need fast, lightweight pages with clear product info and simple checkout.

**2. Small retailers / bodegas (B2B)** — Corner store owners restocking inventory. Need bulk pricing, repeat-order efficiency, invoice tracking, and reliable stock visibility. Often order from desktop or tablet during business hours. Value speed and accuracy over discovery.

Both groups share: Spanish language, Cuban context, trust in local brand, need for reliable delivery.

## Product Purpose

Ventas Garzón is a local e-commerce platform for household essentials (cleaning supplies, food staples) that serves both consumers and small retailers in Santiago de Cuba. It provides:

- **For consumers**: Fast mobile browsing, category filtering, cart persistence, guest checkout, order history
- **For retailers**: Bulk pricing tiers, quick reorder, invoice-ready order details, stock alerts
- **For admins**: Dashboard with sales analytics, product CRUD, order management (status workflow), user management with roles

Success = reliable daily orders from both segments, low cart abandonment on mobile, admin efficiency in managing catalog/orders.

## Brand Personality

Modern, efficient, friendly

- **Modern**: Clean layouts, purposeful motion, contemporary type scale (Outfit display + DM Sans body), no decorative clutter
- **Efficient**: Every interaction reduces friction — predictive search, skeleton loading, keyboard-friendly forms, persistent cart
- **Friendly**: Warm green/amber palette feels approachable (not clinical), human copy tone, local Cuban identity in imagery/contact

## Anti-references

- **Generic SaaS cream/beige templates** — The warm-neutral band (OKLCH L 0.84-0.97, C < 0.06, hue 40-100) that reads as paper/sand/cream regardless of token name. Avoid `--paper`, `--cream`, `--sand`, `--bone`, `--linen`, `--parchment` backgrounds. Warmth comes from accent + typography + imagery, not body bg.
- **Cluttered Latin American marketplaces** — Dense, noisy layouts like MercadoLibre. Prefer breathing room, clear hierarchy, single primary action per screen.
- **Over-designed DTC brands** — Excessive gradients, 3D blobs, glassmorphism, decorative motion. Keep it clean and functional.

## Design Principles

1. **Mobile-first performance is a feature** — Cuban networks demand lightweight payloads, skeleton screens, optimized images, minimal JS. Every byte earns its place.
2. **Dual audience, unified system** — Shared components serve both consumer and retailer flows; differences live in composition, not duplication.
3. **Trust through clarity** — Transparent pricing (tax, shipping), visible stock, honest copy. No dark patterns.
4. **Motion serves function** — Animations confirm state changes (cart add, status update), guide focus, never decorate. Respect `prefers-reduced-motion`.
5. **Local identity, not local cliché** — Cuban context in contact info, imagery, currency — not in decorative patterns or "tropical" color tropes.

## Accessibility & Inclusion

- **WCAG AA baseline**: 4.5:1 body text contrast, 3:1 large text, keyboard navigation, screen reader labels, focus indicators
- **Reduced motion**: All animations have `@media (prefers-reduced-motion: reduce)` alternatives (crossfade/instant)
- **Color blindness safe**: Green/amber palette tested for deuteranopia/protanopia; status never relies on color alone (icons + labels)
- **Low-bandwidth optimization**: Critical — skeleton loading, lazy images, minimal bundle, service worker caching, graceful degradation