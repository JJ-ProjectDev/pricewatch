import { Product } from '@/lib/types'
import { Cpu, Laptop, Smartphone } from 'lucide-react'
import { JSX } from 'react/jsx-runtime'
import { Card, CardDescription, CardFooter, CardHeader } from './card'
import { WatchButton } from '../watchlist/WatchButton'
import { motion } from 'framer-motion'

// simple substring match; good enough for known mock data, revisit if real product names get added
export function deriveCategory(
  name: string
): 'Graphics Card' | 'Phone' | 'Laptop' {
  const t = name.toLocaleLowerCase()

  if (['gpu', 'rtx', 'rx'].some((kw) => t.includes(kw))) {
    return 'Graphics Card'
  }
  if (['book', 'pro', 'air', 'slim'].some((kw) => t.includes(kw))) {
    return 'Laptop'
  }
  return 'Phone'
}

// mock price until backend returns a real price field
const PRICES = [49, 99, 149, 249, 399, 599, 899, 1299, 1999]
export function getMockPrice(productId: string): number {
  let hash = 0

  for (let i = 0; i < productId.length; i++) {
    hash = hash * 31 + productId.charCodeAt(i)
  }
  const index = Math.abs(hash) % PRICES.length
  return PRICES[index]
}

const CATEGORY_ICONS = {
  'Graphics Card': Cpu,
  Laptop: Laptop,
  Phone: Smartphone
}
const MotionCard = motion(Card)
export default function ProductCard({
  product
}: {
  product: Product
}): JSX.Element {
  return (
    <MotionCard
      className="p-4 border gap-4"
      style={{ borderColor: '#27272a' }}
      whileHover={{
        y: -7,
        borderColor: '#10b981',
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)'
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="overflow-hidden relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full rounded-lg aspect-4/3 "
        />
        <span className="absolute top-2 left-2 z-10 bg-card/85 px-2 py-0.5 rounded-md border border-border/70 ">
          {deriveCategory(product.name)}
        </span>
      </div>
      <CardHeader className=" flex justify-between font-mono p-0">
        <h2 className="font-mono text-base font-medium text-foreground">
          {product.name}
        </h2>
        <p className="text-gray-500">Retailer</p>
      </CardHeader>
      <CardDescription className="line-clamp-2">
        {product.description}
      </CardDescription>
      <CardFooter className="mb-4 flex justify-between items-center">
        <div className="flex flex-col gap-2 font-mono">
          <p className="text-xl">£{getMockPrice(product.id)}</p>
          <span className="bg-primary/30 text-primary px-2 rounded-2xl">
            {' '}
            -10%
          </span>
        </div>
        <WatchButton productId={product.id} />
      </CardFooter>
    </MotionCard>
  )
}
