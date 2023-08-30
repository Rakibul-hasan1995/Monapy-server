/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "../../components/Layout";
import Table from "../../components/ag-grid/Table";

import { useNavigate } from "react-router-dom";
import IconButton from "../../components/buttons/iconButton";
import OrderServices from "../../services/api/ordersServices";
import OrderColDef from "../../components/ag-grid/colDefs/order";
import { useOrderValue } from "../../store/order";
function page() {
  const navigate = useNavigate()
  const { value } = useOrderValue()
  return (
    <Layout title={"Orders"} navButton={<IconButton classNames="mx-3" onClick={() => navigate('create')} />}>
      <Table
        rowData={Object.values(value)}
        columnDefs={OrderColDef}
        onCellValueChanged={({ data }) => OrderServices.updateOrder(data)}


      />
    </Layout>
  );
}

export default page;


