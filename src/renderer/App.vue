<script setup lang="ts">
import Main from './components/Main.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

window.electron.ipcRenderer.send('message', 'Hello from App.vue!');
</script>

<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-header>
        <Header/>
      </el-header>
      <el-main>
        <Main/>
      </el-main>
      <el-footer>
        <Footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<style lang="scss">
html, body {
  height: 100%;
}

#app {
  height: 100%;
}
</style>
