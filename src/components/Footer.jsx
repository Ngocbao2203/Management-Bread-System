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
                        <h2>Bread ®</h2>
                        <p>Bánh Tươi Ngon Mỗi Ngày</p>
                    </div>
                    <div className="social-links">
                        <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                        <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                        <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                        <a href="#"><FontAwesomeIcon icon={faTiktok} /></a>
                    </div>
                </div>
                <div className="footer-contact">
                    <h3>THÔNG TIN LIÊN HỆ</h3>
                    <p>Địa chỉ: Vinhome Grand Park, Phường Long Thạnh Mỹ, Quận 9, TP. HCM</p>
                    <p>Số điện thoại: 0283 7751727 (08h00 - 17h00); 0283 5358936 (07h00 - 22h00)</p>
                    <p>Email: info@bread.com</p>
                    <p>Thời gian làm việc: 08h00 - 22h00</p>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 Bread. All rights reserved. Thiết kế website bởi HD Agency</p>
                </div>
            </footer>
        </Element>
    );
}

export default Footer;