<template>
  <span>
    <i v-if="type === -1" class="iconfont icon-files"></i>
    <i v-else-if="type === 0" class="iconfont icon-music"></i>
    <i v-else-if="type === 1" class="iconfont icon-video"></i>
    <i v-else-if="type === 2" class="iconfont icon-document"></i>
    <i v-else-if="type === 3" class="iconfont icon-picture"></i>
    <i v-else-if="type === 4" class="iconfont icon-other"></i>
  </span>
</template>

<script>
  export default {
    name: "Icon",
    props: {
      type: Number,
    }
  }
</script>

<style scoped>

</style>
