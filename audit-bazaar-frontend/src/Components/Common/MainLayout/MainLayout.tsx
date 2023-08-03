import { Outlet } from "react-router-dom";
import Header from "../Header/index";
import "./MainLayout.scss";
import Footer from "../Footer/Footer";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="main-wrap">
        <main className="main-wrap__inner">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
