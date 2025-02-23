import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/ResetPassword.css"; 

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // Lấy token từ URL

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp!");
            return;
        }

        try {
            const response = await fetch("/api/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, password }),
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                setError("Token không hợp lệ hoặc đã hết hạn.");
            }
        } catch (error) {
            setError("Đã xảy ra lỗi. Vui lòng thử lại!");
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
                <h2>Mật khẩu đã được đặt lại thành công! <a href="/login">Đăng nhập</a></h2>
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
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleResetPassword}>
                <div className="input-wrapper">
                    <span className="input-icon">🔒</span> {/* Lock icon for password */}
                    <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-wrapper">
                    <span className="input-icon">🔒</span> {/* Lock icon for confirm password */}
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Đặt lại mật khẩu</button>
            </form>
        </motion.div>
    );
}

export default ResetPassword;