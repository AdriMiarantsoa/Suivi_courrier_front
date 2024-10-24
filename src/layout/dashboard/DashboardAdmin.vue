<template>
  <div class="wrapper">
    <side-bar class="custom-sidebar"> <!-- Add a class to the sidebar -->
      <template slot="links">
        <sidebar-link
          to="/adminboard/insert_role"
          name="Insertion of role "
          icon="ti-view-list-alt"
        />
        <sidebar-link
        to="/adminboard/insert_departement"
        name="Insertion of departement "
        icon="ti-view-list-alt"
      />
      <sidebar-link
          to="/adminboard/users"
          name="List of users not approved "
          icon="ti-view-list-alt"
        />
      <sidebar-link
        to="/adminboard/list_role"
        name="List of roles "
        icon="ti-view-list-alt"
      />
      <sidebar-link
        to="/adminboard/list_departement"
        name="List of departements"
        icon="ti-view-list-alt"
      />
      
      <p-button type="danger" class="full-width-btn" @click.native.prevent="logout">
        <a>
          <small>Log out</small>
        </a>
      </p-button>

    </template>
      
      
    </side-bar>
    <div class="main-panel">
      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>
    </div>
  </div>
</template>
<script>
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    DashboardContent,
    MobileMenu,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    logout() {
      localStorage.clear("authToken");
      this.$router.push('/'); // Redirect to login page
      this.$toast.add({
        severity: 'success',
        summary: 'Déconnexion réussie',
        detail: 'Vous avez été déconnecté avec succès',
        life: 3000
      });
    }
  },
};
</script>

<style scoped>

.full-width-btn {
  width: 100%; /* Make the button full width */
  border-radius: 25px; /* Optional: Round the corners */
}
</style>