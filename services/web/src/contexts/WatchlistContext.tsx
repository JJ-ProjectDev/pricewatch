import {
  useState,
  useContext,
  useEffect,
  type ReactNode,
  createContext
} from 'react'
import { useAuth } from './AuthContext'
import api from '@/lib/api'
import type { Product } from '@/lib/types'

interface WatchlistContextValue {
  isWatchlistLoading: boolean
  watchlistIds: Set<string>
  toggleWatch: (productId: string) => Promise<void>
}

const WatchlistContext = createContext<WatchlistContextValue | undefined>(
  undefined
)

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (context === undefined) {
    throw new Error('useWatchlist must be used within an WatchlistProvider')
  }
  return context
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(true)
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set())
  const { isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      setWatchlistIds(new Set())
      setIsWatchlistLoading(false)
      return
    }

    api
      .get<Product[]>('/watchlist')
      .then((response) =>
        setWatchlistIds(new Set(response.data.map((p) => p.id)))
      )
      .catch((error) => {
        console.error(error)
      })
      .finally(() => setIsWatchlistLoading(false))
  }, [isLoading, isAuthenticated])

  async function toggleWatch(productId: string) {
    if (watchlistIds.has(productId)) {
      await api.delete(`/watchlist/${productId}`)

      const existingSet = new Set(watchlistIds)
      existingSet.delete(productId)
      setWatchlistIds(existingSet)
    } else {
      await api.post(`/watchlist/${productId}`)

      const existingSet = new Set(watchlistIds)
      existingSet.add(productId)
      setWatchlistIds(existingSet)
    }
  }
  const value: WatchlistContextValue = {
    isWatchlistLoading,
    watchlistIds,
    toggleWatch
  }

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}
