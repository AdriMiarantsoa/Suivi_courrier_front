<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
       
        <sidebar-link
          to="/dashboard/document_register"
          name="Save Document "
          icon="ti-view-list-alt"
        />
    
        <sidebar-link
          to="/dashboard/document_validation"
          name="Document validation "
          icon="ti-view-list-alt"
        />

       </template>
      
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbar,
    DashboardContent,
    MobileMenu,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
