import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Product } from '@/lib/types'
import ProductCard from '@/components/ui/ProductCard'
import { motion } from 'framer-motion'
import { ScrambleText } from '@/components/ScrambleText'
import { ProductCardSkeleton } from '@/components/ui/ProductCardSkeleton'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
}

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }
  if (error) return <p>Something went wrong, please try again</p>
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="font-mono">
          <ScrambleText text="Products" />
        </h1>
        <p className="text-muted-foreground">
          Every product currently tracked on Pricewatch, across GPUs, laptops,
          and phones.
        </p>
      </div>
      <motion.div initial="hidden" animate="visible" variants={container}>
        {products.length === 0 ? (
          <p> no products found </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
