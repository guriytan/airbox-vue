<template>
  <el-dialog :title="title" :visible.sync="visible" width="30%" :before-close="handleClose">
    <el-input v-model="rename" placeholder="文件名" suffix-icon="el-icon-edit-outline"
              @keyup.enter.native="submitRename()">
    </el-input>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" round>取 消</el-button>
        <el-button type="primary" @click="submitRename()" round>确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  import {Update} from "@/utils/request";
  import {OperationTypeRename} from "@/utils/type";

  export default {
    name: "RenameDialog",
    props: {
      visible: Boolean,
      folder: Boolean,
      id: String,
      name: String,
      index: Number
    },
    computed: {
      title() {
        this.rename = this.name
        return this.folder ? "重命名文件夹" : "重命名文件"
      }
    },
    data() {
      return {
        rename: "",
      }
    },
    methods: {
      submitRename() {
        if (this.rename) {
          this.$emit("loading")
          Update(this.id, "0", this.rename, OperationTypeRename).then(() => {
            this.$notify.success({
              title: '成功',
              message: '重命名文件成功',
            });
            this.$emit("unloading")
            this.$emit("rename", this.index, this.rename)
          }).catch(() => {
            this.$emit("unloading")
          });
        }
        this.$emit("hide")
      },
      handleClose(done) {
        this.$emit("hide")
      }
    }
  }
</script>

<style scoped>

</style>
