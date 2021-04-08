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
            <span @click="mountData(path.id, path.name, index)" class="click">{{ path.name }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <el-card class="files-card">
        <el-table :data="dataList" class="files-table" fit stripe max-height="450" v-loading="loading"
                  @sort-change='sortData' :default-sort="{prop: 'UpdatedAt', order: 'descending'}"
                  @selection-change="selectChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="icon" label="" width="50">
            <template slot-scope="scope">
              <icon :type="scope.row.type"></icon>
            </template>
          </el-table-column>
          <el-table-column prop="Name" label="文件名" min-width="250" show-overflow-tooltip sortable='custom'
                           :sort-orders="['ascending', 'descending']">
            <template slot-scope="scope">
              <el-dropdown placement="bottom-end">
                <span v-if="isFolder(scope.row.type)" class="el-dropdown-link click" @click="mountData(scope.row.id, scope.row.name, -1)">{{ scope.row.name }}</span>
                <span v-else class="el-dropdown-link click" @click="jump(scope.row)">{{ scope.row.name }}</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="!isFolder(scope.row.type)" @click.native="downloadFile(scope.row.id)"><i
                    class="icons el-icon-download"></i>下载
                  </el-dropdown-item>
                  <el-dropdown-item v-if="!isFolder(scope.row.type)" @click.native="getShare(scope.row.id)"><i
                    class="icons el-icon-share"></i>分享
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="showRenameDialog(scope.row.id, scope.$index, scope.row.name, isFolder(scope.row.type))"><i
                    class="icons el-icon-edit"></i>重命名
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="showFolderDialog(scope.row.id, scope.$index, isFolder(scope.row.type), 2)"><i
                    class="icons el-icon-copy-document"></i>复制到
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="showFolderDialog(scope.row.id, scope.$index, isFolder(scope.row.type))"><i
                    class="icons el-icon-scissors"></i>移动到
                  </el-dropdown-item>
                  <el-dropdown-item divided @click.native="deleteF(isFolder(scope.row.type), scope.$index, scope.row.id)"><i
                    class="icons el-icon-delete"></i>删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="Size" label="大小" min-width="100" sortable='custom'
                           :sort-orders="['ascending', 'descending']">
            <template slot-scope="scope">
              <span v-if="!isFolder(scope.row.type)">{{ convertSize(scope.row.size) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="UpdatedAt" label="日期" min-width="150" sortable='custom'
                           :sort-orders="['ascending', 'descending']">
            <template slot-scope="scope">
              <span>{{ convertDate(scope.row.updated_at) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-tool">
          <upload v-show="selectToggle" :fid="folderID" @loadData="mountData"></upload>
          <tools v-show="!selectToggle" :list="select" @loadData="mountData"></tools>
          <new-folder :fid="folderID" @loading="onLoading" @unloading="hideLoading"
                      @loadData="mountData"></new-folder>
        </div>
      </el-card>
    </el-card>
    <copy-or-move :visible="copyOrMoveObj.visible" :folder="copyOrMoveObj.folder" :id="copyOrMoveObj.id" :cid="folderID"
                  :index="copyOrMoveObj.index" :opt="copyOrMoveObj.opt" @loading="onLoading" @unloading="hideLoading"
                  @deleteData="deleteData" @hide="hideCopyOrMoveDialog"></copy-or-move>
    <rename-dialog :visible="renameObj.visible" :folder="renameObj.folder" :id="renameObj.id" :name="renameObj.name"
                   :index="renameObj.index" @loading="onLoading" @unloading="hideLoading" @rename="renameData"
                   @hide="hideRenameDialog"></rename-dialog>
    <share-link :link="shareObj.link" :visible="shareObj.visible" @hide="hideShareDialog"></share-link>
  </div>
</template>

<script>
  import defaultSettings from '@/settings'
  import Moment from 'moment'
  import {Delete, GetList, GetShareLink} from "@/utils/request";
  import bytesToSize from "@/utils/capacity"
  import {EncodeLink, GetDomain} from "@/utils/validate";
  import {FileTypeFolder, OperationTypeMove} from "@/utils/type";

  export default {
    name: 'Files',
    components: {
      ShareLink: () => import("@/views/component/ShareLink"),
      Icon: () => import("@/views/component/Icon"),
      RenameDialog: () => import("@/views/component/RenameDialog"),
      NewFolder: () => import("@/views/component/NewFolder"),
      Upload: () => import("@/views/component/Upload"),
      CopyOrMove: () => import("@/views/component/CopyOrMove"),
      Tools: () => import("@/views/component/Tools")
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
          folder: false,
          id: "",
          name: "",
          index: 0
        },
        // 移动或复制
        copyOrMoveObj: {
          visible: false,
          folder: false,
          id: "",
          index: 0,
          opt: 0
        },
        folderID: this.$route.query.fid || '0',
        dataList: [], // 表格数据
        paths: [], // 目录路径
        selectToggle: true,
        select: [] // 选择的文件列表
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
      mountData(fid, name, index) {
        this.onLoading();
        this.folderID = fid
        GetList(fid).then(res => {
          this.dataList = [];
          res.files.forEach(item => {
            this.dataList.push({
              id: item.id,
              type: item.type,
              name: item.name,
              size: item.file_info.size,
              updated_at: item.updated_at
            })
          });
          this.hideLoading();
        }).catch(() => {
          this.hideLoading();
        })
        if (index !== undefined) {
          if (index === -1) {
            this.paths.push({name: name, id: fid})
          } else {
            this.paths.length = index+1
          }
        } else if (fid === undefined) {
          this.paths.length = 0
        }
      },
      deleteF(type, index, id) {
        this.onLoading();
        Delete(id).then(() => {
          this.$notify.success({
            title: '成功',
            message: type ? '删除文件夹成功' : '删除文件成功',
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
          this.shareObj.link = GetDomain(document.URL) + "/#/share?link=" + link;
        })
      },
      showRenameDialog(id, index, name, folder) {
        this.renameObj.id = id;
        this.renameObj.index = index;
        this.renameObj.name = name;
        this.renameObj.folder = folder;
        this.renameObj.visible = true
      },
      showFolderDialog(id, index, isFolder, opt) {
        this.copyOrMoveObj.id = id;
        this.copyOrMoveObj.index = index;
        this.copyOrMoveObj.opt = opt || OperationTypeMove;
        this.copyOrMoveObj.folder = isFolder;
        this.copyOrMoveObj.visible = true
      },
      deleteData(index) {
        this.dataList.splice(index, 1)
      },
      renameData(index, name) {
        this.dataList[index].name = name
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
        return new Moment(date).format("YYYY-MM-DD hh:mm:ss")
      },
      jump(item) {
        this.$router.push({path: '/preview', query: {id: item.id, type: item.type, fid: this.folderID}})
      },
      sortData(column) {
        //获取字段名称和排序类型
        let fieldName = column.prop, sortingType = column.order;
        if (sortingType === "descending") {
          this.dataList = this.dataList.sort((a, b) => {
            let folder = this.judgeFolder(a, b)
            if (folder) return folder
            if (fieldName === "updated_at") {
              return new Date(b[fieldName]) - new Date(a[fieldName])
            } else {
              return b[fieldName] > a[fieldName] ? 1 : -1
            }
          });
        } else {
          this.dataList = this.dataList.sort((a, b) => {
            let folder = this.judgeFolder(a, b)
            if (folder) return folder
            if (fieldName === "updated_at") {
              return new Date(a[fieldName]) - new Date(b[fieldName])
            } else {
              return b[fieldName] < a[fieldName] ? 1 : -1
            }
          });
        }
      },
      judgeFolder(a, b) {
        if (this.isFolder(a.Type) && !this.isFolder(b.Type)) {
          return 1
        } else if (this.isFolder(b.Type) && !this.isFolder(a.Type)) {
          return -1
        } else return 0
      },
      selectChange(val) {
        if (val.length) {
          this.select = val
          console.log(val)
        } else {
          this.select.length = 0
        }
        this.selectToggle = !val.length
      },
      isFolder(type){
        return type === FileTypeFolder
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
