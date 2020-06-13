<template>
  <el-row class="container">
    <el-col :span="16">
      <div class="left-container">
        <div class="title"><span>注册</span><a id="warning"></a></div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                 class="input-container">
          <el-form-item prop="username" label-width="0">
            <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="email" label-width="0">
            <el-input type="email" v-model="ruleForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label-width="0">
            <el-col :span="14">
              <el-form-item prop="code">
                <el-input type="text" v-model="ruleForm.code" placeholder="验证码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <div class="post">
                <span @click="send">
                  <a v-show="show">发送验证码</a>
                  <a v-show="!show" class="count">{{ count }} s</a>
                </span>
              </div>
            </el-col>
          </el-form-item>
          <el-form-item prop="password" label-width="0">
            <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
          </el-form-item>
        </el-form>
        <div class="action-container">
          <el-col :span="18">
            <span @click="submitForm()">提交</span>
          </el-col>
          <el-col :span="6">
            <router-link to="forget"><a>忘记密码</a></router-link>
          </el-col>
        </div>
      </div>
    </el-col>
    <el-col :span="8" style="height:100%">
      <div class="right-container">
        <div class="register-container">
          <span>
            <router-link to="login"><a>登录</a></router-link>
          </span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import {Register, SendRegister} from "@/utils/request";

  const TIME_COUNT = 60;

  export default {
    name: "Register",
    data() {
      return {
        show: true,  // 初始启用按钮
        count: '',   // 初始化次数
        timer: null,
        ruleForm: {
          username: '',
          email: '',
          code: '',
          password: '',
        },
        rules: {
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
            {
              min: 6,
              max: 18,
              message: '长度在 6 到 18 个字符',
              trigger: 'blur'
            }
          ],
          email: [{
            type: 'email',
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            message: '请输入邮箱验证码',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
            {
              min: 6,
              max: 18,
              message: '长度在 6 到 18 个字符',
              trigger: 'blur'
            }
          ]
        }
      };
    },
    methods: {
      send() {
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
        } else return
        SendRegister(this.ruleForm.username, this.ruleForm.email).then(() => {
          this.$message({
            message: "已发送验证码至邮箱",
            type: 'success'
          });
        })
      },
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            Register(this.ruleForm.username, this.ruleForm.password, this.ruleForm.email, this.ruleForm.code).then(() => {
              this.$message({
                message: "注册成功",
                type: 'success'
              });
              this.$router.push({path: '/login'})
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
