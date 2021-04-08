<template>
  <div class="share-container">
    <el-col :offset="16">
      <el-card class="title-card" shadow="hover">
        <router-link :to="{path:'/'}">
          <img src="../../static/logo.png" class="logo" alt="">
        </router-link>
        <span class="title">分享文件</span>
      </el-card>
      <el-card class="share-card" shadow="hover" style="text-align: center">
        <div v-if="link">
          <div class="share-qr">
            <vue-qr :text="link" :margin="0" colorDark="#38025B" colorLight="#fff" :logoSrc="icon" :logoScale="0.28"
                    :size="250"></vue-qr>
          </div>
          <div class="button-container">
            <span class="item"><el-button type="primary" round @click="downloadFile">下载</el-button></span>
          </div>
        </div>
        <div class="outdated" v-else>
          <svg-icon icon-class="no-link" class="svg-icon"></svg-icon>
          <div class="tag">链接已过期</div>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
  import defaultSettings from "@/settings";
  import vueQr from "vue-qr";
  import {DecodeLink} from "@/utils/validate";

  export default {
    name: "Preview",
    components: {
      vueQr
    },
    data() {
      return {
        link: '',
        icon: require('../../static/logo.png'),
      }
    },
    mounted() {
      let share = DecodeLink(this.$route.query.link)
      if (share) {
        this.link = defaultSettings.baseAPI + "/info/share?link=" + share
      }
    },
    methods: {
      downloadFile() {
        let elemIF = document.createElement('iframe')
        elemIF.src = this.link;
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .share-container {
    margin: 50px;
    width: 40%;

    .title-card {
      margin-bottom: 20px;

      .logo {
        width: 48px;
        height: 48px;
        vertical-align: middle;
        margin-right: 12px;
      }

      .title {
        display: inline-block;
        margin: 0;
        color: #243E36;
        font-weight: 600;
        line-height: 50px;
        font-size: 20px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
      }
    }

    .share-card {
      padding: 20px;

      .share-qr {
        text-align: center;
      }

      .outdated {
        .svg-icon {
          width: 300px;
          height: 300px;
        }

        .tag {
          margin-top: 10px;
          color: #9b9b9b;
          line-height: 32px;
          font-weight: 300;
          font-size: 20px;
        }
      }

      .button-container {
        margin-top: 30px;

        .item {
          margin: 0 30px 0 30px;
          text-align: center;
        }
      }
    }
  }
</style>
