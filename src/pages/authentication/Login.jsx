import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import googleLogo from "../../assets/images/g-logo.png";
import breadLogo from "../../assets/images/bread-logo.png";
import "../../styles/Login.css";
import { login } from "../../services/authService"; // Import hàm login từ apiService
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { email, password };
      const responseData = await login(data);
      console.log("Response data from API:", responseData); // Debug

      // Sửa lại: Lấy token từ responseData.data.token
      const token = responseData.data.token;
      if (!token || typeof token !== "string") {
        throw new Error("Token không hợp lệ hoặc không tồn tại!");
      }

      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken); // Debug
      const role = decodedToken.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Đăng nhập thành công!");
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google clicked");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <div className="login-logo">
        <div className="login-circle" onClick={handleLogoClick}>
          <img src={breadLogo} alt="Bread Logo" />
        </div>
      </div>
      <div className="login-form-wrapper">
        <h2>Sign In To Your Account.</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="options-container">
            <div className="remember-container">
              <input type="checkbox" id="remember" disabled={loading} />
              <label htmlFor="remember">Remember For 30 Days</label>
            </div>
            <Link
              to="/forgot-password"
              className="forgot-password"
              style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.5 : 1 }}
            >
              Forgot Password
            </Link>
          </div>
          <div className="login-button">
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"} <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
            </button>
          </div>
        </form>

        <p>
          Don’t have an account?{" "}
          <span
            onClick={() => !loading && navigate("/register")}
            className="link"
            style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.5 : 1 }}
          >
            Sign Up
          </span>
        </p>

        <div className="divider">OR</div>
        <button className="google-login-btn" onClick={handleGoogleLogin} disabled={loading}>
          <img src={googleLogo} alt="Google Logo" className="google-logo" />
          Sign In With Google
        </button>
      </div>
    </motion.div>
  );
};

export default Login;