import React from "react";
import { Link } from "react-router-dom";
import "../../styles/About.css";
import banhmi from "../../assets/images/banh-mi.jpg";

const AboutSection = () => {
  return (
    <section className="about-container">
      <h1 data-aos="fade-down">BREADTALK VIETNAM</h1>
      <div className="about-content">
        <img
          src={banhmi}
          alt="Bánh mì"
          className="about-img"
          data-aos="fade-right"
        />
        <div className="about-text" data-aos="fade-left">
          <p className="intro-text">
            Trải nghiệm ẩm thực bánh mì tuyệt vời tại BreadTalk Vietnam!
          </p>
          <p>
            Hành trình 13 năm hoàn thiện và phát triển. Gần 30 cơ sở phục vụ.
          </p>
          <blockquote>
            “Chúng tôi tự tin dẫn đầu với uy tín và chất lượng. Chúng tôi am hiểu
            ẩm thực bánh và khẩu vị người Việt. Chúng tôi không ngừng đổi mới và
            sáng tạo”.
          </blockquote>
          <p>
            Trải nghiệm ẩm thực bánh tuyệt vời tại thương hiệu bánh mì đến từ
            Singapore ngay hôm nay!
          </p>

          <h2>Liên Hệ</h2>
          <div className="contact-info">
            <p>Email: info@breadtalk.vn</p>
            <p>Hotline: 0987 654 321</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;