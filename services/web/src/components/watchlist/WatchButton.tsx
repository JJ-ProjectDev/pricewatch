import { useAuth } from '@/contexts/AuthContext'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { useState } from 'react'

export function WatchButton({ productId }: { productId: string }) {
  const { isAuthenticated } = useAuth()
  const { watchlistIds, toggleWatch, isWatchlistLoading } = useWatchlist()
  const [isToggling, setIsToggling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setIsToggling(true)
    setError(null)
    try {
      await toggleWatch(productId)
    } catch (err) {
      setError('An error occurred while processing this product')
    } finally {
      setIsToggling(false)
    }
  }

  if (!isAuthenticated) return null
  if (isWatchlistLoading || isToggling) {
    return <button disabled>Loading</button>
  }

  const label = watchlistIds.has(productId) ? 'Unwatch' : 'Watch'
  return (
    <div>
      <button onClick={toggle}>{label}</button>
      {error && <p>{error}</p>}
    </div>
  )
}
