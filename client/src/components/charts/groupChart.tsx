import classNames from "classnames"
import Card from "../card/card"
import ChartComponent from "./Charts"
import * as React from 'react'
import _groupData from "../../utils/groupData"
import { ApexOptions } from "apexcharts"
import { numberWithCommas } from "../../utils/numberFormater"





const GroupChart = ({ chartData, title, height=250 }: { chartData: any, title: string, height?: number }) => {

   const [data, setData] = React.useState([])
   const [activeButton, setActiveButton] = React.useState<'day' | 'month' | 'year'>('month')

   React.useEffect(() => {
      const df = {
         day: 'DD-MMM-yy',
         month: "MMM-YY",
         year: "yyyy"
      }
      setData(_groupData(chartData, 'x', 'y', activeButton, df[activeButton]))
   }, [activeButton, chartData])

   const options: ApexOptions = {
      series: [
         {
            data: Object.values(data),
            name: 'Invoice'
         },
      ],

      chart: {
         type: 'bar',
         height: height | 250,
         background: undefined,
         toolbar: {
            show: false
         },
      },
      xaxis: {
         // categories: Object.values(data).map((item: { x: any; }) => item.x),
         // tickAmount: Object.values(data).length 
         type: "category"
         // labels: {
         //    formatter: (x) => moment(x).format('DD-MMM-YY')
         // }

      },

      yaxis: {
         labels: {
            show: false
         },
         title: {
            text: title,
            style: {
               fontSize: '20px'
            }
         }
      },
      tooltip: {
         y: {
            formatter: function (val: any) {
               return numberWithCommas(val);
            },
            title: {
               formatter: (seriesName: any) => seriesName,
            },
         },
      },
      // title: {
      //    text:`Total = ${numberWithCommas(_arrSum(Object.values(data), 'y'))}`
      // }
   };


   return (
      <Card className="my-3 relative">
         <div className="flex justify-end absolute right-5 z-10">
            <Button title="Day" onClick={() => setActiveButton('day')} active={Boolean(activeButton == 'day')} className="border-[0.1px] rounded-l-md" />
            <Button title="Month" onClick={() => setActiveButton('month')} active={Boolean(activeButton == 'month')} className="border-y-[0.1px]" />
            <Button title="Year" onClick={() => setActiveButton('year')} active={Boolean(activeButton == 'year')} className="border-[0.1px] rounded-r-md" />

         </div>
         {/* <h5>Total = {numberWithCommas(_arrSum(chartData, 'y'))} </h5> */}
         <ChartComponent chartOptions={options} />

      </Card>
   )
}

export default GroupChart
interface ButtonProps {
   onClick: () => void;
   title: string;
   active: boolean;
   className?: string
}

const Button = (props: ButtonProps) => {
   const { onClick, title, active, className = '' } = props
   return (
      <button onClick={onClick} className={classNames({
         "p-1 px-2 border-[0.1px] text-xs": true,
         "dark:bg-base-lt-dark bg-base-lt-light hover:bg-base-light dark:hover:bg-base-dark": !active,
         'bg-base-light dark:bg-base-dark': active,
         'border-gray-400': true,
      }) + className + ' border-gray-400'}
      >{title}</button>
   )
}