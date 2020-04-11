<template>
  <el-row class="container">
    <el-col :span="16">
      <div class="left-container">
        <div class="title"><span>重置密码</span><a id="warning"></a></div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                 class="input-container">
          <el-form-item prop="password" label-width="0">
            <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
          </el-form-item>
        </el-form>
        <div class="action-container">
          <el-col :span="18">
            <span @click="submitForm()">提交</span>
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
  import instance from "@/utils/request";

  export default {
    name: "Reset",
    data() {
      return {
        token: this.$route.params.id,
        ruleForm: {
          password: '',
        },
        rules: {
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
        console.log('send!!');
      },
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            instance({
              url: '/user/reset-pwd?token=' + this.token,
              method: 'post',
              data: {password: this.ruleForm.password,}
            }).then(() => {
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
