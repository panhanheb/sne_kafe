export type Locale = 'km' | 'en'

interface Translations {
  nav: {
    home: string
    menu: string
    about: string
    reviews: string
    promo: string
    orderBtn: string
  }
  hero: {
    tag: string
    title1: string
    titleHighlight: string
    title2: string
    description: string
    btnChoose: string
    btnAbout: string
    statVarieties: string
    statVarietiesLabel: string
    statBeans: string
    statBeansLabel: string
    statRating: string
    statRatingLabel: string
  }
  menu: {
    tag: string
    title: string
    description: string
    priceLabel: string
    currency: string
    viewMenu: string
    menuNotice: string
    hitBadge: string
    guestChoiceBadge: string
    dessertBadge: string
  }
  fullMenu: {
    tag: string
    title: string
    subtitle: string
    searchPlaceholder: string
    all: string
    catHot: string
    catIced: string
    catSpecialty: string
    catBakery: string
    noResults: string
    addToCart: string
  }
  favorites: {
    title: string
    countLabel: string
    emptyTitle: string
    emptyDesc: string
    emptyBtn: string
    addAllBtn: string
    clearBtn: string
    addToCart: string
    remove: string
  }
  about: {
    title: string
    orderBtn: string
    f1Title: string
    f1Desc: string
    f2Title: string
    f2Desc: string
    f3Title: string
    f3Desc: string
    f4Title: string
    f4Desc: string
  }
  quiz: {
    tag: string
    title: string
    description: string
    btnStart: string
    qProgress: string
    resultTag: string
    resultBtnOrder: string
    resultBtnRestart: string
    questions: Array<{
      title: string
      options: Array<{ text: string; type: string }>
    }>
  }
  cart: {
    title: string
    emptyTitle: string
    emptyDesc: string
    emptyBtn: string
    orderSuccessTitle: string
    orderSuccessDesc: string
    orderSuccessBtn: string
    perCup: string
    subtotal: string
    packaging: string
    free: string
    total: string
    checkoutBtn: string
  }
  footer: {
    news: string
    telegram: string
    instagram: string
    loyalty: string
    copyright: string
    hours: string
  }
}

