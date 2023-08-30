import { ApexOptions } from "apexcharts";
import React from "react";
import Chart from "react-apexcharts";
import { useThemeState } from "../../store/themeStore";

interface Props {
  chartOptions?: ApexOptions
}

const ChartComponent: React.FC<Props> = ({ chartOptions }) => {

  const { mode } = useThemeState()

  const options: ApexOptions = {
    stroke: {
      curve: "smooth",
      width: 3,
    },
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      background: undefined,
      sparkline: {
        enabled: true,
      },
      height: 100
    },
    tooltip: {
      y: {
        formatter: undefined,
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },
    grid: {
      show: false
    },
    theme: {
      mode: mode == "Light" ? "dark" : 'light',
      palette: 'palette1',
      monochrome: {
        enabled: false,
        color: '#255aee',
        shadeTo: mode == "Light" ? "dark" : 'light',
        shadeIntensity: 0.65
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },

    // fill: {
    //   type: "gradient",
    //   gradient: {
    //     shadeIntensity: 1,
    //     opacityFrom: 0.7,
    //     opacityTo: 0.9,
    //     stops: [30, 100],
    //   },
    // },

    ...chartOptions


  }

  return (

    <Chart
      options={options}
      series={options.series}
      type={options?.chart?.type}
      height={options.chart?.height}
    />

  );
};

export default ChartComponent;






