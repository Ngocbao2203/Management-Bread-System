import ProductCard from "./ProductCard";
import kebabImage from "../../assets/images/kebab.jpg";
import { useRef } from "react";
import "../../styles/FeaturedProducts.css";
import { Element } from "react-scroll";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Bánh mì KEBAB",
      description: "Bánh mì Doner Kebab phổ biến dùng thịt heo nướng phù hợp với khẩu vị và ăn kèm với các loại rau như hành tây, bắp cải, cà rốt… nước sốt.",
      image: kebabImage,
      originalPrice: "59.000đ",
      discountedPrice: "49.000đ",
    },
    {
      id: 2,
      name: "Bánh mì Thịt Nướng",
      description: "Bánh mì thịt nướng thơm ngon, kèm rau sống và nước sốt đặc biệt.",
      image: kebabImage,
      originalPrice: "55.000đ",
      discountedPrice: "45.000đ",
    },
    {
      id: 3,
      name: "Bánh mì Thịt Nướng",
      description: "Bánh mì thịt nướng thơm ngon, kèm rau sống và nước sốt đặc biệt.",
      image: kebabImage,
      originalPrice: "55.000đ",
      discountedPrice: "45.000đ",
    },
    {
      id: 4,
      name: "Bánh mì Thịt Nướng",
      description: "Bánh mì thịt nướng thơm ngon, kèm rau sống và nước sốt đặc biệt.",
      image: kebabImage,
      originalPrice: "55.000đ",
      discountedPrice: "45.000đ",
    },
    {
      id: 5,
      name: "Bánh mì Thịt Nướng",
      description: "Bánh mì thịt nướng thơm ngon, kèm rau sống và nước sốt đặc biệt.",
      image: kebabImage,
      originalPrice: "55.000đ",
      discountedPrice: "45.000đ",
    },
  ];

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 1000; // Adjust this value based on your card width
    if (scrollRef.current) {
      const scrollPosition = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount 
        : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Element name="product-section">
    <section className="featured-products">
      <div className="header-container">
        <h2>Sản phẩm nổi bật</h2>
        <button className="see-all-btn">See All</button>
      </div>
      <div className="product-container">
        <button className="scroll-btn left" onClick={() => scroll('left')}>&lt;</button>
        <div className="product-list" ref={scrollRef}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <button className="scroll-btn right" onClick={() => scroll('right')}>&gt;</button>
      </div>
    </section>
    </Element>
  );
};

export default FeaturedProducts;