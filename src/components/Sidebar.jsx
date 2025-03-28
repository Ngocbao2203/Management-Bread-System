import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faBox,
  faList,
  faUtensils,
  faUser,
  faProjectDiagram,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Sidebar.css";

// Ánh xạ các icon với section title
const iconMap = {
  Dashboard: faChartBar,
  Products: faBox,
  Categories: faList,
  Ingredients: faUtensils,
  Branchs: faProjectDiagram,
  Accounts: faUser,
};

// Ánh xạ menu với route
const routeMap = {
  Dashboard: "/dashboard",
  Products: "/dashboard/products",
  Categories: "/dashboard/categories",
  Ingredients: "/dashboard/ingredients",
  Branchs: "/dashboard/branchs",
  Accounts : "/dashboard/accounts",
};

const Sidebar = ({ setSelectedMenu, selectedMenu }) => {
  const [openSections, setOpenSections] = useState({});
  const [sidebarItems, setSidebarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Quản trị viên");
  const navigate = useNavigate();

  console.log("Sidebar rendered, props:", { setSelectedMenu, selectedMenu });

  // Hard-code sidebarItems
  useEffect(() => {
    setSidebarItems([
      { title: "Dashboard", items: [] },
      { title: "Categories", items: [] },
      { title: "Ingredients", items: [] },
      { title: "Products", items: [] },
      { title: "Branchs", items: [] },
      { title: "Accounts", items: []},
    ]);
    // Mở mặc định section "Quản lý sản phẩm" (index 1)
    setOpenSections({ 1: true });
    setLoading(false);

    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      [section]: !prev[section],
    }));
  };

  const handleMenuClick = (menu) => {
    console.log("Menu clicked:", menu);
    if (routeMap[menu]) {
      setSelectedMenu(menu); // Cập nhật selectedMenu qua props
      navigate(routeMap[menu]);
    } else {
      console.error("Route not found for menu:", menu);
    }
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    navigate("/login");
  };

  if (loading) {
    console.log("Sidebar loading...");
    return <div>Loading Sidebar...</div>;
  }

  console.log("Sidebar items:", sidebarItems);

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">{userName}</h2>
      <ul className="sidebar-menu">
        {sidebarItems.map((section, index) => (
          <li key={index} className={`sidebar-item ${selectedMenu === section.title ? "active" : ""}`}>
            <div
              className="sidebar-section"
              onClick={() => {
                if (section.title === "Dashboard" || section.title === "Products" || section.title === "Categories" || section.title === "Ingredients" || section.title === "Branchs" || section.title === "Accounts") {
                  handleMenuClick(section.title);
                } else {
                  toggleSection(index);
                }
              }}
            >
              <div className="section-title">
                <FontAwesomeIcon
                  icon={iconMap[section.title] || faChartBar}
                  className="section-icon"
                />
                <span>{section.title}</span>
              </div>
              {section.items.length > 0 && (
                <span className="arrow">{openSections[index] ? "▼" : "▶"}</span>
              )}
            </div>
            {openSections[index] && section.items.length > 0 && (
              <ul className="submenu">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className={`submenu-item ${selectedMenu === item ? "selected" : ""}`}
                    onClick={() => handleMenuClick(item)}
                  >
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        <li className="sidebar-item logout-item">
          <div className="sidebar-section" onClick={handleLogout}>
            <div className="section-title">
              <FontAwesomeIcon icon={faSignOutAlt} className="section-icon" />
              <span>Logout</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;