import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { getProductById } from '../../services/productService';

const CartPage = () => {
  const {
    cartItems,
    selectedItems,
    removeFromCart,
    updateQuantity,
    toggleSelectItem,
    selectAllItems,
    removeSelectedItems,
    getTotalPrice
  } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await Promise.all(
          cartItems.map(async (item) => {
            const productDetails = await getProductById(item.id);
            return {
              ...item,
              ...productDetails
            };
          })
        );
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (cartItems.length > 0) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [cartItems]);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-10">
          <p>Giỏ hàng của bạn đang trống</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                onChange={selectAllItems}
                className="mr-2 h-5 w-5"
              />
              <span className="font-medium">Chọn tất cả ({cartItems.length})</span>
              <button 
                onClick={removeSelectedItems}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Xóa
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {products.map((product) => (
                <div key={product.id} className="py-4 flex items-start">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(product.id)}
                      onChange={() => toggleSelectItem(product.id)}
                      className="mr-2 h-5 w-5"
                    />
                    <img
                      src={product.imageUrl || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-gray-500 text-sm">{product.description?.substring(0, 50)}...</p>
                    <div className="mt-2">
                      <span className="text-orange-500 font-bold">{product.price.toLocaleString()}đ</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-2 w-8 text-center">{product.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sticky bottom-0">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">
                  Tổng cộng ({selectedItems.length} sản phẩm): 
                </span>
                <span className="text-orange-500 font-bold ml-2">
                  {getTotalPrice().toLocaleString()}đ
                </span>
              </div>
              <button 
                onClick={handleCheckout}
                className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
                disabled={selectedItems.length === 0}
              >
                Mua hàng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;