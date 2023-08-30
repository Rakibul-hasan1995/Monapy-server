import Layout from "../../components/Layout"
import Table from "../../components/ag-grid/Table"
import { useReceiveState } from "../../store/receive"
import receiveColDef from "../../components/ag-grid/colDefs/receve";
import { useNavigate } from "react-router-dom";
import IconButton from "../../components/buttons/iconButton";

function ReceiveGoods() {
   const navigate = useNavigate()
   const { value } = useReceiveState()
   return (
      <Layout title="Receive" navButton={<IconButton classNames="mx-3" onClick={() => navigate('create')} />}>
         <div className="max-w-4xl mx-auto">
            <Table
               rowData={Object.values(value)}
               columnDefs={receiveColDef}
            // onCellValueChanged={({ data }) => edit(data)}
            />
         </div>
      </Layout>
   )
}

export default ReceiveGoods