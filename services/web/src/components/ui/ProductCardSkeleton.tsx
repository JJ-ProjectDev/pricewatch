import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded bg-accent', className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="p-4 border border-border rounded-xl bg-card flex flex-col gap-4">
      <SkeletonBlock className="w-full aspect-4/3 rounded-lg" />
      <div className="flex justify-between items-center">
        <SkeletonBlock className="h-5 w-32" />
        <SkeletonBlock className="h-4 w-16" />
      </div>
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-6 w-16" />
          <SkeletonBlock className="h-5 w-12" />
        </div>
        <SkeletonBlock className="h-8 w-20 rounded-md" />
      </div>
    </div>
  )
}