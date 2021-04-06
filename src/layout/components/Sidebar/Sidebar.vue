<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg"
             :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText"
             :collapse-transition="false" mode="vertical">
      <template>
        <app-link :to="'/dashboard'">
          <el-menu-item :index="'/dashboard'" class="submenu-title-noDropdown">
            <svg-icon icon-class="dashboard"/>
            <span slot='title'>Dashboard</span>
          </el-menu-item>
        </app-link>
      </template>
      <template>
        <app-link :to="'/files'">
          <el-menu-item :index="'/files'" class="submenu-title-noDropdown">
            <svg-icon icon-class="files"/>
            <span slot='title'>Files</span>
          </el-menu-item>
        </app-link>
      </template>
      <el-submenu ref="subMenu" :index="'/types'" popper-append-to-body>
        <template slot="title">
          <svg-icon icon-class="types"/>
          <span slot='title'>Types</span>
        </template>
        <app-link :to="'/type/1'">
          <el-menu-item :index="'/type/1'" class="nest-menu">
            <svg-icon icon-class="music"/>
            <span slot='title'>Music</span>
          </el-menu-item>
        </app-link>
        <app-link :to="'/type/2'">
          <el-menu-item :index="'/type/2'" class="nest-menu">
            <svg-icon icon-class="video"/>
            <span slot='title'>Video</span>
          </el-menu-item>
        </app-link>
        <app-link :to="'/type/3'">
          <el-menu-item :index="'/type/3'" class="nest-menu">
            <svg-icon icon-class="document"/>
            <span slot='title'>Document</span>
          </el-menu-item>
        </app-link>
        <app-link :to="'/type/4'">
          <el-menu-item :index="'/type/4'" class="nest-menu">
            <svg-icon icon-class="picture"/>
            <span slot='title'>Picture</span>
          </el-menu-item>
        </app-link>
        <app-link :to="'/type/0'">
          <el-menu-item :index="'/type/0'" class="nest-menu">
            <svg-icon icon-class="other"/>
            <span slot='title'>Other</span>
          </el-menu-item>
        </app-link>
      </el-submenu>
      <template>
        <app-link :to="'/help'">
          <el-menu-item :index="'/help'" class="submenu-title-noDropdown">
            <svg-icon icon-class="help"/>
            <span slot='title'>Help</span>
          </el-menu-item>
        </app-link>
      </template>
      <template>
        <app-link :to="'http://www.guriytan.cn'">
          <el-menu-item :index="'/link'" class="submenu-title-noDropdown">
            <svg-icon icon-class="link"/>
            <span slot='title'>External-Link</span>
          </el-menu-item>
        </app-link>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import AppLink from './Link'
  import variables from '@/styles/variables.scss'
  import FixiOSBug from './FixiOSBug'

  export default {
    name: "Sidebar",
    components: {AppLink},
    mixins: [FixiOSBug],
    props: {
      isCollapse: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      activeMenu() {
        const route = this.$route;
        const {meta, path} = route;
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      },
      variables() {
        return variables
      }
    }
  }
</script>

<style scoped>

</style>
