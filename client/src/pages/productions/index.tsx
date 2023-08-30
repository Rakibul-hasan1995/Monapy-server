import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import IconButton from "../../components/buttons/iconButton";
import Table from "../../components/ag-grid/Table";
import GroupChart from "../../components/charts/groupChart";
import useProductions from "./hooks/useProductions";
import { useProductionXY } from "../../store/production";
import productionColDef from "../../components/ag-grid/colDefs/production";

export default function Productions() {
   const navigate = useNavigate()
   const { 
      getFilteredData,
      pinnedBottomRowData, value } = useProductions()

   const { _groupDataXY } = useProductionXY()
   return (
      <Layout title="Productions" navButton={<IconButton classNames="mx-3" onClick={() => navigate('create')} />} >
         <div className="flex flex-wrap">
            <div className="w-full   md:w-[60%] ">
               <Table
                  rowData={Object.values(value)}
                  columnDefs={productionColDef}
                  // onCellValueChanged={({ data }) => edit(data)}
                  pinnedBottomRowData={pinnedBottomRowData}
                  onFilterChanged={getFilteredData}
               />
            </div>
            <div className="w-full  ml-3 md:w-[39%] my-auto">
               <GroupChart chartData={_groupDataXY} title="Productions" height={250} />
            </div>
         </div>
      </Layout>
   )
}
