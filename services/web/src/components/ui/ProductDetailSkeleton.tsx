import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { SkeletonBlock } from './ProductCardSkeleton'
import { buttonVariants } from './button'

export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-5 mt-10">
      <div className="text-muted-foreground">
        <Link to="/products" className={buttonVariants({ variant: 'outline' })}>
          <ArrowLeft size={18} />
          Back to products
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-12">
        <SkeletonBlock className="aspect-square rounded-4xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl w-full" />
        <div className="flex flex-col gap-10 max-w-xl w-full">
          <div className="flex gap-8">
            <SkeletonBlock className="h-6 w-20 rounded-md" />
            <SkeletonBlock className="h-6 w-20 rounded-md" />
          </div>
          <div className="flex flex-col gap-3">
            <SkeletonBlock className="h-10 w-2/3" />
            <div className="flex flex-col gap-2 mt-4">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
            <div className="flex gap-5 items-center mt-5">
              <SkeletonBlock className="h-8 w-24" />
              <SkeletonBlock className="h-6 w-14 rounded-2xl" />
            </div>
            <SkeletonBlock className="h-9 w-24 rounded-md mt-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
