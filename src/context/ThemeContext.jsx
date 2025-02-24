import React, { createContext, useState, useEffect } from "react";

// Tạo Context
export const ThemeContext = createContext();

// Provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" // Lấy trạng thái từ localStorage
  );

  // Lưu trạng thái vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  // Hàm chuyển đổi chế độ
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};