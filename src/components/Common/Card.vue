<template>
  <div class="w-full lg:w-1/4">
    <div
      class="widget w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
    >
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-col">
          <div class="text-xs uppercase font-light text-gray-500">
            {{ name }}
          </div>
          <div class="text-xl font-bold">{{ value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardCard",
  props: ["name", "value"],
};
</script>