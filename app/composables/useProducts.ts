import { useI18n } from './useI18n'

export interface LocalizedString {
  km: string
  en: string
}

export type ProductCategory = 'hot' | 'iced' | 'specialty' | 'bakery'

export interface Product {
  id: string
  category: ProductCategory
  name: LocalizedString
  nameEn: string
  priceUsd: number
  priceKhr: number
  rating: number
  reviewsCount?: number
  description: LocalizedString
  composition?: LocalizedString
  image: string
  badge?: LocalizedString
  isFeatured?: boolean
}

export interface DisplayProduct {
  id: string
  category: ProductCategory
  name: string
  nameEn: string
  price: number
  formattedPrice: string
  rating: number
  reviewsCount?: number
  description: string
  composition?: string
  image: string
  badge?: string
  isFeatured?: boolean
}

export const useProducts = () => {
  const { locale } = useI18n()

  const rawProducts: Product[] = [
    {
      id: 'cappuccino',
      category: 'hot',
      isFeatured: true,
      name: {
        km: 'កាពូឈីណូ',
        en: 'Cappuccino',
      },
      nameEn: 'Cappuccino',
      priceUsd: 2.75,
      priceKhr: 11000,
      rating: 4.9,
      reviewsCount: 142,
      description: {
        km: 'អេសប្រេសូ ២០%, ទឹកដោះគោក្តៅ ៤០% និងពពុះទឹកដោះគោក្រាស់ទន់រលោង ៤០%។',
        en: '20% espresso, 40% steamed milk, and 40% silky velvety milk foam.',
      },
      composition: {
        km: 'អេសប្រេសូ, ទឹកដោះគោក្តៅ, ពពុះទឹកដោះគោក្រាស់ទន់, ម្សៅកាកាវ',
        en: 'Espresso, steamed milk, velvety thick foam, cocoa dusting',
      },
      image: '/images/cup-cappuccino.svg',
      badge: {
        km: 'ពេញនិយមបំផុត',
        en: 'Best Seller',
      },
    },
    {
      id: 'latte',
      category: 'hot',
      isFeatured: true,
      name: {
        km: 'ឡាតេ',
        en: 'Latte',
      },
      nameEn: 'Latte',
      priceUsd: 3.00,
      priceKhr: 12000,
      rating: 5.0,
      reviewsCount: 198,
      description: {
        km: 'អេសប្រេសូ ៣០% និងទឹកដោះគោក្តៅស្រទន់ ៧០%។',
        en: '30% espresso and 70% gentle velvety steamed milk.',
      },
      composition: {
        km: 'អារ៉ាប៊ីកា ២ ស្ហុត, ទឹកដោះគោចំហុយទន់ល្មើយ, ពពុះទឹកដោះគោកម្រិតស្តើង',
        en: 'Double shot Arabica, delicate steamed milk, thin layer of microfoam',
      },
      image: '/images/cup-latte.svg',
      badge: {
        km: 'ជម្រើសភ្ញៀវកិត្តិយស',
        en: "Guest's Choice",
      },
    },
    {
      id: 'mocha',
      category: 'specialty',
      isFeatured: true,
      name: {
        km: 'ម៉ូកា',
        en: 'Mocha',
      },
      nameEn: 'Mocha',
      priceUsd: 3.25,
      priceKhr: 13000,
      rating: 4.7,
      reviewsCount: 89,
      description: {
        km: 'អេសប្រេសូ ២០%, ទឹកដោះគោក្តៅ ៥០% និងសូកូឡាក្តៅពិសេស ៣០%។',
        en: '20% espresso, 50% steamed milk, and 30% rich melted dark chocolate.',
      },
      composition: {
        km: 'អេសប្រេសូ, សូកូឡាខ្មៅប៊ែលហ្ស៊ិក, ទឹកដោះគោក្តៅ, ក្រែមវីប',
        en: 'Espresso, Belgian dark chocolate, steamed milk, whipped cream',
      },
      image: '/images/cup-mocha.svg',
      badge: {
        km: 'រសជាតិបង្អែមដ៏ឆ្ងាញ់',
        en: 'Sweet Masterpiece',
      },
    },
    {
      id: 'espresso',
      category: 'hot',
      isFeatured: false,
      name: {
        km: 'អេសប្រេសូ ដិត',
        en: 'Espresso Solo',
      },
      nameEn: 'Espresso Solo',
      priceUsd: 2.00,
      priceKhr: 8000,
      rating: 4.8,
      reviewsCount: 76,
      description: {
        km: 'អេសប្រេសូសុទ្ធ ១០០% ស្រង់ចេញយ៉ាងផ្ចិតផ្ចង់ជាមួយស្រទាប់ក្រែមាមាសដ៏ក្រាស់។',
        en: '100% single origin Arabica extracted with thick golden crema and intense aroma.',
      },
      image: '/images/cup-espresso.svg',
    },
    {
      id: 'americano',
      category: 'iced',
      isFeatured: false,
      name: {
        km: 'អាមេរិកាណូ ទឹកកក',
        en: 'Iced Americano',
      },
      nameEn: 'Iced Americano',
      priceUsd: 2.50,
      priceKhr: 10000,
      rating: 4.9,
      reviewsCount: 164,
      description: {
        km: 'អេសប្រេសូ ២ ស្ហុត បន្ថែមទឹកត្រជាក់ និងដុំទឹកកក ផ្តល់ភាពស្រស់ស្រាយពេញមួយថ្ងៃ។',
        en: 'Double espresso shots poured over chilled water and crystal clear ice cubes.',
      },
      image: '/images/cup-americano.svg',
      badge: {
        km: 'ស្រស់ស្រាយ',
        en: 'Refreshing',
      },
    },
    {
      id: 'caramel-macchiato',
      category: 'specialty',
      isFeatured: false,
      name: {
        km: 'ការ៉ាមែល ម៉ាគីយ៉ាតូ',
        en: 'Caramel Macchiato',
      },
      nameEn: 'Caramel Macchiato',
      priceUsd: 3.50,
      priceKhr: 14000,
      rating: 4.9,
      reviewsCount: 120,
      description: {
        km: 'ទឹកដោះគោស្រស់ ជាមួយវ៉ានីឡា ចាក់ពីលើដោយអេសប្រេសូ និងទឹកការ៉ាមែលឈ្ងុយផ្អែម។',
        en: 'Fresh steamed milk with Madagascar vanilla, espresso cascade, and buttery caramel drizzle.',
      },
      image: '/images/cup-macchiato.svg',
    },
    {
      id: 'cold-brew',
      category: 'iced',
      isFeatured: false,
      name: {
        km: 'កាហ្វេត្រជាក់ Cold Brew',
        en: 'Signature Cold Brew',
      },
      nameEn: 'Signature Cold Brew',
      priceUsd: 3.25,
      priceKhr: 13000,
      rating: 5.0,
      reviewsCount: 95,
      description: {
        km: 'ត្រាំគ្រាប់កាហ្វេពិសេសក្នុងទឹកត្រជាក់រយៈពេល ១៨ ម៉ោង រសជាតិទន់ មិនជូរ និងឈ្ងុយជ្រៅ។',
        en: 'Slow-steeped in cold filtered water for 18 hours. Ultra-smooth, low acidity, naturally sweet.',
      },
      image: '/images/cup-coldbrew.svg',
      badge: {
        km: 'រូបមន្តពិសេស',
        en: 'Signature',
      },
    },
    {
      id: 'matcha-latte',
      category: 'specialty',
      isFeatured: false,
      name: {
        km: 'ម៉ាចាឡាតេ ជប៉ុន',
        en: 'Iced Matcha Latte',
      },
      nameEn: 'Iced Matcha Latte',
      priceUsd: 3.25,
      priceKhr: 13000,
      rating: 4.8,
      reviewsCount: 110,
      description: {
        km: 'ម្សៅតែបៃតងម៉ាចាសុទ្ធមកពីប្រទេសជប៉ុន វាយជាមួយទឹកដោះគោស្រស់ផ្អែមស្រទន់។',
        en: 'Ceremonial grade Uji Japanese matcha whisked with fresh whole milk.',
      },
      image: '/images/cup-matcha.svg',
    },
    {
      id: 'croissant',
      category: 'bakery',
      isFeatured: false,
      name: {
        km: 'នំប៉័ងក្រូសង់ប៊័រ',
        en: 'French Butter Croissant',
      },
      nameEn: 'French Butter Croissant',
      priceUsd: 2.20,
      priceKhr: 9000,
      rating: 4.9,
      reviewsCount: 88,
      description: {
        km: 'នំក្រូសង់ដុតថ្មីៗរាល់ព្រឹក ស្រទាប់ច្រើន ស្រួយខាងក្រៅ ទន់ខាងក្នុង ឈ្ងុយប៊័របារាំង។',
        en: 'Freshly baked daily French croissant with flaky golden layers and rich butter aroma.',
      },
      image: '/images/bakery-croissant.svg',
      badge: {
        km: 'ដុតថ្មីៗ',
        en: 'Freshly Baked',
      },
    },
  ]

  const products = computed<DisplayProduct[]>(() => {
    const l = locale.value
    return rawProducts.map(p => ({
      id: p.id,
      category: p.category,
      name: p.name[l] || p.name.en,
      nameEn: p.nameEn,
      price: p.priceUsd,
      formattedPrice: `$${p.priceUsd.toFixed(2)}`,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      description: p.description[l] || p.description.en,
      composition: p.composition ? (p.composition[l] || p.composition.en) : undefined,
      image: p.image,
      badge: p.badge ? (p.badge[l] || p.badge.en) : undefined,
      isFeatured: p.isFeatured,
    }))
  })

  const featuredProducts = computed<DisplayProduct[]>(() => {
    return products.value.filter(p => p.isFeatured)
  })

  const getProductById = (id: string): DisplayProduct | undefined => {
    return products.value.find(p => p.id === id)
  }

  return {
    products,
    featuredProducts,
    getProductById,
    rawProducts,
  }
}
