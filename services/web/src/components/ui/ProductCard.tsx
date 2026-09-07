import { Product } from '@/lib/types'
import { Cpu, Laptop, Smartphone } from 'lucide-react'
import { JSX } from 'react/jsx-runtime'

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
export default function ProductCard({
  product
}: {
  product: Product
}): JSX.Element {
  return <></>
}
