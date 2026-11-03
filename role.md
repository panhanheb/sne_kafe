# ROLE
Act as a senior product designer and senior front-end engineer. You specialize in premium, award-level marketing sites (Awwwards / Codrops quality) built with Nuxt and Vue. Every decision should feel intentional: consistent spacing, refined typography, and motion that serves the content rather than decorating it. No generic template look.

# PROJECT
Build a single-page coffee shop landing website called "BODRIN" using Nuxt 4 + Vue 3 (Composition API, `<script setup lang="ts">`), Tailwind CSS, and @nuxt/image. The UI language is Russian. Match the attached design as closely as possible, then elevate it with professional polish.

---

## Tech stack
- Nuxt 4 (app/ directory structure), TypeScript (strict)
- Tailwind CSS (@nuxtjs/tailwindcss), @nuxt/image, @nuxt/fonts (Inter, with Cyrillic subset)
- Pinia for cart state
- GSAP + ScrollTrigger for scroll and timeline animations (register as a client-only Nuxt plugin)
- Lenis for smooth, inertial scrolling (synced with ScrollTrigger)
- @vueuse/core for utilities (useMouse, useElementBounding, usePreferredReducedMotion, useIntersectionObserver)
- i18n-ready structure (default locale: ru)

---

## Design system (define everything as tokens; no magic numbers in components)

### Colors (tailwind.config)
- `bg`: `#2B1D16` → `#3A2A21` gradient, plus a subtle dark marble/wave texture and noise grain overlay (2–3% opacity) for depth
- `heading`: `#D9A87C` (warm sand/caramel)
- `body`: `#A88B74` (muted beige-brown)
- `accent`: `#6FA8A3` (teal), `accent-hover`: slightly lighter, `accent-text`: `#1A1009`
- `glass`: `rgba(58,42,33,0.45)`, `glass-border`: `rgba(255,255,255,0.08)`

### Typography (fluid, using clamp())
- **Display H1**: `clamp(2.5rem, 5vw + 1rem, 4.5rem)`, semi-bold, tight leading (1.05), slight negative letter-spacing
- **H2**: `clamp(2rem, 3vw + 1rem, 3.25rem)`; **H3**: `1.25–1.5rem`
- **Body**: 15–16px, leading 1.6, max line length ~60ch
- Use `text-wrap: balance` on headings and `pretty` on paragraphs

### Spacing and layout
- 8px spacing scale; section vertical padding `clamp(80px, 12vw, 160px)`
- Container max-width 1280px with fluid side padding
- 12-column grid on desktop

### Surfaces
- Radii: sm `12px`, md `20px`, lg `28px`, pill `9999px`
- Glass cards: `backdrop-blur-xl`, 1px inner highlight border on top edge, layered soft shadows (one tight, one wide and warm)
- Elevation tokens: rest, hover, active

---

## Motion system (one consistent language across the whole site)

### Tokens (in `composables/useMotion.ts`)
- **Durations**: fast `200ms`, base `400ms`, slow `700ms`, hero `1200ms`
- **Easings**: `out-expo` `cubic-bezier(0.16, 1, 0.3, 1)` for entrances; `in-out` `cubic-bezier(0.65, 0, 0.35, 1)` for transitions; spring for interactive feedback
- **Stagger**: 60–80ms between siblings

### Principles
- Entrances move up 24–40px and fade in. Never bounce text.
- Only animate `transform` and `opacity` (plus `clip-path`/`filter` where needed).
- Every animation is interruptible and never blocks interaction.
- `prefers-reduced-motion`: disable parallax, smooth scroll, and floating loops; replace with simple opacity fades.

---

## Page structure

### 1. Preloader (short, under 1.5s)
- BODRIN logo where the coffee cup "I" fills with coffee, then the curtain wipes up and hands off to the hero intro.
- Only show it on first visit (`sessionStorage`).

### 2. AppHeader
- Logo "BODRIN" (SVG, coffee-cup icon replacing the "I"; steam on the cup animates subtly on hover)
- Centered glass pill navigation: Главная, Меню, О нас, Отзывы, Акции
- The active indicator is a sliding underline/pill that moves smoothly between links; active link updates with scroll position (scroll-spy)
- Right: favorites icon, cart icon with counter, teal button "Сделать заказ"
- Behavior: transparent at top; on scroll gains blur, background, and shrinks slightly; hides on scroll-down, reappears on scroll-up
- Mobile: animated hamburger that morphs into an X, with a full-screen menu where links reveal with a stagger

### 3. HeroSection
- H1 "Открой для себя превосходный вкус в каждом глотке!" reveals line-by-line with a masked slide-up (split into lines; words if lines break oddly)
- Paragraph "У нас кофе – не просто напиток, а искусство. Приглашаем вас на уникальное кулинарное путешествие, где каждый глоток – встреча с идеальным вкусом." fades in after
- Teal button "Выбрать кофе": magnetic hover effect (button follows cursor slightly) with an arrow that slides on hover
- Right: two overlapping branded cups (brown and cream) with a coffee splash. Cups scale in with a soft spring, then float gently (slow, offset loops so they never sync). They tilt slightly toward the mouse (3D, max 6°)
- Coffee beans with depth layers: near beans move faster on scroll and mouse move; far beans are smaller and blurred (real parallax depth)
- Subtle scroll indicator at the bottom

