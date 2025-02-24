import { Link } from "react-router-dom";
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../../styles/Banner.css";

import banner1 from "../../assets/images/banner1.jpg";
import banner2 from "../../assets/images/banner2.jpg";
import banner3 from "../../assets/images/banner3.jpg";

const Banner = () => {
  // Cấu hình slider
  const settings = {
    dots: true, // Hiển thị dấu chấm điều hướng
    infinite: true, // Lặp vô hạn
    speed: 500, // Tốc độ chuyển ảnh (ms)
    slidesToShow: 1, // Hiển thị 1 ảnh mỗi lần
    slidesToScroll: 1,
    autoplay: true, // Tự động chạy
    autoplaySpeed: 3000, // 3 giây chuyển ảnh
  };

  return (
    <section className="hero">
      <Slider {...settings}>
        <div>
          <img src={banner1} alt="Banner 1" className="banner-img" />
        </div>
        <div>
          <img src={banner2} alt="Banner 2" className="banner-img" />
        </div>
        <div>
          <img src={banner3} alt="Banner 3" className="banner-img" />
        </div>
      </Slider>
      
      <div className="hero-content">
        <h1>Welcome To Baker's Kitchen</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <Link to="/contact" className="contact-btn">Contact Us</Link>
      </div>
    </section>
  );
};

export default Banner;
