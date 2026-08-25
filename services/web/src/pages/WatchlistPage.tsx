import { useState, useEffect } from 'react'
import { Product } from '@/lib/types'
import api from '@/lib/api'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
  Card
} from '@/components/ui/card'
import { WatchButton } from '@/components/watchlist/WatchButton'

export default function WatchlistPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)
  const [watchlistItems, setWatchlistItems] = useState<Product[]>([])

  useEffect(() => {
    api
      .get<Product[]>('/watchlist')
      .then((response) => setWatchlistItems(response.data))
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          setError(
            'Something went wrong while loading your watchlist. Please try again.'
          )
        } else {
          setError('Something went wrong. Please try again.')
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <p>Loading...</p>
  }
  if (error) {
    return (
      <p>
        Error while fetching the watchlist <small>{error}</small>
      </p>
    )
  }

  return (
    <main>
      {watchlistItems.length === 0 ? (
        <p>
          You haven't watched any products yet.{' '}
          <Link to="/products">Browse products</Link> to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {watchlistItems.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img src={product.imageUrl} alt={product.name} />
                  <WatchButton productId={product.id} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
