import SideBar from "./SideBar.jsx";
import Navbar from "./Navbar.jsx";

const Layout = ({ showSidebar = false, children }) => {
  return (
    <div className="min-h-screen ">
      <div className="flex">
        {showSidebar && <SideBar />}
        <div className="flex flex-1 flex-col">
          <Navbar />

          <main className="flex flex-1 overflow-y-auto flex-col bg-base-100">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
