<template>
  <div class="folder-tool">
    <el-popover placement="bottom" width="320" v-model="visible">
      <el-input v-model="name" placeholder="文件名" suffix-icon="el-icon-folder-add"
                @keyup.enter.native="addFolder">
      </el-input>
      <div style="text-align: right; margin-top: 10px">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="addFolder()">确定</el-button>
      </div>
      <el-button slot="reference" type="primary" round>新建文件夹</el-button>
    </el-popover>
  </div>
</template>

<script>
  import {NewFile} from "@/utils/request";
  import {FileTypeFolder} from "@/utils/type";

  export default {
    name: "NewFolder",
    props: {
      fid: String
    },
    data() {
      return {
        visible: false,
        name: ""
      }
    },
    methods: {
      addFolder() {
        if (this.name) {
          this.$emit("loading")
          NewFile(this.name, this.fid, FileTypeFolder).then(() => {
            this.$notify.success({
              title: '成功',
              message: '添加文件夹成功',
            });
            this.name = ""
            this.$emit('loadData', this.fid)
            this.$emit("unloading")
          }).catch(() => {
            this.$emit("unloading")
          })
          this.visible = false
        }
      }
    }
  }
</script>

<style scoped>
  .folder-tool {
    float: right;
  }
</style>
