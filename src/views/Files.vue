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
            <svg-icon icon-class="refresh" class="title-icon click" @click="mountData(folderID)"></svg-icon>
          </el-breadcrumb-item>
          <el-breadcrumb-item><span @click="mountData()" class="click">全部文件</span></el-breadcrumb-item>
          <el-breadcrumb-item v-for="(path, index) in paths" :key="index">
            <span @click="mountData(path.ID)" class="click">{{ path.Name }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <el-card class="files-card">
        <el-table :data="dataList" class="files-table" fit stripe max-height="450" v-loading="loading">
          <el-table-column prop="icon" label="" width="50">
            <template slot-scope="scope">
              <icon :type="scope.row.Type"></icon>
            </template>
          </el-table-column>
          <el-table-column prop="Name" label="文件名" min-width="250" show-overflow-tooltip sortable>
            <template slot-scope="scope">
              <el-dropdown v-if="typeof scope.row.Type === 'undefined'" placement="bottom-end">
                <span class="el-dropdown-link click" @click="mountData(scope.row.ID)">{{ scope.row.Name }}</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="showRenameDialog(scope.row.ID, scope.$index, scope.row.Name, 0)"><i
                    class="icons el-icon-edit"></i>重命名
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="showFolderDialog(scope.row.ID, scope.$index, 0, true)"><i
                    class="icons el-icon-copy-document"></i>复制到
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="showFolderDialog(scope.row.ID, scope.$index, 0)"><i
                    class="icons el-icon-scissors"></i>移动到
                  </el-dropdown-item>
                  <el-dropdown-item divided @click.native="deleteF(0, scope.$index, scope.row.ID)"><i
                    class="icons el-icon-delete"></i>删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown v-else placement="bottom-end">
                <span class="el-dropdown-link click" @click="jump(scope.row)">{{ scope.row.Name }}</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="downloadFile(scope.row.ID)"><i class="icons el-icon-download"></i>下载
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="getShare(scope.row.ID)"><i class="icons el-icon-share"></i>分享
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="showRenameDialog(scope.row.ID, scope.$index, scope.row.Name, 1)"><i
                    class="icons el-icon-edit"></i>重命名
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="showFolderDialog(scope.row.ID, scope.$index, 1, true)"><i
                    class="icons el-icon-copy-document"></i>复制到
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="showFolderDialog(scope.row.ID, scope.$index, 1)"><i
                    class="icons el-icon-scissors"></i>移动到
                  </el-dropdown-item>
                  <el-dropdown-item divided @click.native="deleteF(1, scope.$index, scope.row.ID)"><i
                    class="icons el-icon-delete"></i>删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="Suffix" label="类型" min-width="80" sortable></el-table-column>
          <el-table-column prop="Size" label="大小" min-width="80" sortable>
            <template slot-scope="scope">
              <span v-if="typeof scope.row.Type !== 'undefined'">{{ convertSize(scope.row.Size) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="CreatedAt" label="日期" min-width="120" sortable>
            <template slot-scope="scope">
              <span>{{ convertDate(scope.row.CreatedAt) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-tool">
          <upload :fid="folderID" @loadData="mountData"></upload>
          <new-folder :fid="folderID" @loading="onLoading" @unloading="hideLoading"
                      @loadData="mountData"></new-folder>
        </div>
      </el-card>
    </el-card>
    <copy-or-move :visible="copyOrMoveObj.visible" :type="copyOrMoveObj.type" :id="copyOrMoveObj.id" :cid="folderID"
                  :index="copyOrMoveObj.index" :copy="copyOrMoveObj.copy" @loading="onLoading" @unloading="hideLoading"
                  @deleteData="deleteData" @hide="hideCopyOrMoveDialog"></copy-or-move>
    <rename-dialog :visible="renameObj.visible" :type="renameObj.type" :id="renameObj.id" :name="renameObj.name"
                   :index="renameObj.index" @loading="onLoading" @unloading="hideLoading" @rename="renameData"
                   @hide="hideRenameDialog"></rename-dialog>
    <share-link :link="shareObj.link" :visible="shareObj.visible" @hide="hideShareDialog"></share-link>
  </div>
</template>

<script>
  import defaultSettings from '@/settings'
  import {Delete, GetList, GetShareLink} from "@/utils/request";
  import bytesToSize from "@/utils/capacity"
  import {EncodeLink} from "@/utils/validate";

  export default {
    name: 'Files',
    components: {
      ShareLink: () => import("@/views/component/ShareLink"),
      Icon: () => import("@/views/component/Icon"),
      RenameDialog: () => import("@/views/component/RenameDialog"),
      NewFolder: () => import("@/views/component/NewFolder"),
      Upload: () => import("@/views/component/Upload"),
      CopyOrMove: () => import("@/views/component/CopyOrMove")
    },
    data() {
      return {
        loading: true, // 表格加载
        // 分享文件
        shareObj: {
          visible: false,
          link: ""
        },
        // 重命名
        renameObj: {
          visible: false,
          type: 0,
          id: "",
          name: "",
          index: 0
        },
        // 移动或复制
        copyOrMoveObj: {
          visible: false,
          type: 0,
          id: "",
          index: 0,
          copy: false
        },
        folderID: this.$route.query.fid || '',
        dataList: [], // 表格数据
        paths: [], // 目录路径
      }
    },
    mounted() {
      this.mountData()
    },
    methods: {
      downloadFile(id) {
        let elemIF = document.createElement('iframe')
        elemIF.src = defaultSettings.baseAPI + '/file/' + id;
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      },
      mountData(path) {
        this.onLoading();
        this.folderID = path
        GetList(path).then(res => {
          this.dataList = [];
          res.folders.forEach(item => {
            this.dataList.push(item)
          });
          res.files.forEach(item => {
            this.dataList.push(item)
          });
          this.paths.length = 0;
          if (path) {
            res.path.reverse();
            res.path.forEach(item => {
              this.paths.push(item)
            });
          }
          this.hideLoading();
        }).catch(() => {
          this.hideLoading();
        })
      },
      deleteF(type, index, id) {
        this.onLoading();
        Delete(type, id).then(() => {
          this.$notify.success({
            title: '成功',
            message: type === 0 ? '删除文件夹成功' : '删除文件成功',
          });
          this.deleteData(index)
          this.hideLoading();
        }).catch(() => {
          this.hideLoading();
        })
      },
      getShare(id) {
        GetShareLink(id).then(response => {
          let link = EncodeLink(response.link)
          this.shareObj.visible = true;
          this.shareObj.link = defaultSettings.website + "#/share?link=" + link;
        })
      },
      showRenameDialog(id, index, name, type) {
        this.renameObj.id = id;
        this.renameObj.index = index;
        this.renameObj.name = name;
        this.renameObj.type = type;
        this.renameObj.visible = true
      },
      showFolderDialog(id, index, type, copy) {
        this.copyOrMoveObj.id = id;
        this.copyOrMoveObj.index = index;
        this.copyOrMoveObj.copy = copy || false;
        this.copyOrMoveObj.type = type;
        this.copyOrMoveObj.visible = true
      },
      deleteData(index) {
        this.dataList.splice(index, 1)
      },
      renameData(index, name) {
        this.dataList[index].Name = name
      },
      onLoading() {
        this.loading = true
      },
      hideLoading() {
        this.loading = false
      },
      hideRenameDialog() {
        this.renameObj.visible = false
      },
      hideShareDialog() {
        this.shareObj.visible = false
      },
      hideCopyOrMoveDialog() {
        this.copyOrMoveObj.visible = false
      },
      convertSize(size) {
        return bytesToSize(size)
      },
      convertDate(date) {
        return new Date(date).toLocaleString().replace(/\//g, "-")
      },
      jump(item) {
        this.$router.push({path: '/preview', query: {id: item.ID, type: item.Type, fid: this.folderID}})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icons {
    font-size: 15px;
    margin-right: 10px;
  }

  .click {
    cursor: pointer;
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
          margin-bottom: 30px;
        }
      }
    }
  }
</style>
