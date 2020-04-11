<template>
  <div class="files-container">
    <el-card class="title-card" shadow="hover">
      <svg-icon icon-class="files" class="title-icon"></svg-icon>
      <span class="title-header">我的文件</span>
    </el-card>
    <el-card class="content-card" shadow="hover">
      <el-card class="path-card">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <svg-icon icon-class="refresh" class="title-icon"></svg-icon>
          </el-breadcrumb-item>
          <el-breadcrumb-item><span @click="mountData()">全部文件</span></el-breadcrumb-item>
          <el-breadcrumb-item v-for="(path, index) in paths" :key="index" @click.native="mountData(path.ID)">
            {{ path.Name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <el-card class="files-card">
        <el-table :data="tableData" class="files-table" fit stripe max-height="450" v-loading="loading">
          <el-table-column prop="icon" label="" width="50">
            <template slot-scope="scope">
              <i v-if="typeof scope.row.Type === 'undefined'" class="iconfont icon-files"></i>
              <i v-if="scope.row.Type === 0" class="iconfont icon-music"></i>
              <i v-if="scope.row.Type === 1" class="iconfont icon-video"></i>
              <i v-if="scope.row.Type === 2" class="iconfont icon-document"></i>
              <i v-if="scope.row.Type === 3" class="iconfont icon-picture"></i>
              <i v-if="scope.row.Type === 4" class="iconfont icon-other"></i>
            </template>
          </el-table-column>
          <el-table-column prop="Name" label="文件名" min-width="250" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-dropdown v-if="typeof scope.row.Type === 'undefined'" placement="bottom-end">
                <span class="el-dropdown-link" @click="mountData(scope.row.ID)">{{ scope.row.Name}}</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="showDialog(scope.row.ID, scope.row.Name, 1)"><i
                    class="icons el-icon-edit"></i>重命名
                  </el-dropdown-item>
                  <el-dropdown-item divided @click.native="deleteFolder(scope.row.ID)"><i
                    class="icons el-icon-delete"></i>删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown v-else placement="bottom-end">
                <span class="el-dropdown-link">{{ scope.row.Name}}</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="downloadFile(scope.row.ID)"><i class="icons el-icon-download"></i>下载
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="getShare(scope.row.ID)"><i class="icons el-icon-share"></i>分享
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="showDialog(scope.row.ID, scope.row.Name, 2)"><i
                    class="icons el-icon-edit"></i>重命名
                  </el-dropdown-item>
                  <el-dropdown-item divided @click.native="deleteFile(scope.row.ID)"><i
                    class="icons el-icon-delete"></i>删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="Suffix" label="类型" min-width="80">
          </el-table-column>
          <el-table-column prop="Size" label="大小" min-width="80">
            <template slot-scope="scope">
              <span v-if="typeof scope.row.Type !== 'undefined'">{{ convertSize(scope.row.Size) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="UpdatedAt" label="日期" min-width="120">
            <template slot-scope="scope">
              <span>{{ convertData(scope.row.UpdatedAt) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-tool">
          <el-upload class="upload-tool" :file-list="fileList" action="null" :http-request="uploadFile" :limit="1"
                     :on-remove="handleRemove">
            <el-button type="success" round>点击上传</el-button>
          </el-upload>
          <div class="folder-tool">
            <el-popover placement="bottom" width="320" v-model="visible">
              <el-input v-model="folderName" placeholder="文件名" suffix-icon="el-icon-folder-add"
                        @keyup.enter.native="addFolder">
              </el-input>
              <div style="text-align: right; margin-top: 10px">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="addFolder()">确定</el-button>
              </div>
              <el-button slot="reference" type="primary" round>新建文件夹</el-button>
            </el-popover>
          </div>
        </div>
      </el-card>
    </el-card>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-input v-model="targetName" placeholder="文件名" suffix-icon="el-icon-edit-outline"
                @keyup.enter.native="submitRename()">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="submitRename()" round>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分享链接" :visible.sync="dialogShareVisible" width="30%">
      <div class="share-qr">
        <vue-qr :text="shareLink.url" :margin="0" colorDark="#38025B" colorLight="#fff"
                :logoSrc="shareLink.icon" :logoScale="0.4" :size="150"></vue-qr>
      </div>
      <div class="share-link">
        <span @click="copy()">{{ shareLink.url }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import vueQr from 'vue-qr'
  import defaultSettings from '@/settings'
  import service from "../utils/upload-request";
  import instance from "../utils/request";
  import axios from "axios"
  import bytesToSize from "../utils/capacity"

  export default {
    name: 'Files',
    components: {
      vueQr
    },
    data() {
      return {
        // 分享文件
        dialogShareVisible: false,
        shareLink: {
          url: "",
          icon: require('../../static/logo.png')
        },
        // 重命名
        dialogVisible: false,
        dialogTitle: "",
        targetID: "",
        targetName: "",
        targetType: 0,
        loading: true, // 表格加载
        visible: false, // 新建文件夹的显示
        folderName: "", // 新建文件夹名字
        folderID: "", // 当前文件目录ID
        fileList: [], // 上传文件列表
        tableData: [], // 表格数据
        paths: [], // 目录路径
        cancelToken: axios.CancelToken.source(), // 曲线上传
      }
    },
    mounted() {
      this.mountData()
    },
    methods: {
      uploadFile(file) {
        console.log(file);
        let url = "/file/upload?";
        if (this.folderID) {
          url += "fid=" + this.folderID + "&";
        }
        this.cancelToken = axios.CancelToken.source();
        let FormDatas = new FormData();
        FormDatas.append('file', file.file);
        service({
          url: url + 'size=' + file.file.size,
          method: 'post',
          data: FormDatas,
          cancelToken: this.cancelToken.token,
          //上传进度
          onUploadProgress: (progressEvent) => {
            let num = progressEvent.loaded / progressEvent.total * 100 | 0;  //百分比
            file.onProgress({percent: num})     //进度条
          }
        }).then(() => {
          this.$notify({
            title: '成功',
            message: '上传文件成功',
            type: 'success'
          });
          file.onSuccess(); //上传成功(打钩的小图标)
          this.mountData(this.folderID)
        }).catch(err => {
          this.$message({
            message: err,
            type: 'error'
          });
          file.onError(err)
        })
      },
      downloadFile(id) {
        let elemIF = document.createElement('iframe')
        elemIF.src = defaultSettings.baseAPI + '/file/download?id=' + id;
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      },
      handleRemove(file, fileList) {
        this.cancelToken.cancel('Operation canceled by the user.');
      },
      mountData(path) {
        this.loading = true;
        let url = "/panel/files";
        if (path) {
          url += "?fid=" + path;
          this.folderID = path;
        } else {
          this.folderID = "";
        }
        instance.get(url).then(response => {
          this.tableData = [];
          response.folders.forEach(item => {
            this.tableData.push(item)
          });
          response.files.forEach(item => {
            this.tableData.push(item)
          });
          this.paths = [];
          if (path) {
            response.path.reverse();
            response.path.forEach(item => {
              this.paths.push(item)
            });
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },
      getShare(id) {
        instance.get("/file/get-link?id=" + id).then(response => {
          this.dialogShareVisible = true;
          console.log(response);
          this.shareLink.url = defaultSettings.baseAPI + "/share?f=" + response.link;
        })
      },
      addFolder() {
        if (this.folderName) {
          this.loading = true;
          instance.post("/folder/add", {
            name: this.folderName,
            fid: this.folderID
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '添加文件夹成功',
              type: 'success'
            });
            this.mountData(this.folderID)
          }).catch(() => {
            this.loading = false;
          });
          this.folderName = "";
          this.visible = false
        }
      },
      deleteFolder(id) {
        this.loading = true;
        instance.get("/folder/delete?id=" + id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除文件夹成功',
            type: 'success'
          });
          this.mountData(this.folderID)
        }).catch(() => {
          this.loading = false;
        })
      },
      deleteFile(id) {
        this.loading = true;
        instance.get("/file/delete?id=" + id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除文件成功',
            type: 'success'
          });
          this.mountData(this.folderID)
        }).catch(() => {
          this.loading = false;
        })
      },
      renameFile(id) {
        if (this.targetName) {
          this.loading = true;
          instance.post("/file/rename", {
            name: this.targetName,
            id: id
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '重命名文件成功',
              type: 'success'
            });
            this.mountData(this.folderID)
          }).catch(() => {
            this.loading = false;
          });
          this.targetName = "";
        }
      },
      renameFolder(id) {
        if (this.targetName) {
          this.loading = true;
          instance.post("/folder/rename", {
            name: this.targetName,
            id: id,
            fid: this.folderID
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '重命名文件夹成功',
              type: 'success'
            });
            this.mountData(this.folderID)
          }).catch(() => {
            this.loading = false;
          });
          this.targetName = "";
        }
      },
      convertSize(size) {
        return bytesToSize(size)
      },
      convertData(data) {
        return new Date(data).toLocaleString().replace(/\//g, "-")
      },
      showDialog(id, name, type) {
        this.targetID = id;
        this.targetName = name;
        if (type === 1) {
          this.targetType = 1;
          this.dialogTitle = "重命名文件夹"
        } else {
          this.targetType = 2;
          this.dialogTitle = "重命名文件"
        }
        this.dialogVisible = true
      },
      submitRename() {
        if (this.targetType === 1) {
          this.renameFolder(this.targetID)
        } else {
          this.renameFile(this.targetID)
        }
        this.dialogVisible = false
        this.targetID = ""
      },
      copy() {
        this.$copyText(this.shareLink.url).then(() => {
          this.$message({
            message: '已复制到剪切板',
            type: 'success'
          });
        }, err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icons {
    font-size: 15px;
    margin-right: 10px;
  }

  .files-container {
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
      .path-card {
        margin-bottom: 20px;
      }

      .files-card {
        .files-table {
          width: 100%;
          margin-bottom: 20px;
        }

        .content-tool {
          position: relative;
          padding: 10px;

          .upload-tool {
            float: left;
            margin-bottom: 20px;
          }

          .folder-tool {
            float: right;
          }
        }
      }
    }

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
  }
</style>
