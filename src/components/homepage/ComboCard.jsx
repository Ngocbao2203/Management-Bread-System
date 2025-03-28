import { Link, useNavigate } from "react-router-dom";
import "../../styles/ComboCard.css";

const ComboCard = ({ combo }) => {
  const navigate = useNavigate();

  const handleDragStart = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi kéo mặc định của trình duyệt
  };

  return (
    <div className="combo-card">
      <img
        src={combo.imageUrl}
        onClick={() => navigate(`/combo/${combo.id}`)}
        alt={combo.name}
        className="combo-image"
        draggable="false" // Ngăn hình ảnh có thể kéo
        onDragStart={handleDragStart} // Ngăn sự kiện kéo hình ảnh
      />
      <div className="combo-content">
        <h3 className="combo-name">{combo.name}</h3>
        <div className="combo-price">
          <span className="dis-price">{combo.price}</span>
        </div>
        <Link to={`/combo/${combo.id}`} className="add-to-cart-btn">
          Thêm vào giỏ hàng
        </Link>
      </div>
    </div>
  );
};

export default ComboCard;