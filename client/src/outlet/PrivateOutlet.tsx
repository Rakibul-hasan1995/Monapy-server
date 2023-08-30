import { Outlet } from "react-router-dom";

import { StoreProvider } from "easy-peasy";
import store from "../store/store";
import { ToastContainer } from "react-toastify";
import {  useAuth } from "../context/AuthProvider";
import Login from "../pages/auth/login";
export default function PrivateOutlet() {

  const { isLoggedIn } = useAuth()
  return (
    <StoreProvider store={store}>
      {isLoggedIn ? <Outlet /> : <Login />}
      <ToastContainer position={'bottom-left'} autoClose={2000} />
    </StoreProvider>

  );
}
