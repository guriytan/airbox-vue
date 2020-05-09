<template>
  <div class="preview-container">
    <el-card class="title-card" shadow="hover">
      <svg-icon icon-class="preview" class="title-icon"></svg-icon>
      <span class="title-header">预览</span>
    </el-card>
    <el-card class="content-card" shadow="hover" style="text-align: center">
      <img v-if="type === 3" :src="link" alt="" width="100%"/>
      <audio v-else-if="type === 0" :src="link" controls="controls"></audio>
      <video v-else-if="type === 1" :src="link" controls="controls"></video>
      <div v-else>不支持预览</div>
    </el-card>
  </div>
</template>

<script>
  import defaultSettings from "@/settings";

  export default {
    name: "Preview",
    data() {
      return {
        link: defaultSettings.baseAPI + '/file/' + this.$route.query.id,
        type: this.$route.query.type,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .preview-container {
    width: 90%;
    margin: auto;

    .title-card {
      margin-bottom: 20px;

      .title-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }

      .title-header {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
</style>
