import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import "../styles/UserAvatar.css";

const UserAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Log để kiểm tra cấu trúc
        const userData = {
          name: decodedToken.name || "Người dùng", // Thay "name" bằng key thực tế
          email: decodedToken.email || "email@example.com", // Thay "email" bằng key thực tế
          initials: getInitials(decodedToken.name || "Người dùng"),
        };
        setUser(userData);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const getInitials = (name) => {
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-avatar">
      <div className="avatar-initials" onClick={toggleDropdown}>
        {user.initials}
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-section account-section">
            <h3>TÀI KHOẢN</h3>
            <div className="user-info">
              <div className="avatar-initials">{user.initials}</div>
              <div className="user-details">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
            <Link to="/manage-account">Quản lý tài khoản</Link>
          </div>

          <div className="dropdown-section">
            <h3>Bread</h3>
            <Link to="/profile">Hồ sơ và Hiện thị</Link>
            <Link to="/activity">Hoạt động</Link>
            <Link to="/settings">Cài đặt</Link>
          </div>

          <div className="dropdown-section">
            <Link to="/help">Trợ giúp</Link>
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;