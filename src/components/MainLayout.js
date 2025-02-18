import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <main className="content">
        <Outlet /> {/* Render nội dung của từng trang */}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
