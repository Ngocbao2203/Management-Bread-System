import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <div className="toggle-container">
      <button 
        onClick={toggleDarkMode} 
        className={`mode-toggle-btn ${isDarkMode ? 'dark' : 'light'}`}
      >
        <span className="star">🔅</span>
        <span className="moon">🌙</span>
      </button>
    </div>
  );
};

export default ThemeToggle;