<template>
  <div class="upload-tool">
    <el-dropdown placement="bottom" class="upload-tool">
      <el-button type="success" round @click="clickFile()">上传文件</el-button>
      <input ref="file" type="file" @change.stop="changesFile" style="display: none">
      <!--      <el-upload ref="upload" action="null" :http-request="uploadFile" :on-remove="handleRemove" :show-file-list="showList">-->
      <!--        <el-button type="success" round>上传文件</el-button>-->
      <!--      </el-upload>-->
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item><span @click="clickFolder()">上传文件夹</span></el-dropdown-item>
        <input ref="folder" type="file" webkitdirectory @change.stop="changesFolder" style="display: none">
      </el-dropdown-menu>
    </el-dropdown>
    <div class="show-list" v-if="drawer">
      <el-button type="info" round @click="showDrawer = true">显示上传列表</el-button>
    </div>
    <el-drawer :visible.sync="showDrawer" direction="rtl" size="500px">
      <el-table :data="fileList" style="margin: auto">
        <el-table-column prop="file.name" label="文件名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="percentage" label="进度" width="75" header-align="center">
          <template slot-scope="scope">
            <el-progress type="dashboard" :percentage="scope.row.percentage" :color="customColors"
                         :width="width"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="" width="40">
          <template slot-scope="scope">
            <a href="javascript:void(0)" @click="cancelDownload(scope.row, scope.$index)">
              <i v-if="scope.row.status === 3" class="iconfont icon-error"></i>
              <i v-else-if="scope.row.status === 2" class="iconfont icon-success"></i>
              <i v-else class="iconfont icon-cancel"></i>
            </a>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
  import UploadFile from "@/utils/upload-request";
  import axios from "axios";

  export default {
    name: "Upload",
    props: {
      fid: ""
    },
    data() {
      return {
        width: 50,
        showDrawer: false,
        drawer: false,
        lock: false,
        fileList: [],
        cancelToken: axios.CancelToken.source(), // 取消上传
        customColors: [
          {color: '#DCDCDD', percentage: 20},
          {color: '#9AD5CA', percentage: 40},
          {color: '#D2E59E', percentage: 60},
          {color: '#81F495', percentage: 80},
          {color: '#96F550', percentage: 100}
        ]
      }
    },
    methods: {
      async uploadFile(fileList) {
        if (fileList.length === 0) {
          this.$message.warning("没有选择文件")
          return
        }
        for (let i = 0; i < fileList.length; i++) {
          this.fileList.push({
            file: fileList[i],
            name: fileList[i].name,
            percentage: 0,
            status: 0  // 0为等待上传，1为正在上传，2为上传完成，3为上传错误
          })
        }
        if (this.lock) {
          return;
        }
        this.drawer = this.showDrawer = this.lock = true
        for (const item of this.fileList) {
          if (item.status !== 0) {
            continue
          }
          try {
            item.status = 1
            await UploadFile(this.fid, item, this.cancelToken)
            item.status = 2
          } catch (err) {
            item.status = 3
            this.$message({
              message: err,
              type: 'error'
            });
          }
        }
        this.lock = false
        this.$notify.success({
          title: '成功',
          message: '上传文件成功',
        });
        this.$emit('loadData', this.fid)
      },
      cancelDownload(item, index) {
        if (item.status !== 1) {
          this.fileList.splice(index, 1)
        } else {
          this.cancelToken.cancel("Cancel by User.")
          this.fileList.splice(index, 1)
        }
      },
      changesFolder() {
        this.uploadFile(this.$refs.folder.files)
      },
      clickFolder() {
        this.$refs.folder.click()
      },
      changesFile() {
        this.uploadFile(this.$refs.file.files)
      },
      clickFile() {
        this.$refs.file.click()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .upload-tool {
    float: left;

    .show-list {
      float: left;
      margin-left: 10px
    }
  }
</style>
