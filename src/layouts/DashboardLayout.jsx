import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/DashboardLayout.css";

const pathToMenuMap = {
  "/dashboard": "Dashboard",
  "/dashboard/products": "Danh sách sản phẩm",
  "/dashboard/add-product": "Thêm sản phẩm",
  "/dashboard/edit-product/:id": "Chỉnh sửa sản phẩm",
  "/dashboard/categories": "Categories",
  "/dashboard/ingredients": "Ingredients",
};

const DashboardLayout = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard"); // Mặc định là "Dashboard"
  const location = useLocation();

  console.log("DashboardLayout rendered, location:", location.pathname);

  useEffect(() => {
    const currentPath = location.pathname;
    const menuName = pathToMenuMap[currentPath] || "Dashboard";
    console.log("Updating selectedMenu:", menuName);
    setSelectedMenu(menuName);
  }, [location]);

  return (
    <div className="dashboard-layout">
      <Sidebar setSelectedMenu={setSelectedMenu} selectedMenu={selectedMenu} />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;