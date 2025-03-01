import { Link } from "react-router-dom";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import breadLogo from "../assets/images/bread-logo.png";
import { Link as ScrollLink } from "react-scroll";
import ThemeToggle from "../components/common/ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    const navigate = useNavigate();
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
                        <Link to="/combo">Combo</Link>
                    </li>
                    <li>
                        <ScrollLink
                            to="contact-section"
                            smooth={true}
                            duration={500}
                            style={{ cursor: "pointer" }}
                        >
                            Contact
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
                <Link to="/login" className="sign-in-btn">
                    Sign In
                </Link>
            </div>
        </header>
    );
};

export default Header;