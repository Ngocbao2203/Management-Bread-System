import { useLocation } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from '../pages/authentication/Login'
import Register from '../pages/authentication/Register'
import ForgotPassword from '../pages/authentication/ForgotPassword'
import ResetPassword from '../pages/authentication/ResetPassword'
import HomePage from '../components/homepage/HomePage'
import DashboardLayout from '../layouts/DashboardLayout'
import OwnerLayout from '../layouts/OwnerLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import các component liên quan đến sản phẩm
import DashboardHome from '../pages/dashboard/DashboardHome'
import Products from '../pages/dashboard/Products'
import Categories from '../pages/dashboard/Categories'
import Ingredients from '../pages/dashboard/Ingredients'
import Accounts from '../pages/dashboard/Accounts'
import Branchs from '../pages/dashboard/Branchs'
import ProductListCustomer from '../pages/products/ProductListCustomer'
import ProductDetail from '../pages/products/ProductDetail'
import ComboListCustomer from '../pages/combo/ComboListCustomer'
import ComboDetail from '../pages/combo/ComboDetail'
import ComboPage from '../pages/dashboard/Combos/ComboPage'
import CartPage from '../pages/order/CartPage';
import CheckoutPage from '../pages/order/CheckoutPage';
// Import các component liên quan đến Owner
import Profile from '../pages/owner/Profile'
import StaffManagement from '../pages/owner/StaffManagement'
import OwnerDashboard from '../pages/owner/OwnerDashboard'

const AppRouter = () => {
  const location = useLocation(); // Lấy thông tin location

  return (
    <AnimatePresence>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes key={location.pathname} location={location}>  {/* Thêm key vào Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/products_list" element={<ProductListCustomer />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route>
          <Route path="/combo" element={<ComboListCustomer />} />
          <Route path="/combo/:id" element={<ComboDetail />} />
        </Route>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} /> {/* /dashboard */}
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="ingredients" element={<Ingredients />} />
          <Route path="branchs" element={<Branchs />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="combos" element={<ComboPage />} />
        </Route>

        {/* Owner Routes */}
        <Route
          path="/owner/*"
          element={
            <ProtectedRoute allowedRoles={['Owner']}>
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OwnerDashboard />} />{' '}
          {/* /owner/profile */}
          <Route path="profile" element={<Profile />} /> {/* /owner/profile */}
          <Route path="staff" element={<StaffManagement />} />{' '}
          {/* /owner/staff */}
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default AppRouter;
