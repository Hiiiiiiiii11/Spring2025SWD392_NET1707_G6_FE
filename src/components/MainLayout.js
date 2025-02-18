import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function MainLayout() {
  return (
    <div className="main-layout">

      <div className="content">
        <Outlet />  {/* Đây là nơi sẽ hiển thị trang hiện tại */}
      </div>

    </div>
  );
}

export default MainLayout;
