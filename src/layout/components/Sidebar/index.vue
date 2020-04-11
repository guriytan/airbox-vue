<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse"/>
    <sidebar :is-collapse="isCollapse"/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Logo from './Logo'
  import Sidebar from "./Sidebar";
  import FixiOSBug from './FixiOSBug'

  export default {
    components: { Logo, Sidebar},
    mixins: [FixiOSBug],
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      showLogo() {
        return this.$store.state.settings.sidebarLogo
      },
      showUser() {
        return this.$store.state.settings.sidebarUser
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    }
  }
</script>
