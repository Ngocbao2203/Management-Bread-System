import { Link } from "react-router-dom";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom"; // Chỉ import useNavigate từ react-router-dom
import { useEffect, useState } from "react"; // Import useEffect và useState từ react
import breadLogo from "../assets/images/bread-logo.png";
import { Link as ScrollLink } from "react-scroll";
import ThemeToggle from "../components/common/ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import UserAvatar from "../components/UserAvatar"; 

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Nếu có token, isLoggedIn = true
  }, []);

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo">
        <img src={breadLogo} alt="Bread Logo" className="logo-img" />
      </Link>

      {/* Navigation Menu (Centered) */}
      <nav className="nav">
        <ul className="nav-menu">
          <li>
            <Link to="/">Trang Chủ</Link>
          </li>
          <li>
            <ScrollLink
              to="about-section"
              smooth={true}
              duration={500}
              style={{ cursor: "pointer" }}
            >
              Giới thiệu
            </ScrollLink>
          </li>
          <li>
            <ScrollLink
              to="product-section"
              smooth={true}
              duration={500}
              style={{ cursor: "pointer" }}
            >
              Sản phẩm
            </ScrollLink>
          </li>
          <li>
            <Link to="/dashboard">Combo</Link>
          </li>
          <li>
            <ScrollLink
              to="contact-section"
              smooth={true}
              duration={500}
              style={{ cursor: "pointer" }}
            >
              Liên hệ
            </ScrollLink>
          </li>
        </ul>
      </nav>

      {/* Right Section (Sign In, Shopping Cart, and Theme Toggle) */}
      <div className="header-actions">
        <FontAwesomeIcon
          icon={faShoppingCart}
          size="lg"
          color="#d2a679"
          className="shopping-cart-icon"
          onClick={() => navigate("/cart")}
        />
        <nav className="theme-toggle">
          <ThemeToggle />
        </nav>
        {isLoggedIn ? (
          <UserAvatar /> // Hiển thị UserAvatar khi đã đăng nhập
        ) : (
          <Link to="/login" className="sign-in-btn">
            Sign In
          </Link> // Hiển thị Sign In khi chưa đăng nhập
        )}
      </div>
    </header>
  );
};

export default Header;