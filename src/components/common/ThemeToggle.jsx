import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <button onClick={toggleDarkMode} className="mode-toggle-btn">
      {isDarkMode ? "🌞" : "🌙"}
    </button>
  );
};

export default ThemeToggle;