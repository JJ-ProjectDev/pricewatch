import { useAuth } from '@/contexts/AuthContext'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { useState } from 'react'
import { Bookmark, BookmarkOff } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  // if (!isAuthenticated) return null
  // if (isWatchlistLoading || isToggling) {
  //   return <button disabled>Loading</button>
  // }
  const isWatched = watchlistIds.has(productId)
  const label = isWatched? 'Unwatch' : 'Watch'

  return (
    <div>
      <button
        className={cn(
          'flex items-center gap-1 px-2.5 py-1 rounded-md hover:cursor-pointer',
          isWatched ? 'bg-accent' : 'bg-primary'
        )}
        onClick={toggle}
      >
        <span>
          {isWatched ? (
            <BookmarkOff size={16} />
          ) : (
            <Bookmark size={16} />
          )}
        </span>
        {label}
      </button>
      {error && <p>{error}</p>}
    </div>
  )
}
