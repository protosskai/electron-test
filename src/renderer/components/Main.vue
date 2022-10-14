<script setup lang="ts">
import {ref} from "vue";

const loading = ref<boolean>(false);
const inputUrl = ref<string>("")
const percentage = ref<number>(100)
const showVideoSelectBar = ref<boolean>(false);
const showProgressBar = ref<boolean>(false)
const showDescBar = ref<boolean>(false);
const showDownloadButton = ref<boolean>(false);
const streamInfoList = ref<StreamInfo[]>([]);
const selectStreamInfoIndex = ref<number>(0);
const customColors = [
  {color: '#f56c6c', percentage: 20},
  {color: '#e6a23c', percentage: 40},
  {color: '#5cb87a', percentage: 60},
  {color: '#1989fa', percentage: 80},
  {color: '#6f7ad3', percentage: 100},
]
const parseStreamInfo = async (url: string): Promise<StreamInfo[]> => {
  return [
    {
      name: '测试1',
      url: 'http://www.baidu.com',
      streamType: 'video',
      quality: '1080p'
    },
    {
      name: '测试2',
      url: 'http://www.baidu.com',
      streamType: 'video',
      quality: '720p'
    },
    {
      name: '测试3',
      url: 'http://www.baidu.com',
      streamType: 'video',
      quality: '480p'
    },
    {
      name: '测试4',
      url: 'http://www.baidu.com',
      streamType: 'video',
      quality: '360p'
    },
  ]
}
const getStreamInfoShowName = (streamInfo: StreamInfo): string => {
  return `${streamInfo.streamType},${streamInfo.quality},${streamInfo.name}`
}
// 重置所有输入
const reset = () => {
  showDownloadButton.value = false;
  showProgressBar.value = false;
  showDescBar.value = false;
  showVideoSelectBar.value = false;
  inputUrl.value = '';
}
// 点击解析按钮，解析链接的所有媒体流
const confirmParseStreamInfo = async () => {
  loading.value = true;
  streamInfoList.value = await parseStreamInfo(inputUrl.value);
  loading.value = false;
  showVideoSelectBar.value = true;
  showDownloadButton.value = true;
  console.log(await window.electron.parseStreamInfo(inputUrl.value))
}
// 开始下载
const startDownload = async () => {
  showProgressBar.value = true;
  showDescBar.value = true;
  window.electron.downloadStream(streamInfoList.value[selectStreamInfoIndex.value].url)
}
</script>

<template>
  <div class="flex-center" v-loading="loading">
    <div class="input-area">
      <el-input v-model="inputUrl" placeholder="请输入链接" clearable/>
      <div v-if="showVideoSelectBar" class="video-select-bar">
        <el-form style="width: 90%">
          <el-form-item label="流选择: ">
            <el-select v-model="selectStreamInfoIndex" style="width: 100%">
              <el-option v-for="(item, index) in streamInfoList"
                         :key="item.name + index"
                         :label="getStreamInfoShowName(item)"
                         :value="index"/>
            </el-select>
          </el-form-item>
        </el-form>

      </div>
      <div class="option-btn-bar">
        <el-button @click="confirmParseStreamInfo">解析</el-button>
        <el-button type="danger" @click="reset">重置</el-button>
      </div>

      <div v-if="showProgressBar" class="progress-bar">
        <el-progress :percentage="percentage" :color="customColors"/>
      </div>
      <div v-if="showDescBar" class="desc-bar">
        <span>xxxxxx</span>
      </div>
      <div v-if="showDownloadButton" class="download-btn-bar">
        <el-button type="primary" @click="startDownload">开始下载</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/css/base.scss";

.input-area {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 100px 20px;

  .option-btn-bar {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .progress-bar {
    width: 100%;
    margin-top: 30px;
  }

  .desc-bar {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .video-select-bar {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .download-btn-bar {
    margin-top: 50px;
  }
}
</style>