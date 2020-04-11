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
        <el-table :data="tableData" class="files-table" fit stripe max-height="450" v-loading="loading">
          <el-table-column prop="icon" label="" width="50">
            <template slot-scope="scope">
              <i :class="'iconfont icon-' + solveIcon()"></i>
            </template>
          </el-table-column>
          <el-table-column prop="Name" label="文件名" min-width="250" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-dropdown placement="bottom-end">
                <span class="el-dropdown-link">{{ scope.row.Name}}</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><i class="icons el-icon-download"></i>下载</el-dropdown-item>
                  <el-dropdown-item><i class="icons el-icon-share"></i>分享</el-dropdown-item>
                  <el-dropdown-item @click.native="showDialog(scope.row.ID, scope.row.Name)"><i
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
              <span>{{ convertSize(scope.row.Size) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Date" label="日期" min-width="120">
            <template slot-scope="scope">
              <span>{{ convertData(scope.row.UpdatedAt) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
    <el-dialog title="重命名文件" :visible.sync="dialogVisible" width="30%">
      <el-input v-model="targetName" placeholder="文件名" suffix-icon="el-icon-edit-outline"
                @keyup.enter.native="submitRename()">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="submitRename()" round>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import instance from "@/utils/request";
  import bytesToSize from "@/utils/capacity";

  export default {
    name: 'Type',
    data() {
      return {
        type: this.$route.params.id,
        // 重命名
        dialogVisible: false,
        targetID: "",
        targetName: "",
        loading: true, // 表格加载
        tableData: []
      }
    },
    mounted() {
      this.mountData()
    },
    methods: {
      solveType() {
        if (this.type === '0') {
          return '音乐'
        } else if (this.type === '1') {
          return '视频'
        } else if (this.type === '2') {
          return '文档'
        } else if (this.type === '3') {
          return '图像'
        } else {
          return '其他'
        }
      },
      solveIcon() {
        if (this.type === '0') {
          return 'music'
        } else if (this.type === '1') {
          return 'video'
        } else if (this.type === '2') {
          return 'document'
        } else if (this.type === '3') {
          return 'picture'
        } else {
          return 'other'
        }
      },
      mountData() {
        this.loading = true;
        instance.get("/panel/types?type=" + this.type).then(response => {
          this.tableData = [];
          response.files.forEach(item => {
            this.tableData.push(item)
          });
          this.loading = false;
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
          this.mountData()
        }).catch(() => {
          this.loading = false;
        })
      },
      convertSize(size) {
        return bytesToSize(size)
      },
      convertData(data) {
        return new Date(data).toLocaleString().replace(/\//g, "-")
      },
      showDialog(id, name) {
        this.targetID = id;
        this.targetName = name;
        this.dialogVisible = true
      },
      submitRename() {
        if (this.targetName) {
          this.loading = true;
          instance.post("/file/rename", {
            name: this.targetName,
            id: this.targetID
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '重命名文件成功',
              type: 'success'
            });
            this.mountData()
          }).catch(() => {
            this.loading = false;
          });
          this.targetName = "";
        }
        this.dialogVisible = false
        this.targetID = ""
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
