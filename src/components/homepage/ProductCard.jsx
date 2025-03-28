import { Link } from "react-router-dom";
import "../../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const handleDragStart = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi kéo mặc định của trình duyệt
  };

  return (
    <div className="product-card">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="product-image"
        draggable="false" // Ngăn hình ảnh có thể kéo
        onDragStart={handleDragStart} // Ngăn sự kiện kéo hình ảnh
      />
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span className="discounted-price">{product.price}</span>
        </div>
        <Link to={`/products/${product.id}`} className="add-to-cart-btn">
          Thêm vào giỏ hàng
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;