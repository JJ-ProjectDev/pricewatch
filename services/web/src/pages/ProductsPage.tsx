import { useState, useEffect } from 'react'
import api from '@/lib/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader
} from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Product } from '@/lib/types'


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/products')
      .then((response) => setProducts(response.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Something went wrong, please try again</p>
  return (
    <main>
      {products.length === 0 ? (
        <p> no products found </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img src={product.imageUrl} alt={product.name} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
