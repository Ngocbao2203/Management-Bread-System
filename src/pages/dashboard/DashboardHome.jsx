import "../../styles/DashboardHome.css";

const DashboardHome = () => {

  return (
    <div className="dashboard-home">
      <h2>Trang chủ Dashboard</h2>
      <p>Đây là trang tổng quan của bạn. Bạn có thể thêm các thống kê hoặc thông tin quan trọng ở đây.</p>
      <div>
        <h3>Thống kê nhanh</h3>
        <p>Số sản phẩm: [Số liệu từ API]</p>
        <p>Tổng doanh thu: [Số liệu từ API]</p>
      </div>
    </div>
  );
};

export default DashboardHome;