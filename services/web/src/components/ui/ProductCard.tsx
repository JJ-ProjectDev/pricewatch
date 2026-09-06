import { Product } from '@/lib/types'

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

export default function ProductCard({ product }: { product: Product }) {
  return
}
