import { Link } from "react-router-dom";
import * as React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import IconButton from "./buttons/iconButton";
interface Props {
  href: string;
  icon?: React.ReactNode;
}

const RandierLink = ({ href, icon }: Props) => {
  if (href?.includes('undefined')) {
    return <></>
  }
  return (
    <Link style={{ display: "flex", justifyContent: "center" }} to={`${href}`}>
      {icon ? (
        <IconButton onClick={()=>{}} icon={icon} />
      ) : (
        <IconButton onClick={()=>{}} icon={<EyeIcon className="w-7 h-7" />} />
        // <EyeIcon className="w-7 h-7 text-blue-600 hover:text-orange-800 dark:text-base dark:hover:text-blue-300 hover:translate-x-1 transition-all" />
      )}
    </Link>
  );
};

export default RandierLink;
