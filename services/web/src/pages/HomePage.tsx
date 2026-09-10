import { Link } from 'react-router-dom'

import { MOCK_PRODUCTS } from '@/lib/data/mockData'
import getCategory from '@/lib/utils/getCategory'
import { getMockPrice } from '@/lib/utils/getPrices'
import { ArrowDown, Search, ChartLine, BellRing } from 'lucide-react'
import { motion } from 'framer-motion'
import { FaEbay, FaAmazon } from 'react-icons/fa'
const fakeProd = MOCK_PRODUCTS[0]

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col justify-center items-center align-middle w-full mt-10 gap-40"
    >
      <div className="flex gap-30 items-center">
        <motion.div
          className="max-w-lg flex flex-col gap-5"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1 className="text-6xl font-medium">
            Watch prices.
            <br />
            Buy at the right moment.
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Add the products you want, and we'll tell you the moment their price
            is actually worth acting on.
          </p>
          <div className="flex gap-5 items-center align-middle">
            <Link
              to="/products"
              className="bg-primary px-3 py-2 rounded-lg hover:bg-primary/70"
            >
              Start tracking
            </Link>
            <Link
              to="/products"
              className="px-3 py-2 rounded-lg bg-card/50 border hover:bg-card/90"
            >
              Browse products
            </Link>
          </div>
        </motion.div>
        {/* card  */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="flex flex-col align-middle justify-center bg-card py-7 px-5 rounded-xl gap-5 max-w-sm ml-auto border-2 border-border">
            <div className="flex justify-between items-center ">
              <span className="text-sm border rounded-md px-2 flex items-center">
                {getCategory(fakeProd.name)}
              </span>
              <div className="flex align-middle items-center gap-1">
                <span className="bg-primary rounded-full h-1.5 w-1.5"></span>
                <p className="text-sm text-muted-foreground">Watching</p>
              </div>
            </div>
            <div>
              <img
                src={fakeProd.imageUrl}
                alt={fakeProd.name}
                className="object-cover w-full rounded-lg aspect-4/3"
              />
            </div>
            <div>
              <div className="flex flex-col gap-1.5">
                <h2 className="font-mono text-xl">{fakeProd.name}</h2>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {fakeProd.description}
                </p>
              </div>
            </div>
            <div className="flex justify-between align-middle items-center">
              <p className="text-3xl font-mono">£{getMockPrice(fakeProd.id)}</p>
              <div>
                <span className="flex align-middle items-center text-xs gap-1 bg-primary/20 px-2 rounded-xl text-primary py-0.5">
                  <ArrowDown size={14} />
                  £100 drop
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* retailers */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h3 className="text-muted-foreground">
          Prices tracked from retailers like:
        </h3>
        <span className="bg-muted-foreground h-px w-xs"></span>
        <div className="flex gap-14 text-muted-foreground mt-5">
          <FaAmazon size={40} />
          <FaEbay size={40} />
        </div>
      </motion.div>
      {/* steps */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex flex-col justify-center items-center gap-20"
      >
        <h3 className="text-4xl font-medium">How it works</h3>
        <div className="flex gap-5">
          {/* little card */}
          <div className="relative">
            <p className="absolute -top-30 left-20 text-[230px] font-bold text-muted-foreground/10 -z-10">
              1
            </p>
            <div className="flex flex-col max-w-xs ">
              <div className="flex flex-col items-center gap-3">
                <Search size={35} className="text-primary" />
                <div>
                  <p className="text-end font-medium">
                    Add what you're watching
                  </p>
                  <p className="text-xs text-end max-w-3xs text-muted-foreground">
                    Search for the exact GPU, laptop or phone you're waiting to
                    buy, from retailers you already shop.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <span className="bg-muted-foreground w-px"></span>
          <div className="relative">
            <p className="absolute -top-30 left-15 text-[230px] font-bold text-muted-foreground/10 -z-10">
              2
            </p>
            <div className="flex flex-col max-w-xs ">
              <div className="flex flex-col items-center gap-3">
                <ChartLine size={35} className="text-primary" />
                <div>
                  <p className="text-center font-medium">We track the price</p>
                  <p className="text-xs text-center max-w-3xs text-muted-foreground">
                    Pricewatch checks in regularly and builds a history, so you
                    can see exactly how the price has moved.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <span className="bg-muted-foreground w-px"></span>
          <div className="relative">
            <p className="absolute -top-30 left-15 text-[230px] font-bold text-muted-foreground/10 -z-10">
              3
            </p>
            <div className="flex flex-col max-w-xs ">
              <div className="flex flex-col items-center gap-3">
                <BellRing size={35} className="text-primary" />
                <div>
                  <p className="text-start font-medium">
                    Get notified at the right moment
                  </p>
                  <p className="text-xs text-start max-w-3xs text-muted-foreground">
                    The moment a price drops to a level worth acting on, you’ll
                    know — no more checking manually.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* last card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="bg-card border-2 border-border rounded-3xl flex flex-col justify-center items-center px-40 py-20 gap-5">
          <h4 className="text-xl">Stop refreshing product pages</h4>
          <p className="text-muted-foreground">
            Create a free account and start tracking your first product in under
            a minute.
          </p>
          <Link
            to="/register"
            className="bg-primary px-3 py-2 rounded-lg hover:bg-primary/70"
          >
            Create free account
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
