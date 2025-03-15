import { useContext } from "react";
import PropTypes from 'prop-types'; // Import PropTypes
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const MainLayout = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`layout-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};
// Xác thực props
MainLayout.propTypes = {
  children: PropTypes.node.isRequired, // children phải là một React node và bắt buộc phải có
};

export default MainLayout;