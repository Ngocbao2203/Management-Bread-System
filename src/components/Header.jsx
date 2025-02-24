import { Link } from "react-router-dom";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import breadLogo from "../assets/images/bread-logo.png";
import { Link as ScrollLink } from "react-scroll";
import ThemeToggle from "../components/common/ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    const navigate = useNavigate(); // Sử dụng hook navigate
    return (
        <header className="header">
            {/* Logo */}
            <Link to="/" className="logo">
                <img src={breadLogo} alt="Bread Logo" className="logo-img" />
            </Link>

            {/* Navigation Menu */}
            <nav className="nav">
                <ul className="nav-menu">
                    <li>
                        <ScrollLink
                            to="about-section"
                            smooth={true}
                            duration={500}
                            style={{ cursor: "pointer" }} // Thêm kiểu trực tiếp
                        >
                            Giới thiệu
                        </ScrollLink>
                    </li>
                    <li>
                        <ScrollLink
                            to="product-section"
                            smooth={true}
                            duration={500}
                            style={{ cursor: "pointer" }} // Thêm kiểu trực tiếp>
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
                            style={{ cursor: "pointer" }} // Thêm kiểu trực tiếp
                        >Contact
                        </ScrollLink>
                    </li>
                </ul>
            </nav>
            <nav className="theme-toggle">
                <ThemeToggle />
            </nav>
            <FontAwesomeIcon
                icon={faShoppingCart}
                size="lg"
                color="#646cff"
                className="shopping-cart-icon" // Add a class for CSS styling
                onClick={() => navigate("/cart")}
            />
            {/* Sign In Button */}
            <Link to="/login" className="sign-in-btn">
                Sign In
            </Link>
        </header>
    );
};

export default Header;