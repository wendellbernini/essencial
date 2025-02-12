import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '@/store/cart-slice'
import { getStorageItem, setStorageItem } from '@/lib/storage'

const CART_STORAGE_KEY = '@essencial/cart'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalQuantity: number
  totalAmount: number
}

export function useCart() {
  const dispatch = useDispatch()
  const { items, totalQuantity, totalAmount } = useSelector(
    (state: RootState) => state.cart,
  )

  useEffect(() => {
    const storedCart = getStorageItem<CartState>(CART_STORAGE_KEY)
    if (storedCart) {
      dispatch(clearCart())
      storedCart.items.forEach((item) => {
        dispatch(addToCart(item))
      })
    }
  }, [dispatch])

  useEffect(() => {
    setStorageItem(CART_STORAGE_KEY, { items, totalQuantity, totalAmount })
  }, [items, totalQuantity, totalAmount])

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      dispatch(addToCart({ ...item, quantity: item.quantity || 1 }))
    },
    [dispatch],
  )

  const removeItem = useCallback(
    (id: string) => {
      dispatch(removeFromCart(id))
    },
    [dispatch],
  )

  const updateItemQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity > 0) {
        dispatch(updateQuantity({ id, quantity }))
      }
    },
    [dispatch],
  )

  const clear = useCallback(() => {
    dispatch(clearCart())
  }, [dispatch])

  return {
    items,
    totalQuantity,
    totalAmount,
    addItem,
    removeItem,
    updateItemQuantity,
    clear,
  }
} 