// import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="layout-container">
      {/* <Header /> */}
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
