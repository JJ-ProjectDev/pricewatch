import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className='flex justify-around h-10 items-center '>
      <Link to="/">PriceWatch</Link>
      <Link to="/products">Products</Link>
    </nav>
  )
}
