import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "../../styles/ResetPassword.css";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Kiểm tra email và otp từ query string
    if (!email || !otp) {
      toast.error("Thiếu thông tin email hoặc OTP!");
      setLoading(false);
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      setLoading(false);
      return;
    }

    try {
      const responseData = await resetPassword(email, otp, password);
      console.log("Reset password response:", responseData);

      if (responseData.statusCode === 200) {
        setSuccess(true);
        toast.success("Mật khẩu đã được đặt lại thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error("Không thể đặt lại mật khẩu!");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        className="reset-password-container"
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <h2>
          Mật khẩu đã được đặt lại thành công! <a href="/login">Đăng nhập</a>
        </h2>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="reset-password-container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleResetPassword}>
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </motion.div>
  );
}

export default ResetPassword;