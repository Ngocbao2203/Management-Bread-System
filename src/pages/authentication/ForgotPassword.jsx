import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "../../styles/ForgotPassword.css";
import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (step === "email") {
        const responseData = await forgotPassword(email);
        console.log("Response from forgot-password:", responseData);

        if (responseData.statusCode !== 200) {
          throw new Error("Không thể gửi OTP. Vui lòng thử lại!");
        }

        toast.success("Mã OTP đã được gửi đến email của bạn!");
        setStep("otp");
      } else if (step === "otp") {
        toast.success("Chuyển đến trang đặt lại mật khẩu...");
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Forgot password/OTP error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="forgot-password-container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <h2>Forgot Password</h2>
      {step === "email" ? (
        <p>Enter your email to receive a reset OTP</p>
      ) : (
        <p>Enter the OTP sent to your email</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <span className="input-icon">✉️</span>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || step === "otp"}
          />
        </div>
        {step === "otp" && (
          <div className="input-wrapper">
            <span className="input-icon">🔑</span>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading
            ? "Processing..."
            : step === "email"
            ? "Send OTP"
            : "Verify OTP and Reset"}
        </button>
      </form>
      <button onClick={() => navigate("/login")} disabled={loading}>
        Back to Login
      </button>
    </motion.div>
  );
};

export default ForgotPassword;