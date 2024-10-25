<template>
  <div class="wrapper">
    <side-bar class="custom-sidebar">
      <template slot="links">
        <sidebar-link
          to="/adminboard/users"
          name="List of Users Not Approved"
          icon="ti-view-list-alt"
        />
        <sidebar-link
          to="/adminboard/insert_role"
          name="Insertion of Role"
          icon="ti-view-list-alt"
        />
        <sidebar-link
          to="/adminboard/insert_departement"
          name="Insertion of Departement"
          icon="ti-view-list-alt"
        />
        <sidebar-link
          to="/adminboard/list_role"
          name="List of Roles"
          icon="ti-view-list-alt"
        />
        <sidebar-link
          to="/adminboard/list_departement"
          name="List of Departements"
          icon="ti-view-list-alt"
        />
        
        <!-- Ajout du bouton Log Out ici -->
        <div class="sidebar-logout">
          <p-button type="danger" class="full-width-btn" @click.native.prevent="logout">
            <small>Log Out</small>
          </p-button>
        </div>
      </template>
    </side-bar>

    <div class="main-panel">
      <dashboard-content @click.native="toggleSidebar"></dashboard-content>
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
  width: 100%; 
  border-radius: 25px; 
  background-color: #d9534f; 
  color: white; 
  font-weight: bold; 
  transition: background-color 0.3s; 
}

.full-width-btn:hover {
  background-color: #c9302c; 
}

.sidebar-logout {
  margin-top: auto;
  padding: 20px;
}
</style>