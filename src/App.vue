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
        <!-- card component used to show the Operational and Non-Operational data -->
        <Card :name="`Operational`" :value="operationalCount" />
        <Card :name="`Non-Operational`" :value="nonOperationalCount" />
      </div>

      <div
        class="w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
      >
        <!-- Chart component use to show chart UI -->
        <!-- Added key for rerender the component -->
        <Chart :chartData="chartData" :key="rowId" />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Import section
 */
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
    /**
     * asset Data
     * [*] Default data represent at the beginning
     */
    const assetData = reactive({
      isLoading: false,
      rowId: 0,
      limit: 50,
      operationalCount: 0,
      nonOperationalCount: 0,
      chartData: {},
    });

    onMounted(async () => {
      /**
       * Checking localStorage
       * 1> check the data is exist in localStorage,
       *  1.1> if yes data will be added to  asset Data and call the api endpoint with last row id
       *
       * 2 > if not api endpoint will trigger with defult value
       */
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

    /**
     * Recursive funtions
     * Recursivley call the api endpoint till return empty array
     */
    const getAllAssetsFn = async (payload) => {
      try {
        let { data } = await GetAllAssets(payload);
        if (data.length > 0) {
          assetData.rowId = data[data.length - 1].__rowid__;
          filterFn(data);
          setTimeout(async () => {
            // setTimeout is for better UI
            let payload = {
              rowId: assetData.rowId,
              limit: assetData.limit,
            };
            await getAllAssetsFn(payload);
          }, 1000);
        } else {
          assetData.isLoading = false;
        }
      } catch (error) {
        console.log(error);
        assetData.isLoading = false;
      }
    };
    /**
     * Handling the count data and graph data
     */
    const filterFn = (data) => {
      for (let i = 0; i < data.length; i++) {
        operationalCountFn(data[i]);
        filterEquipmentTypeFn(data[i]);
      }
      localStorage.setItem("asset-data", JSON.stringify(assetData));
    };
    /**
     * Adding count to Operational and Non-Operational
     */
    const operationalCountFn = (data) => {
      data.OperationalStatus == "Operational"
        ? (assetData.operationalCount = assetData.operationalCount + 1)
        : (assetData.nonOperationalCount = assetData.nonOperationalCount + 1);
    };
    /**
     * Adding count to Categories Types
     */
    const filterEquipmentTypeFn = (data) => {
      let chartData = { ...assetData.chartData };
      Object.prototype.hasOwnProperty.call(chartData, data.AssetCategoryID)
        ? (chartData[data.AssetCategoryID] =
            chartData[data.AssetCategoryID] + 1)
        : (chartData[data.AssetCategoryID] = 1);
      assetData.chartData = chartData;
    };
    /**
     * This fn is used Reset the default data and call the Api endpoint
     */
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
    /**
     * This fn is used fetch latest data from the api endpoint
     */
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