<template>
  <div class="files-container">
    <el-card class="title-card" shadow="hover">
      <svg-icon icon-class="types" class="title-icon"></svg-icon>
      <span class="title-header">{{ solveType() }}文件</span>
    </el-card>
    <el-card class="content-card" shadow="hover">
      <el-card class="path-card">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <svg-icon icon-class="refresh" class="title-icon"></svg-icon>
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">全部文件</el-breadcrumb-item>
          <el-breadcrumb-item>{{ solveType() }}文件</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <el-card class="files-card">
        <el-table :data="tableData" class="files-table" fit stripe max-height="450" v-loading="loading" v-el-table-infinite-scroll="loadMore">
          <el-table-column prop="icon" label="" width="50">
            <template slot-scope="scope">
              <i :class="'iconfont icon-' + solveIcon()"></i>
            </template>
          </el-table-column>
          <el-table-column prop="Name" label="文件名" min-width="250" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-dropdown placement="bottom-end">
                <span class="el-dropdown-link">{{ scope.row.name}}</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><i class="icons el-icon-download"></i>下载</el-dropdown-item>
                  <el-dropdown-item><i class="icons el-icon-share"></i>分享</el-dropdown-item>
                  <el-dropdown-item @click.native="showDialog(scope.row.id, scope.$index, scope.row.name)"><i
                    class="icons el-icon-edit"></i>重命名
                  </el-dropdown-item>
                  <el-dropdown-item divided @click.native="deleteFile(scope.$index, scope.row.id)"><i
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
              <span>{{ convertSize(scope.row.size) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Date" label="日期" min-width="120">
            <template slot-scope="scope">
              <span>{{ convertData(scope.row.updated_at) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
    <rename-dialog :visible="renameObj.visible" :folder="renameObj.folder" :id="renameObj.id" :name="renameObj.name"
                   :index="renameObj.index" @loading="onLoading" @unloading="hideLoading" @rename="renameData"
                   @hideDialog="hideRenameDialog"></rename-dialog>
  </div>
</template>

<script>
import {Delete, GetList, GetType} from "@/utils/request";
  import bytesToSize from "@/utils/capacity";
  import {FileTypeFolder, solveType, solveIcon} from "@/utils/type";
  import {RenameDialog} from "@/views/component";
  import elTableInfiniteScroll from 'el-table-infinite-scroll';

  export default {
    name: 'Type',
    components: {RenameDialog},
    directives: {
      'el-table-infinite-scroll': elTableInfiniteScroll
    },
    data() {
      return {
        type: this.$route.params.id,
        // 重命名
        renameObj: {
          visible: false,
          folder: false,
          id: "",
          name: "",
          index: 0
        },
        loading: true, // 表格加载
        tableData: [],
        pagination: {
          cursor: 0,
          limit: 10
        }
      }
    },
    // mounted() {
    //   this.mountData()
    // },
    methods: {
      solveType() {
        return solveType(this.type)
      },
      solveIcon() {
        return solveIcon(this.type)
      },
      mountData() {
        this.onLoading();
        GetType("", this.type, this.pagination.cursor, this.pagination.limit).then(res => {
          this.tableData.length = 0;
          res.files.forEach(item => {
            this.tableData.push(item)
            this.pagination.cursor = item.id
          });
          this.hideLoading();
        }).catch(() => {
          this.hideLoading();
        })
      },
      deleteFile(index, id) {
        this.onLoading();
        Delete(id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除文件成功',
            type: 'success'
          });
          this.tableData.splice(index, 1);
          this.hideLoading();
        }).catch(() => {
          this.hideLoading();
        })
      },
      renameData(index, name) {
        this.tableData[index].Name = name
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
      convertSize(size) {
        return bytesToSize(size)
      },
      convertData(data) {
        return new Date(data).toLocaleString().replace(/\//g, "-")
      },
      showDialog(id, index, name) {
        this.renameObj.id = id;
        this.renameObj.index = index;
        this.renameObj.name = name;
        this.renameObj.folder = FileTypeFolder;
        this.renameObj.visible = true
      },
      loadMore() {
        this.onLoading();
        GetType("", this.type, this.pagination.cursor, this.pagination.limit).then(res => {
          res.files.forEach(item => {
            this.tableData.push(item)
            this.pagination.cursor = item.id
          });
          this.hideLoading();
        }).catch(() => {
          this.hideLoading();
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
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
      }
    }
  }
</style>
