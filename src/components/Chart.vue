<template>
  <div ref="apexChartRef"></div>
</template>

<script>
/**
 * This component is represent the bar char
 * Bar chart data are come from parent component through props
 */
import { reactive, ref, onMounted, computed } from "vue";
import ApexCharts from "apexcharts";

export default {
  props: {
    chartData: {
      type: Object,
    },
  },
  setup(props) {
    const apexChartRef = ref(null);
    const chartData = reactive({
      chart: null,
      /**
       * Mauplating "props.chartData"
       * 1> Creating Y axis from "props.chartData"
       * 2> Creating X axis from "props.chartData"
       */
      options: computed(() => {
        return {
          series: [
            //Y axis
            {
              name: "Counts",
              data: Object.values(props.chartData),
            },
          ],
          chart: {
            height: 350,
            type: "bar",
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: "top",
              },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val;
            },
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#304758"],
            },
          },
          xaxis: {
            categories: Object.keys(props.chartData), //X axis
            position: "top",
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: true,
            },
            crosshairs: {
              fill: {
                type: "gradient",
                gradient: {
                  colorFrom: "#D8E3F0",
                  colorTo: "#BED1E6",
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
                },
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          yaxis: {
            axisBorder: {
              show: true,
            },
            axisTicks: {
              show: false,
            },
            labels: {
              show: true,
              formatter: function (val) {
                return val;
              },
            },
          },
          title: {
            text: "Equipment Type",
            floating: true,
            offsetY: 330,
            align: "center",
            style: {
              color: "#444",
            },
          },
        };
      }),
    });

    onMounted(() => {
      /**
       * Rendering Chart UI
       * 1 > Getting HTML Element "apexChartRef.value"
       * 2 > Adding  Chart data from "computed property"
       */
      chartData.chart = new ApexCharts(apexChartRef.value, chartData.options);
      chartData.chart.render();
    });

    return {
      apexChartRef,
    };
  },
};
</script>