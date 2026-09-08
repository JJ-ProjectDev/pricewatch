import { Product } from '@/lib/types'

import { Card, CardDescription, CardFooter, CardHeader } from './card'
import { WatchButton } from '../watchlist/WatchButton'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cpu, Smartphone, Laptop } from 'lucide-react'

// simple substring match; good enough for known mock data, revisit if real product names get added
import deriveCategory from '@/lib/utils/getCategory'

// mock price until backend returns a real price field
import { getMockPrice } from '@/lib/utils/getPrices'

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
}
const CATEGORY_ICONS = {
  'Graphics Card': Cpu,
  Laptop: Laptop,
  Phone: Smartphone
}
const MotionCard = motion(Card)
export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()
  const [isExiting, setIsExiting] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  const Icon = CATEGORY_ICONS[deriveCategory(product.name)]

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    setIsExiting(true)
  }
  return (
    <motion.div
      animate={isExiting ? { y: -400, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeIn' }}
      onAnimationComplete={() => {
        if (isExiting) navigate(`/products/${product.id}`)
      }}
    >
      <Link to={`/products/${product.id}`} onClick={handleClick}>
        <MotionCard
          variants={itemVariants}
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
            {imgFailed ? (
              <div className="w-full aspect-4/3 flex items-center justify-center bg-accent rounded-lg ">
                <Icon className="w-10 h-10 text-muted-foreground" />
              </div>
            ) : (
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={() => setImgFailed(true)}
                className="object-cover w-full rounded-lg aspect-4/3"
              />
            )}
            <span className="absolute top-2 left-2 z-10 bg-card/85 px-2 py-0.5 rounded-md border border-border/70">
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
      </Link>
    </motion.div>
  )
}
