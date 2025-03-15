import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/UserAvatar.css";

const UserAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // Dùng để điều hướng

  // Lấy thông tin từ localStorage
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const userName = localStorage.getItem("userName");

  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  const isLoggedIn = !!token;

  const user = {
    name: userName || "Unknown User",
    email: email || "No Email",
    initials: email?.match(/[a-zA-Z]/g)?.slice(0, 2).join("").toUpperCase() || "U",
  };

  const handleLogout = () => {
    // Xóa tất cả dữ liệu trong localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("userData"); // Nếu có

    // Điều hướng về login
    navigate("/login", { replace: true });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Xử lý click bên ngoài dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Kiểm tra token khi component mount
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isLoggedIn, navigate]);

  // Nếu không đăng nhập, không hiển thị UserAvatar
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="user-avatar" ref={dropdownRef}>
      <div className="avatar-initials" onClick={toggleDropdown}>
        {user.initials}
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {/* Phần Tài khoản */}
          <div className="dropdown-section account-section">
            <h3>TÀI KHOẢN</h3>
            <div className="user-info">
              <div className="avatar-initials">{user.initials}</div>
              <div className="user-details">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Phần Break */}
          <div className="dropdown-section">
            <h3>Break</h3>
            <Link to="/profile">Hồ sơ và Hiện thị</Link>
            <Link to="/activity">Hoạt động</Link>
            <Link to="/settings">Cài đặt</Link>
            <Link to="/theme">Chủ đề</Link>
          </div>

          {/* Phần Trợ giúp và Đăng xuất */}
          <div className="dropdown-section">
            <Link to="/help">Trợ giúp</Link>
            <Link to="/shortcuts">Phím tắt</Link>
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