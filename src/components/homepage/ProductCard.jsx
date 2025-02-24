import { Link } from "react-router-dom";
import "../../styles/ProductCard.css";
const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          <span className="original-price">{product.originalPrice}</span>
          <span className="discounted-price">{product.discountedPrice}</span>
        </div>
        <Link to={`/products/${product.id}`} className="details-link">CHỌN</Link>
      </div>
    </div>
  );
};

export default ProductCard;