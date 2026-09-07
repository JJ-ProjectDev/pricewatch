import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { buttonVariants, Button } from '../ui/button'
import { TrendingDown, LogOut } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Transition } from 'framer-motion'

const guestVariants = {
  initial: { y: 12, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 12, opacity: 0 }
}

const authVariants = {
  initial: { y: -12, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -12, opacity: 0 }
}

const navTransition: Transition = { duration: 0.5, ease: 'easeInOut' }

export default function Navbar() {
  const [error, setError] = useState<null | string>(null)
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      setError('An error occured while logging out, please try again')
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto max-w-6xl px-4 grid grid-cols-3 items-center h-16">
        <Link className="flex gap-2 justify-self-start items-center" to="/">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary">
            <TrendingDown className="size-5 text-black" />
          </span>
          <span className="hidden sm:inline font-mono font-medium text-primary-foreground">
            PriceWatch
          </span>
        </Link>

        <div className="relative justify-self-center w-full h-full flex items-center">
          <AnimatePresence>
            {!isLoading && isAuthenticated && (
              <motion.div
                key="center-links"
                className="absolute left-1/2 -translate-x-1/2 flex gap-4 font-medium text-sm text-foreground"
                variants={authVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={navTransition}
              >
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `transition-[text-shadow,color] hover:[text-shadow:0_0_4px_color-mix(in_oklch,var(--color-foreground)_40%,transparent)]${
                      isActive
                        ? 'text-foreground [text-shadow:0_0_4px_color-mix(in_oklch,var(--color-foreground)_40%,transparent)]'
                        : 'text-muted-foreground'
                    }`
                  }
                >
                  Products
                </NavLink>
                <NavLink
                  to="/watchlist"
                  className={({ isActive }) =>
                    `transition-[text-shadow,color] hover:[text-shadow:0_0_4px_color-mix(in_oklch,var(--color-foreground)_40%,transparent)] ${
                      isActive
                        ? 'text-foreground [text-shadow:0_0_4px_color-mix(in_oklch,var(--color-foreground)_40%,transparent)]'
                        : 'text-muted-foreground'
                    }`
                  }
                >
                  Watchlist
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative justify-self-end w-full h-full flex items-center">
          <AnimatePresence>
            {isLoading ? null : isAuthenticated ? (
              <motion.div
                key="right-user"
                className="absolute right-0 flex gap-4 items-center"
                variants={authVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={navTransition}
              >
                <p className="hidden text-muted-foreground text-sm sm:inline">
                  Welcome {user?.displayName}
                </p>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="rounded-full p-2 border-2 border-accent sm:rounded-md sm:px-3 sm:py-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Log out</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="guest-links"
                className="absolute right-0 flex items-center gap-2"
                variants={guestVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={navTransition}
              >
                <Link
                  to="/register"
                  className={buttonVariants({ variant: 'ghost' })}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className={buttonVariants({ variant: 'default' })}
                >
                  Sign In
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  )
}
