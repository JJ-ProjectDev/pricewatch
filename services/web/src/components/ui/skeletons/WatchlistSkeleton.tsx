import { ProductCardSkeleton, SkeletonBlock } from './ProductCardSkeleton'

export default function WachlistSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SkeletonBlock className="h-20 w-full max-w-100" />
        <SkeletonBlock className="h-4 w-full max-w-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
