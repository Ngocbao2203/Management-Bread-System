import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser, faArrowRight, faSpinner, faPhone } from "@fortawesome/free-solid-svg-icons";
import breadLogo from "../../assets/images/bread-logo.png";
import { register } from "../../services/authService";
import "../../styles/Register.css";
import { toast } from "react-toastify"; // Chỉ import toast, vì ToastContainer đã ở App.js

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNo: "",
    city: "",
    district: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chỉ kiểm tra các trường bắt buộc: fullName, userName, email, password, confirmPassword
    if (!formData.fullName || !formData.userName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please check your input!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    const data = {
      fullName: formData.fullName,
      username: formData.userName,
      email: formData.email,
      password: formData.password,
      city: formData.city || "", // Cho phép rỗng
      district: formData.district || "", // Cho phép rỗng
      phoneNo: formData.phoneNo || "", // Cho phép rỗng
    };

    setIsLoading(true);
    try {
      const response = await register(data);
      console.log("API Response:", response.data);
      toast.success(response.data?.message || "Registered Successfully!"); // Hiển thị toast
      navigate("/login"); // Điều hướng ngay lập tức
    } catch (error) {
      const responseData = error.response?.data || {};
      console.log("Server response:", responseData);
      if (responseData.ErrorMessage === "Email is already existed") {
        toast.error("This email is already registered. Please use a different email!");
      } else {
        toast.error(responseData.ErrorMessage || "An error occurred while registering!");
      }
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <motion.div
      className="register-container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <div className="register-logo">
        <div className="register-circle" onClick={handleLogoClick}>
          <img src={breadLogo} alt="Bread Logo" />
        </div>
      </div>
      <div className="register-form-wrapper">
        <h2>Sign Up To Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              name="city"
              placeholder="City (Optional)"
              value={formData.city}
              onChange={handleChange} // Không cần required
            />
          </div>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              name="district"
              placeholder="District (Optional)"
              value={formData.district}
              onChange={handleChange} // Không cần required
            />
          </div>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faPhone} className="input-icon" />
            <input
              type="tel"
              name="phoneNo"
              placeholder="Phone Number (Optional)"
              value={formData.phoneNo}
              onChange={handleChange} // Không cần required
            />
          </div>
          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Registering...
              </>
            ) : (
              <>
                Register <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
              </>
            )}
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="link">
            Sign In
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;