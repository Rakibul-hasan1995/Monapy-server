/* eslint-disable react-hooks/exhaustive-deps */
import { BanknotesIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import OverviewCard from "../../../components/card/overviewCard";
import * as React from 'react'
import { useParams } from "react-router-dom";
import { numberWithCommas } from "../../../utils/numberFormater";
import ChartComponent from "../../../components/charts/Charts";
import { ApexOptions } from "apexcharts";
import ClientServices, { Statement } from "../../../services/api/clientServices";
import moment from "moment";
import GroupChart from "../../../components/charts/groupChart";


export default function ClientProfile() {
   const activePage = useParams()
   const client_id = activePage._id

   const [invoiceChartData, setInvoiceChartData] = React.useState([{ x: new Date().toLocaleString(), y: 0 }])
   const [paymentChartData, setPaymentChartData] = React.useState([{ x: new Date().toLocaleString(), y: 22 }])
   const [statement, setStatement] = React.useState<Statement>()

   React.useEffect(() => {
      if (client_id) {
         getData(client_id)
      }
   }, [client_id])

   const getData = async (_id: string) => {
      const resData = await ClientServices.getStatementBy_id(_id)
      setStatement(resData)
      const payData = resData.data.filter((item) => item.credit !== 0)
      const invData = resData.data.filter((item) => item.debit !== 0)

      const invXy = invData.map((item) => {
         return {
            x: item.date.toLocaleString(),
            y: item.debit
         }
      })

      const payXy = payData.map((item) => {
         return {
            x: item.date.toLocaleString(),
            y: item.credit
         }
      })

      setPaymentChartData(payXy)
      setInvoiceChartData(invXy)
   }

   const invoiceChartOptions: ApexOptions = {
      series: [
         {
            name: 'invoice',
            data: invoiceChartData
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
   const paymentChartOptions: ApexOptions = {
      series: [
         {
            name: 'Payment',
            data: paymentChartData
         },
      ],
      xaxis: {
         type: 'datetime',
         labels: {
            formatter: (val) => moment(val).format("DD-MMM-YY"),
            showDuplicates: false,
         }
      },
   }

   const invPaymentChartOption: ApexOptions = {
      series: [
         {
            name: 'invoice',
            data: invoiceChartData
         },
         {
            name: 'Payment',
            data: paymentChartData
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

   return (
      <div className="">
         <section>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
               <OverviewCard
                  title={'Total Invoices'}
                  value={numberWithCommas(statement?.debitAmount)}
                  icon={<CurrencyDollarIcon />}
                  index={1}
               >
                  <ChartComponent chartOptions={invoiceChartOptions} />
               </OverviewCard>

               <OverviewCard
                  title={'Total Payments'}
                  value={numberWithCommas(statement?.creditAmount)}
                  icon={<BanknotesIcon />}
                  index={5}
               >
                  <ChartComponent chartOptions={paymentChartOptions} />
               </OverviewCard>

               <OverviewCard
                  title={'Total Deu'}
                  value={numberWithCommas(statement?.deuAmount)}
                  icon={<BanknotesIcon />}
                  index={2}
                  titleClass="text-red-500"
               >
                  <ChartComponent chartOptions={invPaymentChartOption} />
               </OverviewCard>
            </div>

         </section>

        <div className="grid grid-cols-2 gap-3">
        <GroupChart chartData={invoiceChartData} title={'Invoice'} />
        <GroupChart chartData={paymentChartData} title={'Payment'} />
        </div>
      </div>
   )
}



