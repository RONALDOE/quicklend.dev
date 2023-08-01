import Layout from "../components/Layout";
import ReactECharts, { ReactEChartsProps } from "../components/Piechart";

//rueda
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
          { value: 1048, name: "Pagos" },
          { value: 735, name: "Sin Pagar" },
          {
            value: 1048 + 735,
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
                Prestado
              </div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                NODATA
              </div>
            </div>
            <div className="w-full rounded-lg bg-white px-4 py-5 shadow">
              <div className="truncate text-sm font-medium text-gray-500">
                Prestamos Activos
              </div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                NODATA
              </div>
            </div>
            <div className="w-full rounded-lg bg-white px-4 py-5 shadow">
              <div className="truncate text-sm font-medium text-gray-500">
                Clientes
              </div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                NODATA
              </div>
            </div>
            <div className="w-full rounded-lg bg-white px-4 py-5 shadow">
              <div className="truncate text-sm font-medium text-gray-500">
                Ganancias del mes
              </div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                NODATA
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
