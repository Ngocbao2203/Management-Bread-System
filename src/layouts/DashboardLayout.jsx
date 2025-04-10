import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import '../styles/DashboardLayout.css'

const pathToMenuMap = {
  '/dashboard': 'Dashboard',
  '/dashboard/products': 'Products',
  '/dashboard/orders': 'Orders',
  '/dashboard/combos': 'Combos',
  '/dashboard/categories': 'Categories',
  '/dashboard/ingredients': 'Ingredients',
  '/dashboard/branchs': 'Branchs',
  '/dashboard/accounts': 'Accounts',
}

const DashboardLayout = () => {
  const [selectedMenu, setSelectedMenu] = useState('Dashboard') // Mặc định là "Dashboard"
  const location = useLocation()

  console.log('DashboardLayout rendered, location:', location.pathname)

  useEffect(() => {
    const currentPath = location.pathname
    const menuName = pathToMenuMap[currentPath] || 'Dashboard'
    console.log('Updating selectedMenu:', menuName)
    setSelectedMenu(menuName)
  }, [location])

  return (
    <div className="dashboard-layout">
      <Sidebar setSelectedMenu={setSelectedMenu} selectedMenu={selectedMenu} />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
