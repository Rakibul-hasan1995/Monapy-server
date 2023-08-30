import classNames from "classnames";
import LoadingRandomNumber from "../loading/loadingRandomNumber";
import Card from "./card";
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  titleClass?: string;
  icon: React.ReactNode;
  value: number | string;
  index: number;
  children?: React.ReactNode;
  link?: string
}

const OverviewCard = ({ title, icon, value, index, children, titleClass, link }: CardProps) => {
  const iconClass = [
    "bg-indigo-200 text-white dark:text-black",
    "bg-pink-400 text-white dark:text-black",
    "bg-indigo-400 text-white dark:text-black",
    "bg-pink-600 text-white dark:text-black",
    "bg-rose-600 text-white dark:text-black",
    "bg-pink-600 text-white dark:text-black",
    "bg-rose-400 text-white dark:text-black",
    "bg-rose-800 text-white dark:text-black",
    "bg-pink-400 text-white dark:text-black",
    "bg-indigo-400 text-white dark:text-black",
    "bg-pink-600 text-white dark:text-black",
    "bg-rose-600 text-white dark:text-black",
    "bg-pink-600 text-white dark:text-black",
    "bg-rose-400 text-white dark:text-black",
    "bg-rose-800 text-white dark:text-black",
  ];

  return (
    <Card>
      <div className="flex items-center justify-between">
        {link ?
          <Link to={link}><div className={`p-3 w-11 rounded-full hover:rotate-[360deg] transition-all ${iconClass[index]}`}>{icon}</div></Link> :
          <div className={`p-3 w-11 rounded-full hover:rotate-[360deg] transition-all ${iconClass[index]}`}>{icon}</div>}
        <p
          className={classNames({
            "text-2xl font-bold font-mono pl-2 ": true,
            "text-red-400": parseInt(String(value)) < 0,

          })
            +
            titleClass
          }
        >
          {value !== 0 ? value : <LoadingRandomNumber />}
        </p>
      </div>
      <p className="text-xs py-2">{title}</p>

      {children}
    </Card>
  );
};

export default OverviewCard;
