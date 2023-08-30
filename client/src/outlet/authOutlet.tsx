import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";


export default function AuthOutlet() {
   return (
      <>
         <Outlet />
         <ToastContainer position={'bottom-left'} autoClose={2000} />
      </>
   )
}
