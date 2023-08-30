import {
  CalendarDaysIcon,
  ChartBarIcon,
  CurrencyBangladeshiIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import Layout from "../../components/Layout";
import { numberWithCommas } from "../../utils/numberFormater";
import Card from "../../components/card/card";
import OverviewCard from "../../components/card/overviewCard";
import { useInvoiceStateXY } from "../../store/invoice";
import { usePaymentStateXY } from "../../store/payments";
import { useClientStateTopClients } from "../../store/client";
import TopClientLoading from "../../components/loading/topClientLoading";
import { Link } from "react-router-dom";
import { useProductionXY } from "../../store/production";
import { ApexOptions } from "apexcharts";
import moment from "moment";
import ChartComponent from "../../components/charts/Charts";
import Chart from "react-apexcharts";
import { useThemeState } from "../../store/themeStore";

export default function Dashboard() {
  const {
    prodLast30DaysTotal,
    prodCurrentMonthTotal,
    prodLast30DaysXY,
    prodCurrentMonthXY,
  } = useProductionXY();

  const {
    invLast30DaysXY,
    invLast30DaysTotal,
  } = useInvoiceStateXY()

  const {
    payLast30DaysXY,
    payLast30DaysTotal,
  } = usePaymentStateXY()

  const { topClient } = useClientStateTopClients()




  const prodLast30DaysXYCartOption: ApexOptions = {
    series: [
      {
        name: 'Productions',
        data: prodLast30DaysXY
      },
    ],
    xaxis: {
      type: 'category',
      labels: {
        formatter: (val) => moment(new Date(val)).format("DD-MMM-YY"),
        showDuplicates: false,
      }
    },
  }

  const prodCurrentMonthXYOption: ApexOptions = {
    series: [
      {
        name: 'Productions',
        data: prodCurrentMonthXY
      },
    ],
    xaxis: {
      type: 'category',
      labels: {
        formatter: (val) => moment(new Date(val)).format("DD-MMM-YY"),
        showDuplicates: false,
      }
    },
  }
  const invLast30DaysXYOptions: ApexOptions = {
    series: [
      {
        name: 'Productions',
        data: invLast30DaysXY
      },
    ],
    xaxis: {
      type: 'category',
      labels: {
        formatter: (val) => moment(new Date(val)).format("DD-MMM-YY"),
        showDuplicates: false,
      }
    },
  }
  const payLast30DaysXYOptions: ApexOptions = {
    series: [
      {
        name: 'Productions',
        data: payLast30DaysXY
      },
    ],
    xaxis: {
      type: 'category',
      labels: {
        formatter: (val) => moment(new Date(val)).format("DD-MMM-YY"),
        showDuplicates: false,
      }
    },
  }


  const topOverView = [
    {
      title: "Production Last 30 Days ",
      value: prodLast30DaysTotal ? numberWithCommas(prodLast30DaysTotal) : 0,
      icon: <ChartBarIcon />,
      chart: <ChartComponent chartOptions={prodLast30DaysXYCartOption} />,
    },
    {
      title: "Production Current Month",
      value: prodCurrentMonthTotal
        ? numberWithCommas(prodCurrentMonthTotal)
        : 0,
      icon: <CalendarDaysIcon />,
      chart: <ChartComponent chartOptions={prodCurrentMonthXYOption} />,
    },
    {
      title: "Invoice Last 30 Days ",
      value: invLast30DaysTotal
        ? numberWithCommas(invLast30DaysTotal)
        : 0,
      icon: <DocumentArrowUpIcon />,
      chart: <ChartComponent chartOptions={invLast30DaysXYOptions} />,
    },
    {
      title: "Payment Last 30 Days ",
      value: payLast30DaysTotal
        ? numberWithCommas(payLast30DaysTotal)
        : 0,
      icon: <CurrencyBangladeshiIcon />,
      chart: <ChartComponent chartOptions={payLast30DaysXYOptions} />,
    },
  ];

  const pieChartData = topClient.map((lineNo) => ({
    x: lineNo.Client_name,
    y: lineNo.amount,
  }));
const {mode} = useThemeState()
  const TopClientChartOptions: ApexOptions = {
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
      position: "right", // Set legend position to bottom
    },
  };
  const series = pieChartData.map((item) => item.y);
  return (
    <Layout title="Dashboard" backButton={false} >
      <section>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {topOverView.map((item, i) => (
            <div className="" key={item.title}>
              <OverviewCard
                title={item.title}
                value={item.value}
                icon={item.icon}
                index={i}
              >
                {item.chart && item.chart}
              </OverviewCard>
            </div>
          ))}
        </div>
      </section>
      <section
        className="
      grid gap-5 grid-cols-1 sm:grid-cols-2
       pt-3 "
      >
        <Card>
          {topClient ? (
            <ul>
              {topClient?.map((client, i) => (
                <li
                  className="py-2 cursor-pointer border-b-[1px] border-b-gray-500 "
                  key={i}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex">
                      <Link to={`/rbs/v2/clients/${client?.Client_id}/profile`}>
                        <div className="w-8 h-8 p-1 mr-3 bg-base rounded-full text-center align-middle font-semibold dark:text-black">
                          {client?.Client_name[0] || ''}
                        </div>
                      </Link>
                      <p>{client.Client_name}</p>
                    </div>
                    <p>{client.amount}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <TopClientLoading />
          )}
        </Card>
        <Card>
          {/* <ProductionChart data={prodLast30DaysXY} /> */}
          <Chart options={TopClientChartOptions} series={series} type="pie" height={'100%'} />
        </Card>
      </section>
    </Layout>
  );
}




