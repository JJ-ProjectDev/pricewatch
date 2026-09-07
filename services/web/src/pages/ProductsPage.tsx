import { useState, useEffect } from 'react'
import api from '@/lib/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader
} from '@/components/ui/card'
import { WatchButton } from '@/components/watchlist/WatchButton'
import { Link } from 'react-router-dom'
import { Product } from '@/lib/types'
import ProductCard from '@/components/ui/ProductCard'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Product[]>('/products')
      .then((response) => setProducts(response.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  // TODO: revert once CORS is fixed
  const MOCK_PRODUCTS: Product[] = [
    {
      id: '1',
      name: 'Vertex RTX 4070 Ti',
      description:
        'A compact two-slot card that fits small-form-factor builds without compromising on 1080p and 1440p performance.',
      imageUrl: 'https://picsum.photos/seed/gpu1/600/400',
      createdAt: '2025-01-15T10:00:00.000Z'
    },
    {
      id: '2',
      name: 'Nimbus Air 14',
      description:
        'A thin-and-light 14 inch laptop built for all-day battery life without sacrificing performance on the go.',
      imageUrl: 'https://picsum.photos/seed/laptop2/600/400',
      createdAt: '2025-02-20T10:00:00.000Z'
    },
    {
      id: '3',
      name: 'Solace X2',
      description:
        'A flagship phone with a large OLED display, all-day battery, and a versatile triple-camera system.',
      imageUrl: 'https://picsum.photos/seed/phone3/600/400',
      createdAt: '2025-03-05T10:00:00.000Z'
    }
  ]

  //if (loading) return <p>Loading...</p>
  //if (error) return <p>Something went wrong, please try again</p>
  return (
    <main>
      {MOCK_PRODUCTS.length === 0 ? (
        <p> no products found </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
