<template>
  <el-dialog title="分享文件" :visible.sync="visible" width="30%" :before-close="handleClose">
    <div class="share-qr">
      <vue-qr :text="link" :margin="0" colorDark="#38025B" colorLight="#fff"
              :logoSrc="icon" :logoScale="0.28" :size="150"></vue-qr>
    </div>
    <div class="share-link">
      <span @click="copy()" style="cursor: pointer" title="点击复制">{{ link }}</span>
    </div>
  </el-dialog>
</template>

<script>
  import vueQr from 'vue-qr'

  export default {
    name: "ShareLink",
    components: {
      vueQr
    },
    props: {
      link: String,
      visible: Boolean,
    },
    data() {
      return {
        icon: require('../../../static/logo.png'),
      }
    },
    methods: {
      copy() {
        this.$copyText(this.link).then(() => {
          this.$message.success("已复制到剪切板");
        }, err => {
          console.log(err)
        })
      },
      handleClose(done){
        this.$emit("hide")
      }
    }
  }
</script>

<style lang="scss" scoped>
  .share-qr {
    text-align: center;
    margin-bottom: 20px;
  }

  .share-link {
    text-align: center;

    span {
      padding: 10px;
      font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;

      &:hover {
        color: #4A1969;
      }
    }
  }
</style>
