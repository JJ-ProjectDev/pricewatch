import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Product } from '@/lib/types'
import ProductCard from '@/components/ui/ProductCard'
import { motion } from 'framer-motion'
import { ScrambleText } from '@/components/ScrambleText'
import {
  ProductCardSkeleton,
  SkeletonBlock
} from '@/components/ui/ProductCardSkeleton'
import { Search, SearchX, TriangleAlert } from 'lucide-react'
import type { Transition } from 'framer-motion'

import { MOCK_PRODUCTS } from '@/lib/data/mockData'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
}
const pageTransition: Transition = {
  duration: 0.4,
  ease: 'easeOut'
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
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <SkeletonBlock className="h-20 w-full max-w-100" />
          <SkeletonBlock className="h-4 w-full max-w-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }
  if (error)
    return (
      <div className="flex flex-col items-center mt-30">
        <TriangleAlert className="text-zinc-700" size={100} strokeWidth="2.3" />
        <p className="text-foreground font-semibold text-2xl pb-2 mb-3 border-b ">
          Something went wrong
        </p>
        <p className="text-muted-foreground text-sm mb-5">Try again latter</p>
      </div>
    )
  return (
    <motion.div
      className="flex flex-col gap-10"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={pageTransition}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-end">
        <div className="flex flex-col gap-3">
          <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl">
            <ScrambleText text="Products" />
          </h1>
          <p className="text-muted-foreground">
            Every product currently tracked on Pricewatch, across GPUs, laptops,
            and phones.
          </p>
        </div>
        <div className="relative border-2 w-full sm:w-80 md:w-100 border-border py-3 bg-card rounded-md shadow-[0px_0px_10px_0px_#2e2e2e] focus-within:border-primary hover:shadow-[0px_0px_10px_0px_var(--primary)] focus-within:shadow-[0px_0px_10px_0px_var(--primary)]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            placeholder="Search products..."
            className="pl-9 w-full outline-none"
          />
        </div>
      </div>
      <motion.div initial="hidden" animate="visible" variants={container}>
        {products.length === 0 ? (
          <div className="flex flex-col items-center mt-30 bg-card/40 py-20 rounded-2xl border border-dashed ">
            <div className="bg-card rounded-full flex size-20 items-center justify-center mb-4">
              <SearchX className="text-primary" size={50} strokeWidth="2.3" />
            </div>
            <p className="text-foreground font-semibold text-2xl pb-2 mb-3 border-b ">
              No products found
            </p>
            <p className="text-muted-foreground text-sm mb-5">
              Try adjusting your search or try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
