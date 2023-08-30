import Layout from "../../components/Layout";
import RandersImage from "../../components/RandersImage";
import RandersOrderProgress from "../../components/progressBar/randerOrderProgress";
import RandierLink from "../../components/randerLInkButton";
import Table from "../../components/ag-grid/Table";
import OrderServices from "../../services/api/ordersServices";
import { useOrderValue } from "../../store/order";


function OrderReports() {

  const columnDefs = [
    {
      field: "Client_name",
      headerName: "Client",
      filter: true,
      // floatingFilter: true,
      minWidth: 170
    },
    {
      field: "Order_no",
      headerName: "Order-No",
      filter: true,
      minWidth: 150,
      editable: true,
      sort: "desc",
      // floatingFilter: true,
    },
    {
      field: "Order_qty",
      headerName: "Order-Qty",
      filter: false,
      editable: true,
      cellStyle: { justifyContent: "center" },
      // maxWidth: 80
    },
    {
      field: "receivedQty",
      headerName: "Rec-Qty",
      filter: false,
      cellStyle: { justifyContent: "center" },
      // maxWidth: 80

    },
    // {
    //   field: "receivedQtyBalance",
    //   headerName: "Rec Balance",
    //   filter: false,
    //   valueGetter: function (params: {
    //     data: {
    //       Order_qty: number;
    //       receivedQty: number;
    //     };
    //   }) {
    //     const Order_qty = params.data.Order_qty || 0;
    //     const receivedQty = params.data.receivedQty || 0;

    //     return Order_qty - receivedQty;
    //   },
    //   cellStyle: { justifyContent: "center" },
    // },
    {
      field: "deliveredQty",
      headerName: "Del-Qty",
      filter: false,
      cellStyle: { justifyContent: "center" },
      // maxWidth: 80

    },
    {
      field: "deliveredBalance",
      headerName: "Del Balance",
      filter: false,
      valueGetter: function (params: {
        data: {
          deliveredQty: number;
          receivedQty: number;
        };
      }) {
        const deliveredQty = params.data.deliveredQty || 0;
        const receivedQty = params.data.receivedQty || 0;
        return receivedQty - deliveredQty;
      },
      cellStyle: { justifyContent: "center" },
      // maxWidth: 80

    },

    {
      field: "ProductionQty",
      headerName: "Production Qty",
      filter: false,
      cellRenderer: RandersOrderProgress,
      maxWidth: 100,
    },
    {
      field: "ProductionQty",
      headerName: "Production Balance",
      filter: false,
      valueGetter: (params: {
        data: { Order_qty: number; ProductionQty: number };
      }) => {
        return params.data.Order_qty - params.data.ProductionQty;
      },
      maxWidth: 80
    },
    {
      field: "Item_avatar",
      headerName: "Design",
      filter: false,
      cellStyle: { padding: 8 },
      cellRenderer: RandersImage,
      maxWidth: 100,
      editable: true,
    },
    {
      field: "Order_status",
      headerName: "Status",
      filter: true,
      cellClass: (params: { value: any }) => `status-${params.value}`,
      cellStyle: { justifyContent: "center" },
      editable: true,
      cellEditor: "agSelectCellEditor",

      cellEditorParams: {
        values: [
          "Complete",
          "Placed",
          "Processing",
          "Hold",
          "Invoiced",
          "Reject",
          "Sub-Contact",
        ],
      },


    },
    {
      field: "_id",
      headerName: "Action",
      filter: false,
      cellRenderer: (params: { value: any }) => (
        <RandierLink href={`/rbs/v2/orders/${params.value}`} />
      ),
      cellStyle: { justifyContent: "center" },
      maxWidth: 80
    },
  ];

  const { value } = useOrderValue()


  // const {  getFilteredData, pinnedBottomRowData } =
  //   useOrderReport();
  return (
    <Layout title={"Report-Orders"} active="Reports">
      <Table
        columnDefs={columnDefs}
        rowData={Object.values(value).filter(
          (item) => item.Order_status !== "Invoiced"
        )}
        // rowData={orders}
        onCellValueChanged={({ data }) => OrderServices.updateOrder(data)}
      // onFilterChanged={getFilteredData}
      // pinnedBottomRowData={pinnedBottomRowData}

      />

    </Layout>
  );
}

export default OrderReports;
