import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { WatchButton } from '@/components/watchlist/WatchButton'
import api from '@/lib/api'
import { Product } from '@/lib/types'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft, PackageX, TriangleAlert } from 'lucide-react'
import { ProductDetailSkeleton } from '@/components/ui/ProductDetailSkeleton'
import { motion } from 'framer-motion'
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
  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data)
        setStatus('loaded')
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setStatus('notFound')
        } else {
          setStatus('error')
        }
      })
  }, [id])

  if (status === 'loading') return <ProductDetailSkeleton />
  if (status === 'notFound')
    return (
      <div className="flex flex-col items-center mt-30 bg-card/40 py-20 rounded-2xl border border-dashed ">
        <div className="bg-card rounded-full flex size-20 items-center justify-center mb-4">
          <PackageX className="text-primary" size={50} />
        </div>
        <p className="text-foreground font-semibold text-2xl pb-2 mb-3 border-b ">
          Product not found
        </p>
        <p className="text-muted-foreground text-sm mb-5">
          Try a different product or try later.
        </p>
        <Link to="/products" className={buttonVariants({ variant: 'default' })}>
          <ArrowLeft size={18} />
          Back to products
        </Link>
      </div>
    )
  if (status === 'error')
    return (
      <div className="flex flex-col items-center mt-30">
        <TriangleAlert className="text-zinc-700" size={100} strokeWidth="2.3" />
        <p className="text-foreground font-semibold text-2xl pb-2 mb-3 border-b ">
          Something went wrong
        </p>
        <p className="text-muted-foreground text-sm mb-5">Try again latter</p>
        <Link to="/products" className={buttonVariants({ variant: 'outline' })}>
          <ArrowLeft size={18} />
          Back to products
        </Link>
      </div>
    )
  return (
    <>
      {product && (
        <motion.div
          className="flex flex-col gap-12 sm:gap-20 mt-10 items-center"
          initial={{ opacity: 0, y: 300 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeIn' }}
        >
          <div className="flex flex-col gap-5">
            <div className="text-muted-foreground ">
              <Link
                to="/products"
                className={buttonVariants({ variant: 'outline' })}
              >
                <ArrowLeft size={18} />
                Back to products
              </Link>
            </div>
            <div className="flex flex-col md:flex-row gap-12 max-w-5xl">
              <div>
                <img
                  src={product.imageUrl}
                  alt={`product ${product.name}`}
                  className="aspect-square rounded-4xl object-cover w-full md:flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl border-2 border-border"
                />
              </div>
              <div className="flex flex-col gap-10 md:flex-1">
                <div className="flex gap-8 text-xs items-center">
                  <p className=" border border-[oklch(1_0_0_/0.09)] bg-none px-2 py-0.5 rounded-md font-medium ">
                    {deriveCategory(product.name)}
                  </p>
                  <span className="text-muted-foreground font-bold">
                    Provider
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h1 className="font-medium font-mono text-3xl">
                    {product.name}
                  </h1>
                  <p className="mt-10 text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="flex gap-5 items-center mt-5">
                    <p className="text-3xl font-mono">
                      £{getMockPrice(product.id)}
                    </p>
                    <span className="bg-primary/30 text-primary px-2 rounded-2xl font-sans">
                      -10%
                    </span>
                  </div>
                  <WatchButton productId={product.id} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex  flex-col align-center w-full p-6 sm:p-10 h-100 rounded-4xl border border-border bg-[oklch(0.155_0.006_264)]">
            <div className="flex flex-wrap gap-5 ">
              <h2>Price history</h2>
              <span>Lowest: 590</span>
              <span>Average: 850</span>
              <span>Highest: 1000</span>
            </div>
            <p className="text-muted-foreground">coming soon</p>
          </div>
        </motion.div>
      )}
    </>
  )
}
