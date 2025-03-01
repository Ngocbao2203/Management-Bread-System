import React from 'react';
import { Element } from 'react-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faYoutube, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import '../styles/Footer.css';

function Footer() {
    return (
        <Element name="contact-section">
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2>BreadTalk®</h2>
                        <p>Bánh Tươi Ngon Mỗi Ngày</p>
                        <div className="social-links">
                            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                            <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#"><FontAwesomeIcon icon={faTiktok} /></a>
                        </div>
                    </div>
                    <div className="footer-section newsletter">
                        <h3>ĐĂNG KÝ NHẬN TIN</h3>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Email của bạn..." />
                            <button>Đăng ký</button>
                        </div>
                    </div>
                    <div className="footer-section links">
                        <h3>CHỈNH SỬA</h3>
                        <ul>
                            <li>Chỉnh sửa đặt hàng online</li>
                            <li>Đổi khấu chương</li>
                            <li>Chỉnh sửa bánh mì</li>
                            <li>Câu hỏi thường gặp</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-contact">
                    <h3>THÔNG TIN LIÊN HỆ</h3>
                    <p>Địa chỉ: VPĐD: 36-38A Âu Cơ, Phường 9, Quận Tân Bình, TP. HCM</p>
                    <p>Số điện thoại: 0283 7751727 (08h00 - 17h00); 0283 5358936 (07h00 - 22h00)</p>
                    <p>Email: info@breadtalkvietnam.com</p>
                    <p>Thời gian làm việc: 08h00 - 22h00</p>
                    <div className="certification">
                        <img src="/path-to-certification-image.png" alt="Bộ công thương" />
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 BreadTalk. All rights reserved. Thiết kế website bởi HD Agency</p>
                </div>
            </footer>
        </Element>
    );
}

export default Footer;