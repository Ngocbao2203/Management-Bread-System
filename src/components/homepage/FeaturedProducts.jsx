import ProductCard from './ProductCard'
import kebabImage from '../../assets/images/kebab.jpg'
import { useRef, useEffect, useState } from 'react'
import '../../styles/FeaturedProducts.css'
import { Element } from 'react-scroll'
import { useNavigate } from 'react-router-dom'
import { getProductList } from '../../services/productService'
const FeaturedProducts = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await getProductList(page, size);
      console.log("Result from getProductList:", result);
      setProducts(result.products || []);
      setTotalItems(result.pagination.total || result.products.length);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalItems / size)) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, size]);

  const scrollRef = useRef(null)
  const cardWidth = 280 // Chiều rộng của ProductCard (theo CSS)
  const gap = 20 // Khoảng cách giữa các ProductCard
  const [currentIndex, setCurrentIndex] = useState(0) // Theo dõi index của sản phẩm hiện tại

  // Cuộn đến sản phẩm tương ứng với hiệu ứng mượt, hỗ trợ infinite scroll
  const scrollToProduct = (index) => {
    if (scrollRef.current) {
      // Áp dụng infinite scroll: nếu index vượt quá giới hạn, quay lại đầu/cuối
      const normalizedIndex = index % products.length
      if (normalizedIndex < 0) {
        setCurrentIndex(products.length - 1) // Quay về sản phẩm cuối nếu index âm
        const scrollAmount = (cardWidth + gap) * (products.length - 1)
        scrollRef.current.scrollTo({
          left: scrollAmount,
          behavior: 'smooth',
        })
      } else {
        setCurrentIndex(normalizedIndex)
        const scrollAmount = (cardWidth + gap) * normalizedIndex
        scrollRef.current.scrollTo({
          left: scrollAmount,
          behavior: 'smooth', // Sử dụng hiệu ứng mượt
        })
      }
    }
  }

  // Tính vị trí snap đến sản phẩm gần nhất với infinite scroll
  const snapToNearestProduct = (scrollPosition) => {
    const productStep = cardWidth + gap
    let nearestProduct = Math.round(scrollPosition / productStep)

    // Áp dụng infinite scroll: chuẩn hóa index
    nearestProduct =
      ((nearestProduct % products.length) + products.length) % products.length
    const snapPosition = nearestProduct * productStep
    return snapPosition
  }

  // Xử lý nút prev/next với infinite scroll
  const handlePrev = () => {
    scrollToProduct(currentIndex - 1)
  }

  const handleNext = () => {
    scrollToProduct(currentIndex + 1)
  }

  // Thêm chức năng kéo ngang với snap và infinite scroll
  useEffect(() => {
    const scrollContainer = scrollRef.current
    let isDown = false
    let startX
    let scrollLeft
    let animationFrameId

    const handleMouseDown = (e) => {
      isDown = true
      startX = e.pageX - scrollContainer.offsetLeft
      scrollLeft = scrollContainer.scrollLeft
      scrollContainer.style.scrollBehavior = 'auto' // Tắt scrollBehavior smooth khi kéo
    }

    const handleMouseLeave = () => {
      isDown = false
      cancelAnimationFrame(animationFrameId)
    }

    const handleMouseUp = () => {
      isDown = false
      scrollContainer.style.scrollBehavior = 'smooth' // Bật lại scrollBehavior smooth sau khi thả

      // Tính vị trí snap gần nhất với infinite scroll
      const scrollPosition = scrollContainer.scrollLeft
      const snapPosition = snapToNearestProduct(scrollPosition)

      scrollContainer.scrollTo({
        left: snapPosition,
        behavior: 'smooth', // Hiệu ứng mượt khi snap
      })

      // Cập nhật currentIndex dựa trên vị trí snap với infinite scroll
      const newIndex = Math.round(snapPosition / (cardWidth + gap))
      setCurrentIndex(
        ((newIndex % products.length) + products.length) % products.length
      )

      cancelAnimationFrame(animationFrameId)
    }

    const handleMouseMove = (e) => {
      if (!isDown) return

      e.preventDefault()
      const x = e.pageX - scrollContainer.offsetLeft
      const walk = (x - startX) * 1.5 // Tăng tốc độ kéo nhẹ để mượt hơn

      // Sử dụng requestAnimationFrame để làm mượt chuyển động
      cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(() => {
        // Kiểm tra nếu kéo qua cuối hoặc đầu danh sách để áp dụng infinite scroll
        const maxScroll = (products.length - 1) * (cardWidth + gap)
        let newScrollLeft = scrollLeft - walk

        if (newScrollLeft < 0) {
          newScrollLeft = maxScroll // Quay về cuối nếu kéo qua đầu
        } else if (newScrollLeft > maxScroll) {
          newScrollLeft = 0 // Quay về đầu nếu kéo qua cuối
        }

        scrollContainer.scrollLeft = newScrollLeft
      })
    }

    // Thêm event listeners
    scrollContainer.addEventListener('mousedown', handleMouseDown)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)
    scrollContainer.addEventListener('mouseup', handleMouseUp)
    scrollContainer.addEventListener('mousemove', handleMouseMove)

    // Xóa event listeners khi component unmount
    return () => {
      scrollContainer.removeEventListener('mousedown', handleMouseDown)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
      scrollContainer.removeEventListener('mouseup', handleMouseUp)
      scrollContainer.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  })

  // Đảm bảo vị trí cuộn chính xác khi tải trang
  useEffect(() => {
    scrollToProduct(0)
  })

  return (
    <Element name="product-section">
      <section className="featured-products">
        <div className="header-container">
          <h2>SẢN PHẨM NỔI BẬT</h2>
        </div>
        <div className="product-container">
          <button
            className="nav-btn prev-btn"
            onClick={handlePrev}
            disabled={false} // Vô hiệu hóa disabled vì infinite scroll
          ></button>
          <div className="product-list" ref={scrollRef}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <button
            className="nav-btn next-btn"
            onClick={handleNext}
            disabled={false} // Vô hiệu hóa disabled vì infinite scroll
          ></button>
          <div className="pagination-dots">
            {products.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => scrollToProduct(index)}
              ></button>
            ))}
          </div>
        </div>
        <button
          onClick={() => navigate('/products_list')}
          className="see-all-btn"
        >
          Xem tất cả
        </button>
      </section>
    </Element>
  )
}

export default FeaturedProducts
