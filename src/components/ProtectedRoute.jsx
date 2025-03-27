/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Hàm giải mã token và kiểm tra hết hạn
const decodeToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      console.log("Token expired");
      localStorage.removeItem("token");
      return null; // Token hết hạn
    }

    return decodedToken;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return null; // Token không hợp lệ
  }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  // Kiểm tra token
  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Giải mã token và kiểm tra hết hạn
  const decodedToken = decodeToken(token);
  if (!decodedToken) {
    console.log("Invalid or expired token, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Lấy role từ token
  const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User";
  console.log("Decoded role:", role);

  // Kiểm tra role
  if (!allowedRoles.includes(role)) {
    console.log("Role not allowed, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // Trả về children thay vì Outlet
  return children;
};

export default ProtectedRoute;