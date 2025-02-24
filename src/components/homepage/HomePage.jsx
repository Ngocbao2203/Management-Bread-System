import MainLayout from "../../layouts/MainLayout";
import Banner from "../homepage/Banner";
import FeaturedProducts from "./FeaturedProducts";
import AboutSection from "../../pages/home/AboutSection";
import { Element } from "react-scroll";
import { motion } from "framer-motion"; // Already imported

const HomePage = () => {
  // Animation variants for consistent sliding from right to left (or other directions)
  const pageVariants = {
    hidden: { opacity: 0, x: 100 }, // Start off-screen to the right, invisible
    visible: { opacity: 1, x: 0 }, // Slide in to center, fully visible
    exit: { opacity: 0, x: -100 }, // Slide out to the left, invisible
  };

  const transition = {
    duration: 0.5, // Smooth 0.5-second duration
    ease: "easeInOut", // Natural easing for a fluid effect
  };

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
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        transition={transition}
      >
        <FeaturedProducts />
      </motion.div>
    </MainLayout>
  );
};

export default HomePage;