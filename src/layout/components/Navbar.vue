<template>
  <div class="navbar">
    <div class="hamburger-container">
      <svg-icon icon-class="nav" class="hamburger" @click="toggleSideBar"/>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <i class="user-avatar el-icon-user"/>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/dashboard">
            <el-dropdown-item>
              <i class="icons el-icon-info"></i>用户信息
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <router-link to="/help"><el-dropdown-item><i class="icons el-icon-help"></i>帮助</el-dropdown-item></router-link>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;"><i class="icons el-icon-ice-cream-round"></i>注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      async logout() {
        await this.$store.dispatch('user/logout');
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icons {
    font-size: 17px;
    margin-right: 10px;
  }

  .navbar {
    height: 70px;
    overflow: hidden;
    position: relative;
    padding: 10px;

    .hamburger-container {
      padding: 0 15px;
      height: 100%;
      line-height: 46px;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      .hamburger {
        display: inline-block;
        vertical-align: middle;
        width: 30px;
        height: 30px;
      }

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          position: relative;
          padding-top: 5px;
          height: 50px;

          .user-avatar {
            cursor: pointer;
            color: white;
            font-size: 30px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            color: white;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
