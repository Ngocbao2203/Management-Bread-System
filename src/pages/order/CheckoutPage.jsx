import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/orderService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckoutPage = () => {
  const {
    prepareCheckoutItems,
    getTotalPrice,
    paymentMethod,
    setPaymentMethod,
    clearSelectedItems
  } = useCart();
  
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const customerName = localStorage.getItem('userName') || 'Khách hàng';

  useEffect(() => {
    const items = prepareCheckoutItems();
    if (items.length === 0) {
      toast.warning('Vui lòng chọn sản phẩm trước khi thanh toán', {
        autoClose: 2000
      });
      navigate('/cart');
    }
    setCheckoutItems(items);
  }, []);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        customerName,
        paymentMethod,
        orderType: 'online', // Có thể điều chỉnh theo nhu cầu
        orderDetails: checkoutItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          comboId: 0, // Mặc định là 0 nếu không có combo
          orderToppings: [] // Mảng rỗng nếu không có topping
        }))
      };

      const response = await createOrder(orderData);
      
      if (response.id) {
        toast.success('🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        clearSelectedItems();
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(`😢 Đặt hàng thất bại: ${error.message}`, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <ToastContainer />
      
      <h1 className="text-2xl font-bold mb-6 text-center">THANH TOÁN</h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Thông tin khách hàng</h2>
        <div className="p-3 bg-gray-50 rounded">
          <p className="font-medium">Tên: {customerName}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Sản phẩm đặt mua</h2>
        <div className="divide-y divide-gray-200">
          {checkoutItems.map(item => (
            <div key={item.id} className="flex py-4">
              <img 
                src={item.imageUrl || '/placeholder-product.jpg'} 
                alt={item.name} 
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">
                    {item.price.toLocaleString()}đ × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Phương thức thanh toán</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 border rounded hover:bg-gray-50">
            <input
              type="radio"
              id="cod"
              name="payment"
              checked={paymentMethod === 'COD'}
              onChange={() => setPaymentMethod('COD')}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="cod" className="ml-3 block">
              <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
            </label>
          </div>
          
          <div className="flex items-center p-3 border rounded hover:bg-gray-50">
            <input
              type="radio"
              id="bank"
              name="payment"
              checked={paymentMethod === 'BANK_TRANSFER'}
              onChange={() => setPaymentMethod('BANK_TRANSFER')}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="bank" className="ml-3 block">
              <span className="font-medium">Chuyển khoản ngân hàng</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Tổng thanh toán</h2>
        <div className="flex justify-between font-bold text-lg">
          <span>Tổng cộng:</span>
          <span className="text-orange-600">{getTotalPrice().toLocaleString()}đ</span>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white shadow-lg p-4 rounded-t-lg">
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white ${
            loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
          } transition-colors`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </span>
          ) : (
            'XÁC NHẬN ĐẶT HÀNG'
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;