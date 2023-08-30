import { useParams } from "react-router-dom"
import { useEffect, useMemo, useState } from 'react'
import Layout from "../../components/Layout"
import { Production } from "../../store/production";
import moment from "moment"
import Table from "../../components/ag-grid/Table"
import RandersImage from "../../components/RandersImage"
import { numberWithCommas } from "../../utils/numberFormater"
import { ApexOptions } from "apexcharts"
import Chart from "react-apexcharts";
import Card from "../../components/card/card"
import { useThemeState } from "../../store/themeStore"
import ProductionServices from "../../services/api/productionServices"

function ProductionDetails() {
  const activePage = useParams()
  const _id = activePage._id || ''



  const [data, setData] = useState<Production>()
  const date = moment(data?.Production_date).format('DD-MMM-yy')

  useEffect(() => {
    if (_id?.length) {
      getData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id])


  const getData = async () => {
    const rec = await ProductionServices.getProductionQuery(`_id=${_id}`)

    setData(rec[0])
  }

  const columnDefs = [
    {
      field: "Line_no",
      headerName: "MC NO",
      maxWidth: 100

    },
    {
      field: "Order_no",
      headerName: "Order No",
    },
    {
      field: "Item_avatar",
      headerName: "Design",
      cellStyle: { padding: 8 },
      cellRenderer: RandersImage,
    },
    {
      field: "qty",
      headerName: "Qty",
      maxWidth: 80
    },
    {
      field: "Order_rate",
      headerName: "Rate",
      maxWidth: 80,

      valueFormatter: ({ value }: { value: any }) => {
        if (!value) {
          return "";
        }
        return numberWithCommas(parseInt(value));
      },
      cellStyle: { justifyContent: "right" },
    },
    {
      field: "amount",
      headerName: "Amount",
      valueFormatter: ({ value }: { value: any }) => {
        if (!value) {
          return "";
        }
        return numberWithCommas(parseInt(value));
      },
      cellStyle: { justifyContent: "right" },
    },
    {
      headerName: "T-Stitch",
      field: "remarks",
    },

  ];

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: false,
      floatingFilter: false,
      sortable: false,
      resizable: false,
      editable: false,
    };
  }, []);

  const pinnedBottomRowData = [
    {
      Order_no: "Total",
      amount: data?.Production_amount,
    },
  ];

  return (
    <Layout title={`${date} / ${data?.Production_shift}`} active="Productions">
      <div className="flex flex-wrap ">
        <div className="w-full  ml-3 md:w-[60%] my-auto">
          <Table
            rowData={Object.values(data?.Production_data || []) || []}
            columnDefs={columnDefs}
            pinnedBottomRowData={pinnedBottomRowData}
            defaultColDef={defaultColDef}
          />
        </div>
        <div className="w-full  ml-3 md:w-[38%] my-auto">
          {data && <PieChart data={data?.Production_data} />}

        </div>
      </div>

    </Layout>
  )
}

export default ProductionDetails



const PieChart = ({ data }: { data: any }) => {

  const groupedData = data?.reduce((acc: { [x: string]: any }, item: { Line_no: any; amount: any }) => {
    const lineNo = 'Machine No ' + item.Line_no;
    const amount = item.amount;

    if (!acc[lineNo]) {
      acc[lineNo] = 0;
    }

    acc[lineNo] += amount;

    return acc;
  }, {});
  const groupBYStyle = data?.reduce((acc: { [x: string]: any }, item: { Line_no: any; qty: number, Order_no: string }) => {
    const style = item.Order_no;
    const qty = item.qty;

    if (!acc[style]) {
      acc[style] = 0;
    }
    acc[style] += qty;
    return acc;
  }, {});


  const styleData = Object.keys(groupBYStyle).map((style) => ({
    x: style,
    y: groupBYStyle[style],
  }));
  const pieChartData = Object.keys(groupedData).map((lineNo) => ({
    x: lineNo + ' = ' + numberWithCommas(groupedData[lineNo]),
    y: groupedData[lineNo],
  }));
  const { mode } = useThemeState()
  const chartOptions: ApexOptions = {
    chart: {
      type: "pie",
      foreColor: mode == "Light" ? "#ffffff" : "#373d3f",
    },
    labels: pieChartData.map((item) => item.x),
    tooltip: {
      y: {
        formatter: (val: number) => {
          return val.toLocaleString(); // Format amount with commas
        },
      },
    },
    legend: {
      position: "bottom", // Set legend position to bottom
    },
  };

  const series = pieChartData.map((item) => item.y);
  return (
    <Card>
      <Chart options={chartOptions} series={series} type="pie" height={350} />
      <p className="text-center py-3">By Order</p>
      <ul>
        {Object.values(styleData).map((item) => (
          <li key={item.x}>{item.x} == {item.y} pcs</li>
        ))}
      </ul>
    </Card>
  )
}

