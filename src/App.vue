<template>
  <div class="min-h-screen w-full p-24 bg-gray-100">
    <div class="w-full mb-6 pt-3">
      <div class="flex flex-row items-center justify-between mb-4">
        <div class="flex flex-col">
          <div class="text-xs uppercase font-light text-gray-500">
            Equipment
          </div>
          <div class="text-xl font-bold">Dashboard</div>
        </div>
        <div class="flex-shrink-0 space-x-2">
          <button
            class="bg-blue-500 rounded-full font-bold text-white px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6"
            :disabled="isLoading"
            @click="resetFn"
          >
            {{ isLoading ? "Loading..." : "Reset" }}
          </button>
          <button
            class="bg-blue-500 rounded-full font-bold text-white px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6"
            :disabled="isLoading"
            @click="updateFn"
          >
            {{ isLoading ? "Loading..." : "Update" }}
          </button>
        </div>
      </div>
      <div
        class="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4"
      >
        <Card :name="`Operational`" :value="operationalCount" />
        <Card :name="`Non-Operational`" :value="nonOperationalCount" />
      </div>

      <div
        class="w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
      >
        <Chart :chartData="chartData" :key="rowId" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import Chart from "./components/Chart";
import Card from "./components/Common/Card";
import { GetAllAssets } from "./services/api-calls";

export default {
  name: "App",
  components: {
    Chart,
    Card,
  },
  setup() {
    const assetData = reactive({
      isLoading: false,
      rowId: 0,
      limit: 50,
      operationalCount: 0,
      nonOperationalCount: 0,
      chartData: {},
    });
    onMounted(async () => {
      if (localStorage.getItem("asset-data")) {
        let tmpassetData = JSON.parse(localStorage.getItem("asset-data"));
        assetData.rowId = tmpassetData.rowId;
        assetData.limit = tmpassetData.limit;
        assetData.operationalCount = tmpassetData.operationalCount;
        assetData.nonOperationalCount = tmpassetData.nonOperationalCount;
        assetData.chartData = tmpassetData.chartData;
      }
      let payload = {
        rowId: assetData.rowId,
        limit: assetData.limit,
      };
      await getAllAssetsFn(payload);
    });

    const getAllAssetsFn = async (payload) => {
      try {
        let { data } = await GetAllAssets(payload);
        if (data.length > 0) {
          assetData.rowId = data[data.length - 1].__rowid__;
          filterFn(data);
          setTimeout(async () => {
            let payload = {
              rowId: assetData.rowId,
              limit: assetData.limit,
            };
            await getAllAssetsFn(payload);
          }, 1000);
        } else {
          assetData.isLoading = false;
          console.log("Done");
        }
      } catch (error) {
        assetData.isLoading = false;
      }
    };

    const filterFn = (data) => {
      for (let i = 0; i < data.length; i++) {
        operationalCountFn(data[i]);
        filterEquipmentTypeFn(data[i]);
      }
      localStorage.setItem("asset-data", JSON.stringify(assetData));
    };

    const operationalCountFn = (data) => {
      data.OperationalStatus == "Operational"
        ? (assetData.operationalCount = assetData.operationalCount + 1)
        : (assetData.nonOperationalCount = assetData.nonOperationalCount + 1);
    };

    const filterEquipmentTypeFn = (data) => {
      let chartData = { ...assetData.chartData };
      Object.prototype.hasOwnProperty.call(chartData, data.AssetCategoryID)
        ? (chartData[data.AssetCategoryID] =
            chartData[data.AssetCategoryID] + 1)
        : (chartData[data.AssetCategoryID] = 1);
      assetData.chartData = chartData;
    };

    const resetFn = async () => {
      localStorage.removeItem("asset-data");
      assetData.rowId = 0;
      assetData.limit = 50;
      assetData.operationalCount = 0;
      assetData.nonOperationalCount = 0;
      assetData.chartData = {};

      let payload = {
        rowId: assetData.rowId,
        limit: assetData.limit,
      };
      assetData.isLoading = true;
      await getAllAssetsFn(payload);
    };
    const updateFn = async () => {
      assetData.isLoading = true;
      let payload = {
        rowId: assetData.rowId,
        limit: assetData.limit,
      };
      await getAllAssetsFn(payload);
    };

    return {
      ...toRefs(assetData),
      resetFn,
      updateFn,
    };
  },
};
</script>