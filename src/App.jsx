import { useEffect } from 'react' // Thêm useEffect
import AppRouter from './router/AppRouter'
import { ThemeProvider } from './context/ThemeContext' // Import ThemeProvider
import AOS from 'aos' // Import AOS
import 'aos/dist/aos.css' // Import CSS của AOS
import './styles/ThemeToggle.css' // Import CSS của bạn
import { CartProvider } from './context/CartContext'

function App() {
  // Khởi tạo AOS khi component được mount
  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian hiệu ứng (ms)
      once: true, // Hiệu ứng chỉ chạy một lần
    })
  }, [])

  return (
    <ThemeProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </ThemeProvider>
  )
}

export default App
