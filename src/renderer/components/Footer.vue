<script setup lang="ts">
const infoUrl = "https://github.com/protosskai"
const openPage = () => {
  window.electron.openExternUrl(infoUrl)
}
</script>

<template>
  <div class="flex-center">
    <el-link type="primary" @click="openPage">protosskai</el-link>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/css/base.scss";
</style>