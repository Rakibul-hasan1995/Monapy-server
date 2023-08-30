import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./sideBar";
import { useThemeActions, useThemeState } from "../store/themeStore";

type Props = {
  children: ReactNode;
  title: string;
  active?: string;
  navButton?: ReactNode;
  backButton?:boolean
};

const Layout = (props: Props) => {
  const { children, title, active, navButton,backButton } = props
  useEffect(() => {
    document.title = title;
  }, [title]);

  const { sidebarOpen: collapsed } = useThemeState();
  const { handleSidebar: setSidebarCollapsed } = useThemeActions();
  // const [collapsed, setSidebarCollapsed] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="main relative h-screen">
      <div
        className={classNames({
          "transition-all duration-300 ease-in-out": true,
          "ml-[260px]": !collapsed,
          "md:ml-[64px]": collapsed,
          // 'ml-0':!showSidebar
        })}
      >
        <Navbar
          title={title}
          backButton={backButton}
          onMenuButtonClick={() => setShowSidebar((prev) => !prev)}
          button={navButton}
        />
        <div className="overflow-auto sm:h-screen  md:h-[calc(100vh-60px)] p-3  bg-base text-black dark:bg-base-lt-dark dark:text-base-light">
          {children}
        </div>
      </div>
      <div className="absolute top-0">
        <Sidebar
          active={active || title}
          collapsed={collapsed}
          setCollapsed={setSidebarCollapsed}
          shown={showSidebar}
        />
      </div>
    </div>
  );
};

export default Layout;
