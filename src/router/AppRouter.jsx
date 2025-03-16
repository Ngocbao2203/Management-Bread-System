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
import ProductList from "../pages/dashboard/ProductList";
import AddProduct from "../pages/dashboard/AddProduct";
import EditProduct from "../pages/dashboard/EditProduct";
import Categories from "../pages/dashboard/Categories";
import Ingredients from "../pages/dashboard/Ingredients";

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

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} /> {/* /dashboard */}
          <Route path="products" element={<ProductList />} /> {/* /dashboard/products */}
          <Route path="add-product" element={<AddProduct />} /> {/* /dashboard/add-product */}
          <Route path="edit-product/:id" element={<EditProduct />} /> {/* /dashboard/edit-product/:id */}
          <Route path="categories" element={<Categories />} /> {/* /dashboard/categories */}
          <Route path="ingredients" element={<Ingredients />} /> {/* /dashboard/ingredients */}
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AppRouter;