import classNames from "classnames";

import { defaultNavItems, NavItem } from "./defaultNavItems";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

// add NavItem prop to component prop
type Props = {
  collapsed: boolean;
  navItems?: NavItem[];
  setCollapsed(collapsed: boolean): void;
  shown: boolean;
  active: string;
};
const Sidebar = ({
  collapsed,
  navItems = defaultNavItems,
  shown,
  setCollapsed,
  active,
}: Props) => {
  const Icon = collapsed ? ChevronDoubleRightIcon : ChevronDoubleLeftIcon;
  return (
    <div
      className={classNames({
        "dark:bg-base-dark  bg-base-lt-dark text-white fixed md:static md:translate-x-0 z-20":
          true,
        "transition-all duration-300 ease-in-out": true,
        "w-[260px]": !collapsed,
        "w-16": collapsed,
        "-translate-x-full": !shown,
        "border-r-2 border-r-gray-500": true,
      })}
    >
      <div
        className={classNames({
          "flex flex-col justify-between h-screen sticky inset-0 w-full": true,
        })}
      >
        {/* logo and collapse button */}
        <div
          className={classNames({
            "flex items-center border-b border-b-gray-500 transition-none h-[60px]":
              true,
            "p-4 justify-between": !collapsed,
            "py-4 justify-center": collapsed,
          })}
        >
          {!collapsed && <span className="whitespace-nowrap">RBS</span>}
          <button
            className="grid place-content-center
             hover:bg-base-light hover:text-black
             dark:hover:bg-base-lt-dark dark:hover:text-base-light   
             w-10 h-10 rounded-full  opacity-0 md:opacity-100 transition-all "
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-grow">
          <ul
            className={classNames({
              "my-2 flex flex-col gap-2 items-stretch": true,
            })}
          >
            {navItems.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`${classNames({
                    "text-indigo-100 hover:bg-base dark:hover:bg-base-lt-dark dark:hover:text-base-light hover:text-red-700 flex":
                      true, //colors
                    "transition-colors duration-200": true, //animation
                    "rounded-md  mx-3 gap-4 ": !collapsed,
                    "rounded-full mx-3 w-10 h-10": collapsed,
                    "font-semibold": true,
                    "bg-base text-red-700 font-bold dark:bg-base-lt-dark dark:text-base-light":
                      active.includes(item.label),
                  })}`}
                >
                  <Link
                    to={`/rbs/v2${item.href}`}
                    className={`${classNames({
                      "flex gap-2 p-2 ": true,
                      "w-full": !collapsed,
                    })}`}
                  >
                    {item.icon}
                    <span className="ml-3">{!collapsed && item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div
          className={classNames({
            "grid place-content-stretch p-4 ": true,
          })}
        >
          <div className="flex gap-4 items-center h-11 overflow-hidden">
            <img
              src={
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
              height={36}
              width={36}
              alt="profile image"
              className="rounded-full"
            />
            {!collapsed && (
              <div className="flex flex-col ">
                <span className="text-indigo-50 my-0">Tom Cook</span>
                <a href="/" className="text-indigo-200 text-sm">
                  View Profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