export const translations: Record<Locale, Translations> = {
  km: {
    nav: {
      home: 'ទំព័រដើម',
      menu: 'ម៉ឺនុយ',
      about: 'អំពីយើង',
      reviews: 'មតិកែលម្អ',
      promo: 'ការផ្តល់ជូនពិសេស',
      orderBtn: 'កុម្ម៉ង់ឥឡូវនេះ',
    },
    hero: {
      tag: 'គ្រាប់កាហ្វេអារ៉ាប៊ីកា ១០០% លីងថ្មីៗរាល់ថ្ងៃ',
      title1: 'ស្វែងយល់ពី',
      titleHighlight: 'រសជាតិដ៏អស្ចារ្យ',
      title2: 'ក្នុងគ្រប់ដំណក់!',
      description: 'សម្រាប់យើង កាហ្វេមិនមែនត្រឹមតែជាភេសជ្ជៈនោះទេ តែជាសិល្បៈ។ យើងសូមអញ្ជើញលោកអ្នកមកទទួលយកបទពិសោធន៍ដ៏វិសេសវិសាល ដែលគ្រប់ដំណក់គឺជារសជាតិដ៏ល្អឥតខ្ចោះ។',
      btnChoose: 'ជ្រើសរើសកាហ្វេ',
      btnAbout: 'ស្វែងយល់បន្ថែម',
      statVarieties: '១៥+',
      statVarietiesLabel: 'ប្រភេទកាហ្វេ',
      statBeans: '១០០%',
      statBeansLabel: 'គ្រាប់កាហ្វេពិសេស',
      statRating: '៤.៩',
      statRatingLabel: 'ពិន្ទុវាយតម្លៃមធ្យម',
    },
    menu: {
      tag: 'ភេសជ្ជៈពេញនិយមប្រចាំហាង',
      title: 'ម៉ឺនុយពិសេសរបស់យើង',
      description: 'រាល់ពែងត្រូវបានឆុងយ៉ាងយកចិត្តទុកដាក់ចេញពីគ្រាប់កាហ្វេថ្មីៗ ជាមួយតុល្យភាពកម្ដៅ និងសាច់ពពុះទឹកដោះគោដ៏ទន់រលោង',
      priceLabel: 'តម្លៃ',
      currency: '$',
      viewMenu: 'មើលម៉ឺនុយពេញលេញ',
      menuNotice: 'ម៉ឺនុយប្រចាំរដូវកាលមានផ្តល់ជូននៅហាងកាហ្វេរបស់យើងផងដែរ! កុម្ម៉ង់ភេសជ្ជៈដែលលោកអ្នកចូលចិត្តឥឡូវនេះ។',
      hitBadge: 'ពេញនិយមបំផុត',
      guestChoiceBadge: 'ជម្រើសភ្ញៀវកិត្តិយស',
      dessertBadge: 'រសជាតិបង្អែមដ៏ឆ្ងាញ់',
    },
    fullMenu: {
      tag: 'កាតាឡុកភេសជ្ជៈទាំងអស់',
      title: 'ម៉ឺនុយពេញលេញ «ស្នេហ៍កាហ្វេ»',
      subtitle: 'ជ្រើសរើសកាហ្វេ និងភេសជ្ជៈច្នៃដោយដៃប្រកបដោយគុណភាពខ្ពស់',
      searchPlaceholder: 'ស្វែងរកឈ្មោះភេសជ្ជៈ ឬគ្រឿងផ្សំ...',
      all: 'ទាំងអស់',
      catHot: 'កាហ្វេក្តៅ',
      catIced: 'កាហ្វេត្រជាក់',
      catSpecialty: 'ភេសជ្ជៈពិសេស',
      catBakery: 'នំដុតថ្មីៗ',
      noResults: 'រកមិនឃើញភេសជ្ជៈដែលត្រូវនឹងពាក្យស្វែងរកនេះទេ',
      addToCart: 'ដាក់ក្នុងកន្ត្រក',
    },
    favorites: {
      title: 'ភេសជ្ជៈចូលចិត្តរបស់អ្នក',
      countLabel: 'មុខភេសជ្ជៈ',
      emptyTitle: 'មិនទាន់មានភេសជ្ជៈក្នុងបញ្ជីចូលចិត្តទេ',
      emptyDesc: 'ចុចលើរូបបេះដូងនៅលើភេសជ្ជៈណាមួយ ដើម្បីរក្សាទុកសម្រាប់កុម្ម៉ង់យ៉ាងរហ័សនៅពេលក្រោយ។',
      emptyBtn: 'ស្វែងរកក្នុងម៉ឺនុយ',
      addAllBtn: 'កុម្ម៉ង់ទាំងអស់ចូលកន្ត្រក',
      clearBtn: 'សម្អាតបញ្ជី',
      addToCart: 'កុម្ម៉ង់',
      remove: 'លុប',
    },
    about: {
      title: 'ស្នេហ៍កាហ្វេ គឺជា',
      orderBtn: 'កុម្ម៉ង់ឥឡូវនេះ',
      f1Title: 'គុណភាពគ្រាប់កាហ្វេកម្រិតខ្ពស់',
      f1Desc: 'យើងជ្រើសរើសតែគ្រាប់កាហ្វេស្លាកពិសេស (Specialty Arabica) ១០០% ពីចម្ការល្បីៗលើពិភពលោក និងលីងក្នុងបរិមាណតិចៗដើម្បីរក្សាភាពស្រស់ថ្មី។',
      f2Title: 'បរិយាកាសកក់ក្តៅ និងបំផុសគំនិត',
      f2Desc: 'លំហរចនាឡើងប្រកបដោយផាសុកភាព ជាមួយពន្លឺស្រទន់ និងក្លិនឈ្ងុយកាហ្វេ ដែលស័ក្តិសមសម្រាប់ការបំពេញការងារ អានសៀវភៅ និងជួបជុំគ្នា។',
      f3Title: 'ការយកចិត្តទុកដាក់ចំពោះអតិថិជនម្នាក់ៗ',
      f3Desc: 'យើងរៀបចំភេសជ្ជៈតាមចំណូលចិត្តផ្ទាល់ខ្លួនរបស់អ្នក៖ អាចជ្រើសរើសកម្រិតពពុះ ទឹកដោះគោរុក្ខជាតិ ឬបន្ថែមទឹកស៊ីរ៉ូរូបមន្តពិសេស។',
      f4Title: 'ក្រុមអ្នកឆុងកាហ្វេអាជីព (បារីស្តា)',
      f4Desc: 'ក្រុមបារីស្តារបស់យើងមានវិញ្ញាបនបត្រត្រឹមត្រូវ មានចំណង់ចំណូលចិត្តខ្ពស់ និងផ្ចិតផ្ចង់ក្នុងការស្រង់រសជាតិកាហ្វេឱ្យល្អបំផុត។',
    },
    quiz: {
      tag: 'អ្នកជំនាញណែនាំកាហ្វេឆ្លាតវៃ',
      title: 'ស្វែងរកកាហ្វេដែលស័ក្តិសមបំផុតសម្រាប់អ្នក',
      description: 'ឆ្លើយសំណួរងាយៗ ៤ អំពីចំណង់ចំណូលចិត្តរបស់អ្នក ហើយយើងនឹងណែនាំភេសជ្ជៈដែលអ្នកនឹងពេញចិត្តតាំងពីការភ្លក្សដំបូង។',
      btnStart: 'ធ្វើតេស្តឥឡូវនេះ',
      qProgress: 'សំណួរ',
      resultTag: 'ជម្រើសដ៏ស័ក្តិសមបំផុតសម្រាប់អ្នក!',
      resultBtnOrder: 'កុម្ម៉ង់កាហ្វេនេះ',
      resultBtnRestart: 'ធ្វើតេស្តម្តងទៀត',
      questions: [
        {
          title: 'តើលោកអ្នកចូលចិត្តទទួលទានកាហ្វេបែបណា?',
          options: [
            { text: 'ជាមួយពពុះទឹកដោះគោក្រាស់ទន់ និងរលោង', type: 'cappuccino' },
            { text: 'រសជាតិស្រទន់ ស្រាល និងមានជាតិទឹកដោះគោច្រើន', type: 'latte' },
            { text: 'ផ្អែមឆ្ងាញ់ដូចបង្អែម ជាមួយក្លិនឈ្ងុយសូកូឡា', type: 'mocha' },
            { text: 'តុល្យភាពស្តង់ដាររវាងអេសប្រេសូ និងទឹកដោះគោ', type: 'cappuccino' },
          ],
        },
        {
          title: 'តើពេលណាជាវេលាដែលអ្នកចូលចិត្តទទួលទានកាហ្វេបំផុត?',
          options: [
            { text: 'ពេលព្រឹកព្រលឹម — ដើម្បីដាស់ស្មារតីឱ្យស្រស់ស្រាយភ្លាមៗ', type: 'cappuccino' },
            { text: 'ពេលរសៀល — សម្រាប់ការសម្រាកបន្ធូរអារម្មណ៍', type: 'latte' },
            { text: 'ពេលល្ងាច — ជាភេសជ្ជៈកក់ក្តៅក្រោយបញ្ចប់ការងារ', type: 'mocha' },
            { text: 'គ្រប់ពេលវេលា អាចទទួលទានបានរាល់ពេល!', type: 'latte' },
          ],
        },
        {
          title: 'តើតុល្យភាពរសជាតិផ្អែម និងល្វីងមួយណាដែលអ្នកពេញចិត្ត?',
          options: [
            { text: 'ល្វីងស្រាលកម្រិតមធ្យម ជាមួយក្លិនឈ្ងុយគ្រាប់ធញ្ញជាតិ', type: 'cappuccino' },
            { text: 'រសជាតិទឹកដោះគោផ្អែមស្រទន់ គ្មានរសជាតិល្វីងខ្លាំង', type: 'latte' },
            { text: 'ភាពសុខដុមនៃសូកូឡា និងក្រែមវីបផ្អែមឈ្ងុយ', type: 'mocha' },
            { text: 'ក្លិនឈ្ងុយការ៉ាមែល និងកាហ្វេដិតជាប់មាត់', type: 'cappuccino' },
          ],
        },
        {
          title: 'តើអ្នកចូលចិត្តទំហំពែងកម្រិតណា?',
          options: [
            { text: 'ទំហំមធ្យមស្តង់ដារ (៣០០ មីលីលីត្រ)', type: 'cappuccino' },
            { text: 'ទំហំធំសម្រាប់កាន់ដើរកម្សាន្ត (៤៥០ មីលីលីត្រ)', type: 'latte' },
            { text: 'ទំហំព្រមជាមួយក្រែមបន្ថែម (៣៥០ មីលីលីត្រ)', type: 'mocha' },
            { text: 'សំខាន់ឱ្យតែរសជាតិឆ្ងាញ់ ទំហំមិនសំខាន់ទេ', type: 'latte' },
          ],
        },
      ],
    },
    cart: {
      title: 'ការកុម្ម៉ង់របស់អ្នក',
      emptyTitle: 'កន្ត្រករបស់អ្នកមិនទាន់មានទំនិញទេ',
      emptyDesc: 'សូមជ្រើសរើសកាហ្វេដែលលោកអ្នកពេញចិត្តពីម៉ឺនុយ ឬធ្វើតេស្តដើម្បីទទួលបានការណែនាំពិសេស។',
      emptyBtn: 'ជ្រើសរើសពីម៉ឺនុយ',
      orderSuccessTitle: 'ការកុម្ម៉ង់ជោគជ័យ!',
      orderSuccessDesc: 'បារីស្តារបស់យើងកំពុងចាប់ផ្តើមកិនគ្រាប់កាហ្វេស្រស់ៗ និងរៀបចំជូនលោកអ្នក។ ភេសជ្ជៈនឹងរួចរាល់ក្នុងរយៈពេល ៧ នាទី!',
      orderSuccessBtn: 'យល់ព្រម ខ្ញុំរង់ចាំ!',
      perCup: 'ក្នុងមួយពែង',
      subtotal: 'តម្លៃកាហ្វេ',
      packaging: 'ការវេចខ្ចប់',
      free: 'ឥតគិតថ្លៃ',
      total: 'សរុបត្រូវទូទាត់',
      checkoutBtn: 'បញ្ជាក់ការកុម្ម៉ង់',
    },
    footer: {
      news: 'ព័ត៌មានកាហ្វេ',
      telegram: 'តេឡេក្រាម',
      instagram: 'អុីនស្តាក្រាម',
      loyalty: 'កម្មវិធីសមាជិក',
      copyright: '© ២០២៦ ហាងកាហ្វេ «ស្នេហ៍កាហ្វេ (Sne Kafe)»។ រក្សាសិទ្ធិគ្រប់យ៉ាង។',
      hours: 'បម្រើជូនលោកអ្នករៀងរាល់ថ្ងៃ ចាប់ពីម៉ោង ០៨:០០ ដល់ ២២:០០',
    },
  },
  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      about: 'About Us',
      reviews: 'Reviews',
      promo: 'Offers',
      orderBtn: 'Order Now',
    },
    hero: {
      tag: '100% Arabica beans freshly roasted daily',
      title1: 'Discover',
      titleHighlight: 'Exceptional Taste',
      title2: 'in every single sip!',
      description: 'For us, coffee is not just a drink, but an art form. We invite you on an extraordinary culinary journey where every sip is a rendezvous with perfection.',
      btnChoose: 'Explore Coffee',
      btnAbout: 'About Us',
      statVarieties: '15+',
      statVarietiesLabel: 'Coffee varieties',
      statBeans: '100%',
      statBeansLabel: 'Specialty beans',
      statRating: '4.9',
      statRatingLabel: 'Average rating',
    },
    menu: {
      tag: 'Signature Favorites',
      title: 'Our Signature Menu',
      description: 'Every cup is prepared from freshly roasted beans with an ideal balance of temperature and silky milk texture',
      priceLabel: 'Price',
      currency: '$',
      viewMenu: 'View Full Menu',
      menuNotice: 'Our seasonal specialty menu is also available at our coffee bar! Order your favorite drink now.',
      hitBadge: 'Best Seller',
      guestChoiceBadge: "Guest's Choice",
      dessertBadge: 'Sweet Masterpiece',
    },
    fullMenu: {
      tag: 'All Handcrafted Drinks',
      title: 'Sne Kafe Full Menu',
      subtitle: 'Browse our complete catalog of signature specialty drinks and artisan bakery',
      searchPlaceholder: 'Search drink name or ingredients...',
      all: 'All',
      catHot: 'Hot Coffee',
      catIced: 'Iced Coffee',
      catSpecialty: 'Specialty & Tea',
      catBakery: 'Bakery',
      noResults: 'No drinks match your search query',
      addToCart: 'Add to Cart',
    },
    favorites: {
      title: 'Your Favorites',
      countLabel: 'saved drinks',
      emptyTitle: 'No favorites saved yet',
      emptyDesc: 'Tap the heart icon on any drink in our menu to save your beloved choices here.',
      emptyBtn: 'Browse Full Menu',
      addAllBtn: 'Add All to Cart',
      clearBtn: 'Clear All',
      addToCart: 'Order',
      remove: 'Remove',
    },
    about: {
      title: 'Sne Kafe is',
      orderBtn: 'Order Now',
      f1Title: 'High Quality Coffee Beans',
      f1Desc: 'We carefully handpick 100% specialty Arabica from top high-altitude plantations worldwide and micro-roast for peak freshness.',
      f2Title: 'Cozy & Inspiring Atmosphere',
      f2Desc: 'A warm space with soothing ambient lighting and rich espresso aromas, crafted for focused work, reading, and pleasant conversations.',
      f3Title: 'Personalized Approach to Every Guest',
      f3Desc: 'We customize each beverage to your exact taste: fine-tuned foam density, oat or almond milk, or signature handcrafted syrups.',
      f4Title: 'Professional Barista Team',
      f4Desc: 'Our SCA-certified baristas bring deep passion, craftsmanship, and precision extraction techniques to every single shot.',
    },
    quiz: {
      tag: 'Interactive Coffee Sommelier',
      title: 'Find Out Which Coffee Suits You Best',
      description: 'Answer 4 simple questions about your taste preferences, and we will match you with a coffee you will fall in love with from the very first sip.',
      btnStart: 'Take the Quiz',
      qProgress: 'Question',
      resultTag: 'Your Perfect Match!',
      resultBtnOrder: 'Order This Coffee',
      resultBtnRestart: 'Retake Quiz',
      questions: [
        {
          title: 'How do you prefer your coffee to be prepared?',
          options: [
            { text: 'With dense, silky and velvety milk foam', type: 'cappuccino' },
            { text: 'Extra milky, smooth, and gentle', type: 'latte' },
            { text: 'Sweet dessert-like notes with rich chocolate', type: 'mocha' },
            { text: 'A balanced classic ratio of espresso and milk', type: 'cappuccino' },
          ],
        },
        {
          title: 'What is your favorite time of day for coffee?',
          options: [
            { text: 'Early morning — for an immediate energizing boost', type: 'cappuccino' },
            { text: 'Afternoon — for a peaceful and mindful break', type: 'latte' },
            { text: 'Evening — a warm comforting sweet treat', type: 'mocha' },
            { text: 'Anytime — coffee is always a good idea!', type: 'latte' },
          ],
        },
        {
          title: 'What is your ideal balance of sweetness and roast intensity?',
          options: [
            { text: 'Moderate pleasant bitterness with nutty undertones', type: 'cappuccino' },
            { text: 'Creamy smooth sweetness with zero harsh bitterness', type: 'latte' },
            { text: 'Decadent chocolate harmony crowned with whipped cream', type: 'mocha' },
            { text: 'Rich caramel notes and full-bodied coffee aroma', type: 'cappuccino' },
          ],
        },
        {
          title: 'Which cup size do you typically choose?',
          options: [
            { text: 'Classic regular cup (300 ml)', type: 'cappuccino' },
            { text: 'Large size for a long scenic stroll (450 ml)', type: 'latte' },
            { text: 'Indulgent treat with toppings (350 ml)', type: 'mocha' },
            { text: 'Whatever tastes best, size is secondary', type: 'latte' },
          ],
        },
      ],
    },
    cart: {
      title: 'Your Order',
      emptyTitle: 'Your cart is empty',
      emptyDesc: 'Choose your favorite drink from our signature menu or take the quick quiz for a tailored recommendation.',
      emptyBtn: 'Browse Menu',
      orderSuccessTitle: 'Order Received!',
      orderSuccessDesc: 'Our barista has already started freshly grinding the beans and steaming the milk. Your order will be ready in 7 minutes!',
      orderSuccessBtn: 'Awesome, thank you!',
      perCup: 'per cup',
      subtotal: 'Coffee items',
      packaging: 'Packaging & cup',
      free: 'Free',
      total: 'Total amount',
      checkoutBtn: 'Proceed to Checkout',
    },
    footer: {
      news: 'Coffee Journal',
      telegram: 'Telegram',
      instagram: 'Instagram',
      loyalty: 'Loyalty Program',
      copyright: '© 2026 Sne Kafe (ស្នេហ៍កាហ្វេ). All rights reserved.',
      hours: 'Welcoming guests daily from 08:00 AM to 10:00 PM',
    },
  },
}

// Global shared state for language
const currentLocale = ref<Locale>('km')

export const useI18n = () => {
  const setLocale = (locale: Locale) => {
    currentLocale.value = locale
    if (import.meta.client) {
      localStorage.setItem('sne_kafe_locale', locale)
      document.documentElement.lang = locale
    }
  }

  const toggleLocale = () => {
    setLocale(currentLocale.value === 'km' ? 'en' : 'km')
  }

  // Initialize from localStorage in browser
  if (import.meta.client) {
    const saved = localStorage.getItem('sne_kafe_locale') as Locale | null
    if (saved && (saved === 'km' || saved === 'en')) {
      currentLocale.value = saved
      document.documentElement.lang = saved
    }
  }

  const t = computed(() => translations[currentLocale.value])
  const isKhmer = computed(() => currentLocale.value === 'km')

  return {
    locale: currentLocale,
    setLocale,
    toggleLocale,
    t,
    isKhmer,
  }
}
