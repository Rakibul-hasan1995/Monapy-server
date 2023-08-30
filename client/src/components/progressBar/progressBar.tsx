/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from "./styles.module.css";
export default function ProgressBar({ progress = 100, toolTipValue = "" }) {
  let bgColor = "#4d22b1";
  if (progress == 0) {
    bgColor = "red";
  }
  if (progress > 10) {
    bgColor = "slateblue";
  }
  if (progress > 50) {
    bgColor = "blue";
  }
  if (progress > 95) {
    bgColor = "green";
  }
  if (progress > 105) {
    bgColor = "orange";
  }

  return (
    <div className={`w-full`}>
      <div className="group flex relative w-full">
        <div
          className={`${styles.progressbar_container} 
        bg-gray-300 relative w-full h-8 rounded flex items-center justify-center
        overflow-hidden
        `}
        >
          <div
            className={` absolute  left-0 top-0 h-full z-auto `}
            style={{ width: `${progress}%`, backgroundColor: bgColor }}
          >
            <div
              className={`${styles.progressbar_liquid} w-12 h-12 absolute`}
              style={{ backgroundColor: bgColor }}
            ></div>
          </div>
          <span
            className={"z-10"}
            style={{ color: progress > 50 ? "#fff" : "#333" }}
          >
            {progress}%
          </span>
        </div>
        <span
          className="
        group-hover:opacity-80 
        transition-opacity bg-gray-800 px-1 text-sm 
         text-gray-100 rounded-md absolute opacity-0 m-4 
         mx-auto -translate-x-2 -translate-y-5 z-10"
        >
          {toolTipValue}
        </span>
      </div>
    </div>
  );
}
