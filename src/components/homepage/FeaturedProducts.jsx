import ProductCard from "./ProductCard";
import kebabImage from "../../assets/images/kebab.jpg";
import { useRef, useEffect, useState } from "react";
import "../../styles/FeaturedProducts.css";
import { Element } from "react-scroll";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "DONUT BALLS",
      image: kebabImage,
      discountedPrice: "30.000đ",
    },
    {
      id: 2,
      name: "PANDAN CHIFFON",
      image: kebabImage,
      discountedPrice: "138.000đ",
    },
    {
      id: 3,
      name: "TIRAMISU C",
      image: kebabImage,
      discountedPrice: "650.000đ",
    },
    {
      id: 4,
      name: "TIRAMISU R",
      image: kebabImage,
      discountedPrice: "490.000đ",
    },
    {
      id: 5,
      name: "Bánh mì Thịt Nướng",
      image: kebabImage,
      discountedPrice: "45.000đ",
    },
    {
      id: 6,
      name: "Bánh mì Thịt Nướng",
      image: kebabImage,
      discountedPrice: "45.000đ",
    },
  ];

  const scrollRef = useRef(null);
  const cardWidth = 280; // Chiều rộng của ProductCard (theo CSS)
  const gap = 20; // Khoảng cách giữa các ProductCard
  const cardsPerPage = 4; // Số sản phẩm hiển thị trên mỗi trang
  const totalPages = Math.ceil(products.length / cardsPerPage);
  const [currentPage, setCurrentPage] = useState(0);

  // Cuộn đến trang tương ứng
  const scrollToPage = (page) => {
    if (scrollRef.current && page >= 0 && page < totalPages) {
      setCurrentPage(page);
      const scrollAmount = (cardWidth + gap) * (cardsPerPage * page);
      scrollRef.current.scrollLeft = scrollAmount;
    }
  };

  // Thêm chức năng kéo ngang nhưng không thay đổi con trỏ thành grab/grabbing
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      // Không thay đổi con trỏ thành "grabbing" để giữ con trỏ mặc định (default)
    };

    const handleMouseLeave = () => {
      isDown = false;
      // Không cần thay đổi con trỏ về "grab" vì chúng ta không sử dụng nó
    };

    const handleMouseUp = () => {
      isDown = false;
      // Không cần thay đổi con trỏ về "grab" vì chúng ta không sử dụng nó
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2; // Tốc độ kéo
      scrollContainer.scrollLeft = scrollLeft - walk;

      // Cập nhật currentPage dựa trên vị trí cuộn
      const scrollPosition = scrollContainer.scrollLeft;
      const page = Math.round(scrollPosition / ((cardWidth + gap) * cardsPerPage));
      setCurrentPage(page);
    };

    // Thêm event listeners
    scrollContainer.addEventListener("mousedown", handleMouseDown);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("mouseup", handleMouseUp);
    scrollContainer.addEventListener("mousemove", handleMouseMove);

    // Xóa event listeners khi component unmount
    return () => {
      scrollContainer.removeEventListener("mousedown", handleMouseDown);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("mouseup", handleMouseUp);
      scrollContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Đảm bảo vị trí cuộn chính xác khi tải trang
  useEffect(() => {
    scrollToPage(0);
  }, []);

  return (
    <Element name="product-section">
      <section className="featured-products">
        <div className="header-container">
          <h2>SẢN PHẨM NỔI BẬT</h2>
        </div>
        <div className="product-container">
          <div className="product-list" ref={scrollRef}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="pagination-dots">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`dot ${currentPage === index ? "active" : ""}`}
                onClick={() => scrollToPage(index)}
              ></button>
            ))}
          </div>
        </div>
        <button className="see-all-btn">Xem tất cả</button>
      </section>
    </Element>
  );
};

export default FeaturedProducts;