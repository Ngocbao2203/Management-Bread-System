import MainLayout from "../../layouts/MainLayout";
import Banner from "../homepage/Banner";
import FeaturedProducts from "./FeaturedProducts";
import AboutSection from "../../pages/home/AboutSection";
import { Element } from "react-scroll";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HomePage = () => {
  const pageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const transition = {
    duration: 0.5,
    ease: "easeInOut",
  };

  const productVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 15, 
        duration: 1 
      } 
    },
  };

  // Tạo ref cho FeaturedProducts
  const featuredProductsRef = useRef(null);
  // Kiểm tra xem phần tử có trong viewport không
  const isInView = useInView(featuredProductsRef, { once: true }); // `once: true` để hiệu ứng chỉ chạy một lần

  return (
    <MainLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        transition={transition}
      >
        <Banner />
      </motion.div>

      <Element name="about-section">
        <AboutSection />
      </Element>
      
      <motion.div
        ref={featuredProductsRef} // Gắn ref vào phần tử
        initial="hidden"
        animate={isInView ? "visible" : "hidden"} // Chỉ animate khi trong viewport
        variants={productVariants}
      >
        <FeaturedProducts />
      </motion.div>
    </MainLayout>
  );
};

export default HomePage;