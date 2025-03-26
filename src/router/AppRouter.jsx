import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import ResetPassword from "../pages/authentication/ResetPassword";
import HomePage from "../components/homepage/HomePage";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import các component liên quan đến sản phẩm
import DashboardHome from "../pages/dashboard/DashboardHome";
import Products from "../pages/dashboard/Products";
import Categories from "../pages/dashboard/Categories";
import Ingredients from "../pages/dashboard/Ingredients";
import Accounts from "../pages/dashboard/Accounts";
import Branchs from "../pages/dashboard/Branchs";
import ProductListCustomer from "../pages/products/ProductListCustomer";
import ProductDetail from "../pages/products/ProductDetail";
import ComboListCustomer from "../pages/combo/ComboListCustomer";
import ComboDetail from "../pages/combo/ComboDetail";
const AppRouter = () => {
  return (
    <AnimatePresence mode="wait">
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
      <Routes>
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
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} /> {/* /dashboard */}
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} /> {/* /dashboard/categories */}
          <Route path="ingredients" element={<Ingredients />} /> {/* /dashboard/ingredients */}
          <Route path="branchs" element={<Branchs />} /> 
          <Route path="accounts" element={<Accounts />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AppRouter;