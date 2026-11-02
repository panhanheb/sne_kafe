Build a single-page coffee shop landing website called "BODRIN" using Nuxt 4 + Vue 3 (Composition API, <script setup lang="ts">), Tailwind CSS, and @nuxt/image. The UI language is Russian. Match the attached design as closely as possible.

## Tech stack
- Nuxt 4 (app/ directory structure), TypeScript
- Tailwind CSS (@nuxtjs/tailwindcss), @nuxt/image, @nuxt/fonts (Inter)
- Pinia for the cart state, @vueuse/motion (or CSS animations) for animations
- Optional: i18n-ready structure (default locale: ru)

## Design tokens
- Background: deep coffee brown (#2B1D16 to #3A2A21) with a subtle dark wavy/marble texture and a large faint watermark text behind the cards
- Primary heading color: warm sand/caramel (#D9A87C)
- Body text: muted beige-brown (#A88B74), small size
- Accent / buttons: soft teal (#6FA8A3) with dark text, fully rounded (pill)
- Cards: glassmorphism (semi-transparent brown, backdrop-blur, rounded-3xl, soft border)
- Font: Inter, headings semi-bold, large
- Define all of these in tailwind.config as custom colors

## Page structure (app/pages/index.vue + components)
1. **AppHeader**
   - Logo "BODRIN" (left, SVG/text with coffee-cup icon replacing the "I")
   - Centered glass pill navigation: Главная (active, underlined), Меню, О нас, Отзывы, Акции (smooth scroll to sections)
   - Right: favorites icon, cart icon (with item counter from Pinia), and a teal button "Сделать заказ"
   - Sticky, with blur on scroll; hamburger menu on mobile

2. **HeroSection**
   - Left: H1 "Открой для себя превосходный вкус в каждом глотке!", paragraph "У нас кофе – не просто напиток, а искусство. Приглашаем вас на уникальное кулинарное путешествие, где каждый глоток – встреча с идеальным вкусом.", teal button "Выбрать кофе"
   - Right: two overlapping branded coffee cups (brown and cream) with a coffee splash, floating animation
   - Coffee beans scattered and floating (parallax on scroll)

3. **ProductCards** (3 cards, data from a typed array in composables/useProducts.ts)
   - Cappuccino – 120 р., rating 4.9; description "20% эспрессо, 40% молока и 40% молочной пенки."
   - Latte – 140 р., rating 5.0; description "30% эспрессо и 70% горячего молока."
   - Mocha – 140 р., rating 4.7; description "20% эспрессо, 50% горячего молока и 30% горячего шоколада."
   - Each card: cup image overlapping the top edge, rating badge with star, name, description, price, round teal "+" button that adds to cart
   - Underlined link below: "Перейти в меню"

4. **AboutSection** ("BODRIN это")
   - Centered cup image with a teal "Заказать" button underneath
   - 4 feature blocks around it (2 left, 2 right) with big faint numbers 1–4 behind the titles:
     1. Высокое качество зерен
     2. Атмосфера вдохновения и уюта
     3. Индивидуальный подход к каждому гостю
     4. Профессиональная команда барист
   - Each with a short description paragraph in muted text
   - Falling coffee beans decoration at the bottom right

5. **QuizBanner**
   - Wide glass card: "Узнай какой кофе подходит тебе больше всего" + button "Пройти тест"
   - Wooden spoon full of coffee beans on the right, overflowing the card
   - The button opens a modal with a simple 4-question quiz and a recommended drink result

6. **AppFooter**
   - Small underlined links: Новости кофейни, телеграм, инстаграм

## Functionality
- Pinia cart store (add/remove/quantity/total) + slide-in cart drawer
- Scroll-reveal animations on every section, hover lift on cards, floating animation on cups/beans
- Fully responsive (mobile-first: stacked hero, horizontal-scroll product cards, single-column features)
- SEO: useHead/useSeoMeta with Russian title and description, lang="ru"
- Optimized images (NuxtImg, webp, lazy loading except hero)

## Project structure
app/
  assets/css/main.css
  components/ (AppHeader, HeroSection, ProductCard, ProductList, AboutSection, QuizBanner, QuizModal, CartDrawer, AppFooter)
  composables/ (useProducts.ts)
  stores/cart.ts
  pages/index.vue
public/images/ (cups, beans, spoon placeholders)

## Deliverables
- Full working code for every file
- Placeholder images where assets are missing (note which ones I need to supply: PNG cups with transparent background, coffee beans, spoon, background texture)
- Setup instructions: npx nuxi init, install deps, npm run dev