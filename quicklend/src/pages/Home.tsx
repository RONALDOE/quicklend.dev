import Layout from "../components/Layout";
import ReactECharts, { ReactEChartsProps } from "../components/Piechart";
import { useEffect, useState } from "react";
import axios from 'axios'

//rueda

interface Data{
    noPagos: number | 0,
    pagos: number | 0,
    prestamosActivos:number | 0, 
    totalPrestado:number | 0,
    cantidadBorrowers:number | 0,
    gananciasDelMes:number | 0,
    pagosSemanales:number | 0,
    pagosDiarios:number| 0

}
export default function Home() {
  //      const option: ReactEChartsProps["option"] = {

  //         title: {
  //           left: 'center',
  //           top: 20,
  //           textStyle: {
  //             color: '#ccc'
  //           }
  //         },

  //         tooltip: {
  //           trigger: 'item'
  //         },

  //         visualMap: {
  //           show: false,
  //           min: 80,
  //           max: 600,
  //           inRange: {
  //             colorLightness: [0, 1]
  //           }
  //         },
  //         series: [
  //           {
  //             name: 'Access From',
  //             type: 'pie',
  //             radius: '55%',
  //             center: ['50%', '50%'],
  //             data: [
  //               { value: 335, name: 'Direct' },
  //               { value: 310, name: 'Email' },
  //               { value: 274, name: 'Union Ads' },
  //               { value: 235, name: 'Video Ads' },
  //               { value: 400, name: 'Search Engine' }
  //             ].sort(function (a, b) {
  //               return a.value - b.value;
  //             }),
  //             roseType: 'radius',
  //             label: {
  //               color: '#000'
  //             },
  //             labelLine: {
  //               lineStyle: {
  //                 color: '#000'
  //               },
  //               smooth: 0.2,
  //               length: 10,
  //               length2: 20
  //             },
  //             itemStyle: {
  //               color: '#c23531',
  //             },

  //             animationType: 'scale',
  //             animationEasing: 'elasticOut',
  //             animationDelay: function () {
  //               return Math.random() * 200;
  //             }
  //           }
  //         ]
  //       };

  const [stats, setStats] = useState<Data |null >(null)
  const [mounted, setIsMounted] = useState<boolean >(false)
  

  function formatNumberK(num: number) {
    if (num < 1000) {
      return num;
    } else if (num >= 1000 && num < 10000) {
      return (num / 1000).toFixed(1) + 'K';
    } else if (num >= 10000 && num < 100000) {
      return (num / 1000).toFixed(1) + 'K';
    } else if (num >= 100000 && num < 1000000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return (num / 1000).toFixed(2) + 'K';
    }
  }
  

  useEffect(()=>{
  const fetchData = async ()  =>{
    try{
      console.log(mounted)
      const response = await axios.get<Data>('http://localhost:3001/api/dashboard/stats')
      
      console.log(' data fetched successfully');
      setStats({...stats,...response.data})
      console.log(stats)
      setIsMounted(true)
        
    }catch(err){
      console.log(`Error Fetching The Data \n\n` +  err)
      return
    }
  }
  fetchData()
}, [mounted]
    )
    const chartValue = (stats?.noPagos || 0) + (stats?.pagos|| 0)
console.log((stats?.noPagos || 0) + (stats?.pagos|| 0))
  /*Pie Chart*/
  const optionPie: ReactEChartsProps["option"] = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
      selectedMode: false, // Disable legend selection
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "70%"],
        startAngle: 180, // Adjust the start angle
        label: {
          show: true,
          formatter(param) {
            // Correct the percentage
            return param.name + " (" + param.percent! * 2 + "%)";
          },
        },
        data: [
          { value: stats?.pagos, name: "Pagos" },
          { value: stats?.noPagos, name: "Sin Pagar" },
          {
            value: chartValue,
            itemStyle: {
              color: "none", // Stop the chart from rendering this piece
              decal: {
                symbol: "none",
              },
            },
            label: {
              show: false,
            },
          },
        ],
      },
    ],
  };

  /*Bar Chart*/
  const optionBar: ReactEChartsProps["option"] = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: [
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
        "Domingo",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        barWidth: "30rem",
        name: "Prestamos",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [320, 302, 301, 334, 390, 330, 320],
        itemStyle: {
          borderWidth: 1,
          borderType: "solid",
          color: "#2563eb",
        },
      },
      {
        name: "Pagos",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        itemStyle: {
          borderWidth: 1,
          borderType: "solid",
          color: "#bfdbfe",
        },
        data: [120, 132, 101, 134, 90, 230, 210],
      },
    ],
  };

  return (
    <Layout>
      <div className="container mx-auto  h-fit overflow-auto">
        <div className="h-fit overflow-auto">
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
            
            <div className="w-full rounded-lg bg-white px-4 py-5 shadow">
              <div className="truncate text-sm font-medium text-gray-500">
                Prestamos Activos
              </div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                {stats?.prestamosActivos}
              </div>
            </div>
            <div className="w-full rounded-lg bg-white px-4 py-5 shadow">
              <div className="truncate text-sm font-medium text-gray-500">
                Clientes
              </div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                {stats?.cantidadBorrowers}
              </div>
            </div>
            <div className="w-full rounded-lg bg-white px-4 py-5 shadow">
              <div className="truncate text-sm font-medium text-gray-500">
                Prestado
              </div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                {"$"+formatNumberK(Number(stats?.totalPrestado))}
              </div>
            </div>
            <div className="w-full rounded-lg bg-white px-4 py-5 shadow">
              <div className="truncate text-sm font-medium text-gray-500">
                Ganancias del mes
              </div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                { "$"+formatNumberK(Number(stats?.gananciasDelMes))}
              </div>
            </div>

            <div className="col-span-3 h-96 w-full rounded-lg bg-white px-4 py-5 shadow">
              <div className="truncate text-sm font-medium text-gray-500">
                Total Prestamos Activos
              </div>

              <ReactECharts option={optionBar} />
            </div>
            <div className="col-span-1 h-96 w-full rounded-lg bg-white px-4 py-5 shadow">
              <div className="truncate text-sm font-medium text-gray-500">
                Pagos del dia
              </div>

              <ReactECharts option={optionPie} />
            </div>

            <div className="col-span-full h-96 w-full rounded-lg bg-white px-4 py-5 shadow overflow-auto"></div>
            
          </div>
        </div>
      </div>
    </Layout>
  );
}
