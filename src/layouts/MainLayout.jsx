import React, { useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const MainLayout = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext); // Lấy trạng thái chế độ từ Context

  return (
    <div className={`layout-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default MainLayout;