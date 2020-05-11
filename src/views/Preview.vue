<template>
  <div class="preview-container">
    <el-card class="title-card" shadow="hover">
      <el-page-header @back="goBack" content="预览"></el-page-header>
    </el-card>
    <el-card class="content-card" shadow="hover" style="text-align: center">
      <img v-if="type === 3" :src="link" alt="" width="100%"/>
      <div v-else-if="type === 0">
        <svg-icon icon-class="no-link" class="svg-icon"></svg-icon>
        <audio :src="link" controls="controls" style="margin-top: 10px"></audio>
      </div>
      <video v-else-if="type === 1" :src="link" controls="controls"></video>
      <div v-else class="no-support">
        <svg-icon icon-class="no-link" class="svg-icon"></svg-icon>
        <div class="info">不支持预览</div>
      </div>
      <div class="button-container">
        <span class="item"><el-button type="primary" round @click="downloadFile">下载</el-button></span>
        <span class="item"><el-button type="warning" round @click="getShare">分享</el-button></span>
      </div>
    </el-card>
    <share-link :link="shareObj.link" :visible="shareObj.visible" @hide="hideShareDialog"></share-link>
  </div>
</template>

<script>
  import defaultSettings from "@/settings";
  import {GetShareLink} from "@/utils/request";
  import {EncodeLink} from "@/utils/validate";

  export default {
    name: "Preview",
    components: {
      ShareLink: () => import("@/views/component/ShareLink"),
    },
    data() {
      return {
        id: this.$route.query.id,
        link: defaultSettings.baseAPI + '/file/' + this.$route.query.id,
        type: this.$route.query.type,
        // 分享文件
        shareObj: {
          visible: false,
          link: ""
        },
      }
    },
    destroyed() {
      window.stop()
    },
    methods: {
      goBack() {
        this.$router.push({path: '/files', query: {fid: this.$route.query.fid}})
      },
      downloadFile() {
        let elemIF = document.createElement('iframe')
        elemIF.src = defaultSettings.baseAPI + '/file/' + this.id;
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      },
      getShare() {
        GetShareLink(this.id).then(response => {
          let link = EncodeLink(response.link)
          this.shareObj.visible = true;
          this.shareObj.link = defaultSettings.website + "#/share?link=" + link;
        })
      },
      hideShareDialog() {
        this.shareObj.visible = false
      },
    }
  }
</script>

<style lang="scss" scoped>
  .svg-icon {
    width: 300px;
    height: 300px;
  }

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

    .content-card {
      .no-support {
        .info {
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
