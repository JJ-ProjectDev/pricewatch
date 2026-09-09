import { useState, useEffect } from 'react'
import { Product } from '@/lib/types'
import api from '@/lib/api'
import { Link } from 'react-router-dom'
import axios from 'axios'

import { MOCK_PRODUCTS } from '@/lib/data/mockData'
import ProductCard from '@/components/ui/ProductCard'
import { motion } from 'framer-motion'
import { ScrambleText } from '@/components/ScrambleText'
import { buttonVariants } from '@/components/ui/button'
import { PackageOpen, SquareMousePointer } from 'lucide-react'

import SomethingWentWrong from '@/components/ui/SomethingWentWrong'
import WachlistSkeleton from '@/components/ui/skeletons/WatchlistSkeleton'

export default function WatchlistPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)
  const [watchlistItems, setWatchlistItems] = useState<Product[]>([])

  // useEffect(() => {
  //   api
  //     .get<Product[]>('/watchlist')
  //     .then((response) => setWatchlistItems(response.data))
  //     .catch((err) => {
  //       if (axios.isAxiosError(err)) {
  //         setError(
  //           'Something went wrong while loading your watchlist. Please try again.'
  //         )
  //       } else {
  //         setError('Something went wrong. Please try again.')
  //       }
  //     })
  //     .finally(() => setIsLoading(false))
  // }, [])
  useEffect(() => {
    setWatchlistItems(MOCK_PRODUCTS)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <WachlistSkeleton />
  }
  if (error) {
    return <SomethingWentWrong />
  }

  return (
    <main>
      <div className="flex flex-col gap-10">
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeIn' }}
        >
          <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl">
            <ScrambleText text="Watchlist" />
          </h1>
          <p className="text-muted-foreground">
            You are currently watching {watchlistItems.length} item
            {watchlistItems.length === 1 ? '' : 's'}
          </p>
        </motion.div>
        {watchlistItems.length === 0 ? (
          <div className="flex flex-col items-center mt-30 bg-card/40 py-20 rounded-2xl border border-dashed ">
            <div className="bg-card rounded-full flex size-20 items-center justify-center mb-4">
              <PackageOpen className="text-primary" size={50} />
            </div>
            <p className="text-foreground font-semibold text-2xl pb-2 mb-3 border-b ">
              You are not watching any products
            </p>
            <p className="text-muted-foreground text-sm mb-5">
              You have not watched any products. Browse products to get started
            </p>
            <Link
              to="/products"
              className={buttonVariants({ variant: 'default' })}
            >
              <SquareMousePointer size={18} />
              Browse Products
            </Link>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {watchlistItems.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
//TODO de-comment the api call for watchlist products
