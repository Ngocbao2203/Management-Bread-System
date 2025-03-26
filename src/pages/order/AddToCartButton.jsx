import PropTypes from 'prop-types';
import { useCart } from '../../context/CartContext';

const AddToCartButton = ({ productId }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(productId);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
    >
      Thêm vào giỏ hàng
    </button>
  );
};

// PropTypes cho AddToCartButton
AddToCartButton.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default AddToCartButton;