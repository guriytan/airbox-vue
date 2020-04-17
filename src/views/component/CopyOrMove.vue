<template>
  <el-dialog :title="title" :visible.sync="visible" width="25%" :before-close="handleClose">
    <el-tree ref="tree" :node-key="id" :props="defaultProps" accordion :load="loadNode" lazy highlight-current
             check-on-click-node>
    </el-tree>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" round>取 消</el-button>
        <el-button type="primary" round @click="submitRename">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  import {CopyOrMove, GetFolder} from "@/utils/request";

  export default {
    name: "CopyOrMove",
    props: {
      visible: Boolean,
      type: Number,
      id: String,
      index: Number,
      copy: Boolean,
      cid: String
    },
    computed: {
      title() {
        return this.copy ? "复制" : "移动"
      }
    },
    watch: {
      dialogId: function (val) {
        console.log(val)
        if (val !== 0) {
          this.node.childNodes = [];//把存起来的node的子节点清空，不然会界面会出现重复树！
          this.loadNode(this.node, this.resolve);//再次执行懒加载的方法
        }
      }
    },
    data() {
      return {
        dialogId: 0,
        defaultProps: {
          label: 'name',
          children: 'zones',
        },
        fid: "",
        node: [],
        resolve: []
      }
    },
    methods: {
      loadNode(node, resolve) {
        if (node.level === 0) {
          this.node = node
          this.resolve = resolve
          return resolve([{
            id: '0',
            name: '全部文件',
          }]);
        }
        this.fid = node.data.id
        GetFolder(node.data.id).then(res => {
          let data = []
          res.forEach(item => {
            data.push({id: item.ID, name: item.Name})
          });
          resolve(data)
        })
      },
      submitRename() {
        if (this.fid === this.id) {
          this.$message.warning("不能" + this.title + "自身")
          return
        }
        if (this.fid === '0') {
          this.fid = ''
        }
        if (!(!this.fid && typeof this.cid === 'undefined') && this.cid !== this.fid) {
          this.$emit("loading")
          CopyOrMove(this.type, this.id, this.fid, this.copy).then(() => {
            this.$notify.success({
              title: '成功',
              message: this.title + '成功',
            });
            this.$emit("unloading")
            if (!this.copy) {
              this.$emit("deleteData", this.index)
            }
          }).catch(() => {
            this.$emit("unloading")
          });
          this.handleClose()
        } else {
          this.$message.warning("不能" + this.title + "同一个文件夹")
        }
      },
      handleClose(done) {
        this.dialogId++
        this.$emit("hide")
      }
    }
  }
</script>

<style scoped>

</style>
