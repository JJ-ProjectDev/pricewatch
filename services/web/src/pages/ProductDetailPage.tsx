import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { WatchButton } from '@/components/watchlist/WatchButton'
import api from '@/lib/api'
import { Product } from '@/lib/types'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
type Status = 'loading' | 'notFound' | 'error' | 'loaded'

// simple substring match; good enough for known mock data, revisit if real product names get added
import deriveCategory from '@/lib/utils/getCategory'

// mock price until backend returns a real price field
import { getMockPrice } from '@/lib/utils/getPrices'

import { MOCK_PRODUCTS } from '@/lib/data/mockData'

export default function ProductDetailPage() {
  const [status, setStatus] = useState<Status>('loading')
  const [product, setProduct] = useState<Product | null>(null)

  const { id } = useParams()
  // useEffect(() => {
  //   api
  //     .get(`/products/${id}`)
  //     .then((response) => {
  //       setProduct(response.data)
  //       setStatus('loaded')
  //     })
  //     .catch((err) => {
  //       if (err.response?.status === 404) {
  //         setStatus('notFound')
  //       } else {
  //         setStatus('error')
  //       }
  //     })
  // }, [id])

  useEffect(() => {
    const found = MOCK_PRODUCTS.find((p) => p.id === id)
    if (found) {
      setProduct(found)
      setStatus('loaded')
    } else {
      setStatus('notFound')
    }
  }, [id])

  if (status === 'loading') return <p>Loading...</p>
  if (status === 'notFound') return <p>404 Item not found</p>
  if (status === 'error') return <p>Error while fetching please try again</p>
  return (
    <>
      {product && (
        <div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <img src={product.imageUrl} alt={`product ${product.name}`} />
          <WatchButton productId={product.id} />
          <Link
            to="/products"
            className={buttonVariants({ variant: 'outline' })}
          >
            Back to products
          </Link>
        </div>
      )}
    </>
  )
}

// TODO(revert): remove MOCK_PRODUCTS usage and restore the real api.get(...) fetch once the backend is wired
