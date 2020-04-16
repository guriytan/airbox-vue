<template>
  <el-row class="container">
    <el-col :span="16">
      <div class="left-container">
        <div class="title"><span>忘记密码</span><a id="warning"></a></div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                 class="input-container">
          <el-form-item prop="user" label-width="0">
            <el-input v-model="ruleForm.user" placeholder="用户名或邮箱"></el-input>
          </el-form-item>
        </el-form>
        <div class="action-container">
          <el-col :span="18">
            <span @click="submitForm()">
              <a v-show="show">提交</a>
              <a v-show="!show" class="count">{{ count }} s</a>
            </span>
          </el-col>
          <el-col :span="6">
            <router-link to="register"><a>注册</a></router-link>
          </el-col>
        </div>
      </div>
    </el-col>
    <el-col :span="8" style="height:100%">
      <div class="right-container">
        <div class="register-container">
          <span><router-link to="login"><a>登录</a></router-link></span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import {ForgetPwd} from "@/utils/request";

  const TIME_COUNT = 60;

  export default {
    name: "Forget",
    data() {
      return {
        show: true,  // 初始启用按钮
        count: '',   // 初始化次数
        timer: null,
        ruleForm: {
          user: '',
        },
        rules: {
          user: [{
            required: true,
            message: '请输入用户名或邮箱',
            trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      submitForm() {
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
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            ForgetPwd(this.ruleForm.user).then(() => {
              this.$message({
                message: "若用户存在，系统将会发送重置密码链接至该用户邮箱",
                type: 'success'
              })
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/login.scss";
</style>
