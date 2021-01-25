<template>
  <div ref="apexChartRef"></div>
</template>

<script>
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
      options: computed(() => {
        return {
          series: [
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
            categories: Object.keys(props.chartData),
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
      chartData.chart = new ApexCharts(apexChartRef.value, chartData.options);
      chartData.chart.render();
    });

    return {
      apexChartRef,
    };
  },
};
</script>