### 4. ProductCards (typed array in `composables/useProducts.ts`)
| Product | Price | Rating | Description |
|---|---|---|---|
| Cappuccino | 120 р. | 4.9 | 20% эспрессо, 40% молока и 40% молочной пенки. |
| Latte | 140 р. | 5.0 | 30% эспрессо и 70% горячего молока. |
| Mocha | 140 р. | 4.7 | 20% эспрессо, 50% горячего молока и 30% горячего шоколада. |

- Card: cup image overlapping top edge, rating badge with star, name, description, price, round teal "+" button
- **Interactions**:
  - Cards reveal with a stagger on scroll
  - Hover: card lifts, cup rises and rotates slightly, soft glow appears under the cup, light reflection follows cursor across the glass surface
  - "+" button: on click, a small copy of the cup flies along a curved path to the cart icon → cart icon bumps → counter rolls up. "+" briefly becomes a checkmark
- "Перейти в меню" link: underline animates left-to-right on hover

### 5. AboutSection ("BODRIN это")
- Centered cup image with teal "Заказать" button
- 4 feature blocks (2 left, 2 right) with large faint numbers 1–4 behind the titles:
  1. Высокое качество зерен
  2. Атмосфера вдохновения и уюта
  3. Индивидуальный подход к каждому гостю
  4. Профессиональная команда барист
- **Motion**: cup rotates slowly as you scroll through the section (scroll-linked). Numbers count up or draw in as each block enters. Thin connector lines draw from each block toward the cup.
- Falling coffee beans bottom-right: continuous slow loop with rotation

### 6. QuizBanner
- Wide glass card: "Узнай какой кофе подходит тебе больше всего" + button "Пройти тест"
- Wooden spoon full of beans overflowing the card on the right — slides in on scroll, a few beans tumble off
- Button opens **QuizModal**:
  - Modal scales up from the button's position (shared-element feel) with a blurred backdrop
  - 4 questions, one per step, with a progress bar. Steps slide horizontally; answers are large selectable cards with clear selected states
  - Result screen: recommended drink reveals with a light confetti of coffee beans and an "Add to cart" button
  - Closes with Esc; focus is trapped; background does not scroll

### 7. CartDrawer
- Slides in from the right with a spring; items reveal with a stagger
- Quantity stepper with animated number changes; removing an item collapses its row smoothly
- Animated total, empty state with illustration, sticky checkout button

### 8. AppFooter
- Large BODRIN wordmark that reveals on scroll
- Small underlined links: Новости кофейни, телеграм, инстаграм (animated underline on hover)

---

## Professional quality details
- Custom cursor on desktop only (small dot + a ring that grows over interactive elements); hidden on touch devices
- Consistent states for every interactive element: hover, `focus-visible` (teal ring), active (`scale 0.97`), disabled
- Skeleton or blur-up placeholders while images load; no layout shift (set `width` and `height` on all images)
- Section transitions feel continuous: background gradient subtly shifts tone between sections

---

## Accessibility
- Semantic HTML landmarks, one H1, logical heading order
- Full keyboard navigation, visible focus, `aria-label` on icon buttons, live region for "added to cart"
- Text contrast at least WCAG AA
- `prefers-reduced-motion` fully respected (see motion system)

---

## Responsive
- Mobile-first. Breakpoints: 375, 768, 1024, 1440
- Mobile: stacked hero, horizontal-scroll product cards with scroll-snap and pagination dots, single-column features, reduced particle counts
- Disable mouse-based effects (tilt, magnetic, cursor) on touch; use subtle scroll-based motion instead

---

## Performance
- Target Lighthouse 90+ on mobile: Performance, Accessibility, Best Practices, SEO
- GSAP and Lenis load client-only; kill all ScrollTriggers and timelines on component unmount
- `NuxtImg` with webp/avif, responsive sizes, lazy loading except hero images (preload those)
- Animations pause when tab is hidden or elements are off-screen

---

## SEO
- `useHead`/`useSeoMeta` with Russian title and description, `lang="ru"`, Open Graph and Twitter tags, favicon set
- JSON-LD structured data for `CafeOrCoffeeShop`

---

## Project structure
```
app/
  assets/css/main.css
  components/
    AppHeader.vue
    AppPreloader.vue
    HeroSection.vue
    ProductCard.vue
    ProductList.vue
    AboutSection.vue
    QuizBanner.vue
    QuizModal.vue
    CartDrawer.vue
    AppFooter.vue
    ui/
      BaseButton.vue
      MagneticButton.vue
      CustomCursor.vue
  composables/
    useProducts.ts
    useMotion.ts
    useScrollReveal.ts
    useSplitText.ts
    useFlyToCart.ts
  plugins/
    gsap.client.ts
    lenis.client.ts
  stores/
    cart.ts
  pages/
    index.vue
public/
  images/ (cups, beans, spoon placeholders)
```

---

## Deliverables
- Full, working code for every file (no `// rest of the code` shortcuts)
- Placeholder images where assets are missing, plus a list of what I need to supply:
  - PNG cups with transparent backgrounds (at 2x resolution)
  - Coffee beans (3–4 angles for variety)
  - Spoon with beans
  - Background texture
  - Coffee splash
- Setup instructions: `npx nuxi init`, install deps, `npm run dev`
- A short summary of the motion system and how to adjust timings globally
