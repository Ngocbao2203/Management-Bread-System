import { Link } from "react-router-dom";
import "../../styles/About.css";
import banhmi from "../../assets/images/banh-mi.jpg";

const AboutSection = () => {
  return (
    <section className="about-container">
      <h1>Giới thiệu</h1>
      <div className="about-content">
        <img src={banhmi} alt="Bánh mì" className="about-img" />
        <div className="about-text">
          <p>Chào mừng bạn đến với <strong>Bánh Mì Việt</strong> – nơi tinh hoa ẩm thực Việt Nam được kết tinh trong từng ổ bánh mì.</p>

          <h2>Sứ Mệnh</h2>
          <p>Chúng tôi cam kết mang đến những ổ bánh mì thơm ngon, chất lượng nhất, được làm từ nguyên liệu tươi ngon và quy trình chế biến đảm bảo vệ sinh an toàn thực phẩm.</p>

          <h2>Giá Trị Cốt Lõi</h2>
          <ul>
            <li>🍞 Chất lượng nguyên liệu hàng đầu</li>
            <li>👨‍🍳 Đội ngũ thợ làm bánh chuyên nghiệp</li>
            <li>🌟 Hương vị truyền thống kết hợp hiện đại</li>
            <li>💖 Khách hàng là trung tâm của mọi hoạt động</li>
          </ul>

          <h2>Liên Hệ</h2>
          <div className="contact-info">
            <p>Email: info@banhmiviet.com</p>
            <p>Hotline: 0987 654 321</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;