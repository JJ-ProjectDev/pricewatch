import Navbar from './Navbar'

import { Outlet } from 'react-router-dom'
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="px-4 md:px-6 lg:px-50 py-10">
        <Outlet />
      </main>
    </>
  )
}
