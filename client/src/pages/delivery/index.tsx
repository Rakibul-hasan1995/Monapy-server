import Layout from "../../components/Layout"
import Table from "../../components/ag-grid/Table"
import { useDeliveryState } from "../../store/delivery";
import deliveryColDef from "../../components/ag-grid/colDefs/delivery";
import { useNavigate } from "react-router-dom";
import IconButton from "../../components/buttons/iconButton";


function DeliveryGoods() {
   const navigate = useNavigate()
   const { value } = useDeliveryState()
   return (
      <Layout title="Delivery" navButton={<IconButton classNames="mx-3" onClick={() => navigate('create')} />}>
         <div className="max-w-4xl mx-auto">
            <Table
               rowData={Object.values(value)}
               columnDefs={deliveryColDef}
            // onCellValueChanged={({ data }) => edit(data)}
            />
         </div>
      </Layout>
   )
}

export default DeliveryGoods 
