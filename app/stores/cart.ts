import { defineStore } from 'pinia'
import type { DisplayProduct } from '~/composables/useProducts'
import { useToast } from '~/composables/useToast'
import { useI18n } from '~/composables/useI18n'

export interface CartCustomization {
  size?: 'S' | 'M' | 'L'
  iceLevel?: string
  sweetness?: string
  cream?: boolean
  extraShot?: boolean
  toppings?: string[]
}

export interface CartItem {
  product: DisplayProduct
  quantity: number
  customization?: CartCustomization
  unitPrice?: number
  sugarLevel?: string
  iceLevel?: string
  note?: string
}

export type OrderType = 'takeaway' | 'dinein' | 'delivery'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)
  const isFavoritesOpen = ref(false)
  const isFullMenuOpen = ref(false)
  const selectedProductForDetail = ref<DisplayProduct | null>(null)
  const isProductDetailOpen = ref(false)
  const favorites = ref<string[]>(['cappuccino', 'latte', 'cold-brew'])
  const isOrderSuccess = ref(false)
  const orderType = ref<OrderType>('takeaway')
  const orderNotes = ref('')

  // Toast & translation access
  const toast = useToast()
  const { isKhmer } = useI18n()

  // Load from localStorage on client init
  if (import.meta.client) {
    try {
      const savedCart = localStorage.getItem('sne_kafe_cart')
      if (savedCart) {
        items.value = JSON.parse(savedCart)
      }
      const savedFavs = localStorage.getItem('sne_kafe_favorites')
      if (savedFavs) {
        favorites.value = JSON.parse(savedFavs)
      }
    } catch (e) {
      console.warn('Failed to parse localStorage cart data', e)
    }
  }

  // Persist watcher
  const persist = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem('sne_kafe_cart', JSON.stringify(items.value))
        localStorage.setItem('sne_kafe_favorites', JSON.stringify(favorites.value))
      } catch (e) {
        console.warn('Failed to save to localStorage', e)
      }
    }
  }

  // Getters
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  })

  const formattedTotalPrice = computed(() => {
    return `$${totalPrice.value.toFixed(2)}`
  })

  const totalPriceKhr = computed(() => {
    return (totalPrice.value * 4000).toLocaleString('en-US') + ' ៛'
  })

  const isEmpty = computed(() => items.value.length === 0)

  // Drawer controls
  function openCart() {
    isOpen.value = true
    isFavoritesOpen.value = false
    isFullMenuOpen.value = false
  }

  function closeCart() {
    isOpen.value = false
  }

  function toggleCart() {
    isOpen.value = !isOpen.value
  }

  function openFavorites() {
    isFavoritesOpen.value = true
    isOpen.value = false
  }

  function closeFavorites() {
    isFavoritesOpen.value = false
  }

  function toggleFavorites() {
    isFavoritesOpen.value = !isFavoritesOpen.value
    if (isFavoritesOpen.value) {
      isOpen.value = false
    }
  }

  function openFullMenu() {
    isFullMenuOpen.value = true
    isOpen.value = false
    isFavoritesOpen.value = false
  }

  function closeFullMenu() {
    isFullMenuOpen.value = false
  }

  function toggleFullMenu() {
    isFullMenuOpen.value = !isFullMenuOpen.value
  }

  // Product Detail Modal controls
  function openProductDetail(product: DisplayProduct) {
    selectedProductForDetail.value = product
    isProductDetailOpen.value = true
  }

  function closeProductDetail() {
    isProductDetailOpen.value = false
    setTimeout(() => {
      if (!isProductDetailOpen.value) {
        selectedProductForDetail.value = null
      }
    }, 350)
  }

  function addCustomizedItem(product: DisplayProduct, customization: CartCustomization, unitPrice: number, quantity: number = 1) {
    const noteParts: string[] = []
    if (customization.size) noteParts.push(`Size ${customization.size}`)
    if (customization.iceLevel) noteParts.push(customization.iceLevel)
    if (customization.sweetness) noteParts.push(customization.sweetness)
    if (customization.cream) noteParts.push('+Whipped Cream')
    if (customization.extraShot) noteParts.push('+Extra Shot')
    if (customization.toppings?.length) noteParts.push(customization.toppings.join(', '))

    const customizedProduct: DisplayProduct = {
      ...product,
      price: unitPrice,
      formattedPrice: `$${unitPrice.toFixed(2)}`
    }

    items.value.push({
      product: customizedProduct,
      quantity,
      customization,
      unitPrice,
      note: noteParts.join(' • ')
    })
    persist()

    toast.show({
      title: isKhmer.value ? 'បានបញ្ចូលក្នុងកន្ត្រកជោគជ័យ' : 'Added to your order',
      message: `${product.name} (${quantity}x • $${(unitPrice * quantity).toFixed(2)})`,
      type: 'success',
      duration: 3500,
      actionText: isKhmer.value ? 'មើលកន្ត្រក' : 'View Cart',
      onAction: () => openCart(),
    })
  }

  // Cart actions
  function addItem(product: DisplayProduct) {
    const existingIndex = items.value.findIndex(item => item.product.id === product.id)
    if (existingIndex > -1) {
      items.value[existingIndex].quantity += 1
    } else {
      items.value.push({ product, quantity: 1 })
    }
    persist()

    // Show professional feedback toast
    toast.show({
      title: isKhmer.value ? 'បានបញ្ចូលក្នុងកន្ត្រកជោគជ័យ' : 'Added to your order',
      message: `${product.name} (${product.formattedPrice})`,
      type: 'success',
      duration: 3500,
      actionText: isKhmer.value ? 'មើលកន្ត្រក' : 'View Cart',
      onAction: () => openCart(),
    })
  }

  function addAllFavoritesToCart(favProducts: DisplayProduct[]) {
    if (favProducts.length === 0) return
    favProducts.forEach(product => {
      const existing = items.value.find(i => i.product.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        items.value.push({ product, quantity: 1 })
      }
    })
    persist()

    toast.show({
      title: isKhmer.value ? `បានដាក់ ${favProducts.length} មុខក្នុងកន្ត្រក` : `Added ${favProducts.length} favorite items`,
      message: isKhmer.value ? 'រួចរាល់សម្រាប់ការកុម្ម៉ង់' : 'Ready for checkout',
      type: 'success',
      actionText: isKhmer.value ? 'មើលកន្ត្រក' : 'View Cart',
      onAction: () => openCart(),
    })

    openCart()
  }

  function removeItem(productId: string) {
    items.value = items.value.filter(item => item.product.id !== productId)
    persist()
  }

  function increment(productId: string) {
    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      item.quantity += 1
      persist()
    }
  }

  function decrement(productId: string) {
    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        removeItem(productId)
      }
      persist()
    }
  }

  function clearCart() {
    items.value = []
    persist()
  }

  function toggleFavorite(productId: string) {
    const exists = favorites.value.includes(productId)
    if (exists) {
      favorites.value = favorites.value.filter(id => id !== productId)
      toast.show({
        title: isKhmer.value ? 'បានលុបពីបញ្ជីចូលចិត្ត' : 'Removed from favorites',
        type: 'info',
        duration: 2000,
      })
    } else {
      favorites.value.push(productId)
      toast.show({
        title: isKhmer.value ? 'បានដាក់ក្នុងបញ្ជីចូលចិត្ត' : 'Saved to favorites',
        type: 'success',
        duration: 2500,
        actionText: isKhmer.value ? 'មើលបញ្ជី' : 'View List',
        onAction: () => openFavorites(),
      })
    }
    persist()
  }

  function isFavorite(productId: string) {
    return favorites.value.includes(productId)
  }

  function checkout() {
    if (items.value.length === 0) return
    isOrderSuccess.value = true
    items.value = []
    persist()
  }

  function resetOrderSuccess() {
    isOrderSuccess.value = false
  }

  return {
    items,
    isOpen,
    isFavoritesOpen,
    isFullMenuOpen,
    selectedProductForDetail,
    isProductDetailOpen,
    favorites,
    isOrderSuccess,
    orderType,
    orderNotes,
    totalItems,
    totalPrice,
    formattedTotalPrice,
    totalPriceKhr,
    isEmpty,
    openCart,
    closeCart,
    toggleCart,
    openFavorites,
    closeFavorites,
    toggleFavorites,
    openFullMenu,
    closeFullMenu,
    toggleFullMenu,
    openProductDetail,
    closeProductDetail,
    addCustomizedItem,
    addItem,
    addAllFavoritesToCart,
    removeItem,
    increment,
    decrement,
    clearCart,
    toggleFavorite,
    isFavorite,
    checkout,
    resetOrderSuccess,
  }
})
