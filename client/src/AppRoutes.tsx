import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateOutlet from "./outlet/PrivateOutlet";
import Dashboard from "./pages/dashboard";
import Clients from "./pages/clients";
import Orders from "./pages/orders";
import OrderReports from "./pages/report/orderReport";
import Invoice from "./pages/invoice";
import InvoiceDetails from "./pages/invoice/InvoiceDetails";
import OrderDetails from "./pages/orders/orderDetails";
import Payments from "./pages/payments";
import CreateOrder from "./pages/orders/createOrder";
import Login from "./pages/auth/login";
import CreatePayment from "./pages/payments/createPayment";
import CreateClient from "./pages/clients/createClient";
import ClientLayout from "./pages/clients/clientLayouts";
import ClientProfile from "./pages/clients/tabPages/profile";
import ClientOrders from "./pages/clients/tabPages/orders";
import ClientInvoice from "./pages/clients/tabPages/invoice";
import ClientStatement from "./pages/clients/tabPages/statement";
import Productions from "./pages/productions";
import ProductionDetails from "./pages/productions/ProductionDetails";
import ReceiveGoods from "./pages/received";
import DeliveryGoods from "./pages/delivery";
import OrderOutlet from "./outlet/OrderOutlet";
import OrderDelivery from "./pages/orders/detailsPages/Delivery";
import OrderReceive from "./pages/orders/detailsPages/Receive";
import OrderProductions from "./pages/orders/detailsPages/production";
import CreateReceive from "./pages/received/createReceive";
import CreateDelivery from "./pages/delivery/createDelivery";
import UpdateReceive from "./pages/received/updateReceive";
import UpdateDelivery from "./pages/delivery/updateDelivery";
import CreateInvoice from "./pages/invoice/CreateInvoice";
import AuthOutlet from "./outlet/authOutlet";
import {  AuthProvider } from "./context/AuthProvider";

function App() {
  return (
  <AuthProvider>
      <Router>
      <Routes>
        <Route path="/auth" element={<AuthOutlet />}>
          <Route path="signup" element={<p>Signup</p>}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route
            path=""
            element={<Navigate to="login" />}
          ></Route>
        </Route>

        <Route path="/rbs/v2" element={<PrivateOutlet />}>
          <Route path="dashboard" element={<Dashboard />}></Route>

          <Route path="clients" element={<Clients />}></Route>
          <Route path="clients/create" element={<CreateClient />}></Route>

          <Route path="clients/:_id" element={<ClientLayout />} >
            <Route path="profile" element={<ClientProfile />}></Route>
            <Route path="orders" element={<ClientOrders />}></Route>
            <Route path="invoices" element={<ClientInvoice />}></Route>
            <Route path="payments" element={<>No Data</>}></Route>
            <Route path="statement" element={<ClientStatement />}></Route>
          </Route>

          <Route path="orders" element={<OrderOutlet />}>
            <Route path="" element={<Orders />}></Route>
            <Route path="create" element={<CreateOrder />}></Route>
            <Route path=":_id/delivery" element={<OrderDelivery />}></Route>
            <Route path=":_id/receive" element={<OrderReceive />}></Route>
            <Route path=":_id/productions" element={<OrderProductions />}></Route>
            <Route path=":_id" element={<OrderDetails />}></Route>
          </Route>
          <Route path="report/orders" element={<OrderReports />}></Route>

          <Route path="invoices" element={<Invoice />}></Route>
          <Route path="invoices/create" element={<CreateInvoice />}></Route>
          <Route path="invoices/:_id" element={<InvoiceDetails />}></Route>

          <Route path="payments" element={<Payments />}></Route>
          <Route path="payments/create" element={<CreatePayment />}></Route>

          <Route path="productions" element={<Productions />}></Route>
          <Route path="productions/:_id" element={<ProductionDetails />}></Route>

          <Route path="receive-chalan" element={<ReceiveGoods />}></Route>
          <Route path="receive-chalan/create" element={<CreateReceive />}></Route>
          <Route path="receive-chalan/update/:_id" element={<UpdateReceive />}></Route>

          <Route path="delivery-chalan" element={<DeliveryGoods />}></Route>
          <Route path="delivery-chalan/create" element={<CreateDelivery />}></Route>
          <Route path="delivery-chalan/update/:_id" element={<UpdateDelivery />}></Route>


          <Route path="*" element={<p>not Founded</p>}></Route>
        </Route>
        <Route
          path="/"
          element={<Navigate to="/rbs/v2/dashboard" />}
        ></Route>
        <Route path="*" element={<p>not Found</p>}></Route>
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;
