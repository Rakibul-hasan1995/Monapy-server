/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import IconButton from "../../components/buttons/iconButton";
import Table from "../../components/ag-grid/Table";
import useClient from "./hooks/useClient";

function page() {
  const { clients, columnDefs, getFilteredData, pinnedBottomRowData } =
    useClient();


  const navigate = useNavigate()
  return (
    <Layout title={"Clients"} navButton={<IconButton classNames="mx-3" onClick={() => navigate('create')} />}>
      <Table
        columnDefs={columnDefs}
        rowData={Object.values(clients)}
        onFilterChanged={getFilteredData}
        onCellValueChanged={(x: unknown) => console.log(x)}
        pinnedBottomRowData={pinnedBottomRowData}
      />
    </Layout>
  );
}

export default page;
