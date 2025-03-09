import apiClient from "./apiClient";

export const login = async (data) => {
  try {
    const response = await apiClient.post(`/api/auth/login`, data);
    return response.data; // Chỉ trả về dữ liệu từ API
  } catch (error) {
    console.error("Error during login:", error);
    const errorMessage = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!";
    throw new Error(errorMessage);
  }
};
export const register = async (data) => {
  try {
    const response = await apiClient.post(`/api/auth/register`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    if (error.response && error.response.data) {
      console.log("Server response:", error.response.data);
    }
    throw error;
  }
}
export const forgotPassword = async (email) => {
  try {
    // Gửi email qua query string thay vì body JSON
    const response = await apiClient.post(
      `/api/auth/forgot-password?email=${encodeURIComponent(email)}`,
      null, // Không cần body
      {
        headers: {
          Accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    const errorMessage = error.response?.data?.message || "Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại!";
    throw new Error(errorMessage);
  }
};
export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await apiClient.put(
      `/api/auth/reset-password`,
      { email, otp, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    const errorMessage = error.response?.data?.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại!";
    throw new Error(errorMessage);
  }
};
export const logout = () => {
  localStorage.removeItem("token"); // Xóa token khi logout
};
