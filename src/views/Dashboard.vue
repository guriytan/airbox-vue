<template>
  <div class="info-container">
    <el-card class="title-card" shadow="hover">
      <svg-icon icon-class="help" class="title-icon"></svg-icon>
      <span class="title-header">使用情况</span>
    </el-card>
    <el-row>
      <el-col :span="9">
        <el-card class="content-card" shadow="hover">
          <div class="info-title"><i class="icons el-icon-data-analysis"></i>文件明细情况</div>
          <ve-pie :data="files" :settings="chartSettings"></ve-pie>
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card class="content-card" shadow="hover">
          <div class="info-title"><i class="icons el-icon-pie-chart"></i>已使用/剩余容量</div>
          <ve-pie :data="total"></ve-pie>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card class="user-card" shadow="hover">
          <div class="info-title"><i class="icons el-icon-key"></i>用户信息</div>
          <div class="user-avatar">
            <img src="../assets/img/pikachu.png">
          </div>
          <div class="user-info">
            <div class="user-name">
              <span>用户：</span><span>{{ user.name }}</span>
            </div>
            <div>
              <span>邮箱：</span><span class="user-email" @click="dialogEmailVisible = true">{{ user.email }}</span>
            </div>
          </div>
          <div class="user-fix">
            <el-button type="warning" round @click="dialogPwdVisible = true">修改密码</el-button>
          </div>
          <div class="user-fix">
            <el-button type="danger" round @click="dialogUserVisible = true">注销账户</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="更换密码" :visible.sync="dialogPwdVisible" width="30%">
      <el-form :rules="rulesPwd" :model="formPwd" ref="formPwd">
        <el-form-item prop="oldPwd">
          <el-input type="password" v-model="formPwd.oldPwd" placeholder="原密码"></el-input>
        </el-form-item>
        <el-form-item prop="newPwd">
          <el-input type="password" v-model="formPwd.newPwd" placeholder="新密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPwdVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="submitResetPwd" round>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="更换邮箱" :visible.sync="dialogEmailVisible" width="30%">
      <el-form :model="formEmail" :rules="rulesEmail" ref="formEmail" class="input-container">
        <el-form-item prop="email">
          <el-input type="email" v-model="formEmail.email" placeholder="新邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="14">
            <el-form-item prop="code">
              <el-input type="text" v-model="formEmail.code" placeholder="验证码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <div class="post">
              <el-button @click="sendEmail" round>
                <span v-show="show">发送验证码</span>
                <span v-show="!show" class="count">{{ count }} s</span>
              </el-button>
            </div>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEmailVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="submitResetEmail" round>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="注销账户" :visible.sync="dialogUserVisible" width="30%">
      <div class="count-warning">
        <span><span style="color: #6D1FA3">请注意！</span>注销账号将删除所有在云端储存的文件以及用户记录！注销账户后可使用该用户名或该邮箱再次进行注册。</span>
      </div>
      <el-form :model="formUser" :rules="rulesUser" ref="formUser" class="input-container">
        <el-form-item>
          <el-col :span="14">
            <el-form-item prop="code">
              <el-input type="text" v-model="formUser.code" placeholder="验证码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <div class="post">
              <el-button @click="applyUnsubscribe" round>
                <span v-show="show">发送验证码</span>
                <span v-show="!show" class="count">{{ count }} s</span>
              </el-button>
            </div>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUserVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="unsubscribe" round>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {DeleteUser, GetUserInfo, ResetEmail, SendDeleteUser, SendResetEmail} from "@/utils/request";
  import {setToken} from "@/utils/auth";
  import {solveType} from "@/utils/type";

  const TIME_COUNT = 60;

  export default {
    name: "Dashboard",
    data() {
      return {
        show: true,  // 初始启用按钮
        count: '',   // 初始化次数
        timer: null,
        dialogUserVisible: false,
        dialogPwdVisible: false,
        dialogEmailVisible: false,
        chartSettings: {roseType: 'radius'},
        files: {
          columns: ['类型', '数量'],
          rows: []
        },
        total: {
          columns: ['容量', '大小'],
          rows: []
        },
        user: {
          name: "",
          email: ""
        },
        formEmail: {
          email: "",
          code: "",
        },
        formPwd: {
          id: "",
          newPwd: "",
          oldPwd: "",
        },
        formUser: {
          code: "",
        },
        rulesEmail: {
          email: [{
            type: 'email',
            required: true,
            message: '请输入新邮箱',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            message: '请输入邮箱验证码',
            trigger: 'blur'
          }]
        },
        rulesPwd: {
          oldPwd: [{
            required: true,
            message: '请输入原密码',
            trigger: 'blur'
          },
            {
              min: 6,
              max: 18,
              message: '长度在 6 到 18 个字符',
              trigger: 'blur'
            }
          ],
          newPwd: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
            {
              min: 6,
              max: 18,
              message: '长度在 6 到 18 个字符',
              trigger: 'blur'
            }
          ]
        },
        rulesUser: {
          code: [{
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted() {
      GetUserInfo().then(res => {
        if (res.count) {
          res.count.forEach(item => {
            this.files.rows.push({'类型': solveType(item.type), '数量': item.count})
          })
        }
        this.total.rows.push({'容量': '已使用容量', '大小': res.user_info.storage.current_size})
        this.total.rows.push({'容量': '剩余容量', '大小': (res.user_info.storage.max_size - res.user_info.storage.current_size)})
        this.formPwd.id = res.user_info.id;
        this.user.name = res.user_info.name;
        this.user.email = res.user_info.email;
      })
    },
    methods: {
      submitResetPwd() {
        this.$refs.formPwd.validate((valid) => {
          if (valid) {
            this.$store.dispatch('user/reset', this.formPwd).then(() => {
              this.$message({
                message: "重置密码成功",
                type: 'success'
              });
              this.dialogPwdVisible = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitResetEmail() {
        this.$refs.formEmail.validate((valid) => {
          if (valid) {
            ResetEmail(this.formPwd.id, this.formEmail.email, this.formEmail.code).then(res => {
              this.$message({
                message: "重置邮箱成功",
                type: 'success'
              });
              this.$store.dispatch('SET_TOKEN', res.token);
              setToken(res.token);
              this.dialogEmailVisible = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      sendEmail() {
        this.setTimer()
        SendResetEmail(this.formEmail.email, this.formEmail.password).then(() => {
          this.$message({
            message: "已发送验证码至邮箱",
            type: 'success'
          });
        })
      },
      applyUnsubscribe() {
        this.setTimer()
        SendDeleteUser().then(() => {
          this.$message({
            message: "已发送验证码至邮箱",
            type: 'success'
          });
        })
      },
      unsubscribe() {
        DeleteUser(this.formPwd.id, this.formUser.code).then(() => {
          this.$message({
            message: "已成功注销账户",
            type: 'success'
          });
          this.$store.dispatch('user/logout');
          this.$router.push({path: '/'})
        })
      },
      setTimer() {
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);  // 清除定时器
              this.timer = null;
            }
          }, 1000)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icons {
    font-size: 15px;
    margin-right: 10px;
  }

  .info-container {
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
      margin-right: 25px;

      .info-title {
        margin-bottom: 25px;
      }
    }

    .user-card {
      .user-avatar {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
      }

      .user-info {
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        margin-bottom: 30px;
        text-align: center;

        .user-name {
          margin-bottom: 10px;
        }

        .user-email:hover {
          color: #6D1FA3;
        }
      }

      .user-fix {
        text-align: center;
        margin-bottom: 20px;
      }
    }

    .input-container {
      .post {
        display: inline-block;
        height: 100%;
        text-align: center;
        position: relative;
        margin-left: 15%;
      }
    }

    .count-warning {
      text-align: center;
      font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
      font-size: 15px;
      margin-bottom: 30px;
    }
  }
</style>
