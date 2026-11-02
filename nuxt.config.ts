// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/fonts',
    '@pinia/nuxt',
  ],

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700, 800] },
    ],
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'km',
      },
      title: 'ស្នេហ៍កាហ្វេ (Sne Kafe) — ស្វែងយល់ពីរសជាតិដ៏អស្ចារ្យក្នុងគ្រប់ដំណក់!',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'ស្នេហ៍កាហ្វេ (Sne Kafe) — កាហ្វេមិនមែនត្រឹមតែជាភេសជ្ជៈនោះទេ តែជាសិល្បៈ។ គ្រាប់កាហ្វេអារ៉ាប៊ីកា ១០០% លីងថ្មីៗរាល់ថ្ងៃ។',
        },
        { property: 'og:title', content: 'ស្នេហ៍កាហ្វេ (Sne Kafe) — Artisan Coffee Landing' },
        {
          property: 'og:description',
          content: 'ស្វែងយល់ពីរសជាតិដ៏អស្ចារ្យក្នុងគ្រប់ដំណក់! កាពូឈីណូ, ឡាតេ, ម៉ូកា និងគ្រាប់កាហ្វេពិសេស។',
        },
        { property: 'og:type', content: 'website' },
        { name: 'theme-color', content: '#2B1D16' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
})

