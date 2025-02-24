import React from "react";
import AppRouter from "./router/AppRouter";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import "./styles/ThemeToggle.css";
function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
