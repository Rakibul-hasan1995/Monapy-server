import * as React from "react";
import { ArrowLeftIcon, Bars3Icon, LightBulbIcon, SunIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useThemeActions, useThemeState } from "../store/themeStore";
import { useNavigate } from "react-router-dom";
type Props = {
  /**
   * Allows the parent component to modify the state when the
   * menu button is clicked.
   */
  onMenuButtonClick(): void;
  title: string;
  button?: React.ReactNode,
  backButton?: boolean
};

const Navbar = ({ onMenuButtonClick, title, button, backButton = true }: Props) => {
  const { mode } = useThemeState();
  const { changeMode } = useThemeActions();
  const ModeIcon = mode === "Light" ? SunIcon : LightBulbIcon;

  const navigate = useNavigate()

  React.useEffect(() => {
    if (mode === "Light") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return (
    <nav
      className={classNames({
        "bg-base-lt text-black": true, // colors
        "dark:bg-base-dark dark:text-gray-50": true,
        "flex items-center": true, // layout
        " md:w-full sticky z-10 px-4 shadow-md h-[60px]": true, //positioning & styling
        "border-b-gray-500  dark:border-b-2": true,
      })}
    >
      {backButton && <button className="mx-3 w-9 h-9 rounded-full p-2  
      transition-all hover:shadow-sm hover:bg-transparent/10"
        onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="h-full w-full" />
      </button>}
      <div className="font-bold text-lg">

        {title}</div>
      {/* {/* <div className="flex-grow">ffs</div> */}
      <div className="flex-grow"></div>
      <>
        {button && button}
        <button className="ml-auto " onClick={changeMode}>
          <ModeIcon className="h-6 w-6" />
        </button>
      </>
      <button className="md:hidden ml-3" onClick={onMenuButtonClick}>
        <Bars3Icon className="h-6 w-6" />
      </button>
    </nav>
  );
};

export default Navbar;
