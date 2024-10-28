<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <a class="navbar-brand"  v-if="user" style="color:  rgb(1, 31, 65);">{{ user.nom_utilisateur }}</a>
      <button
        class="navbar-toggler navbar-burger"
        type="button"
        @click="toggleSidebar"
        :aria-expanded="$sidebar.showSidebar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
      </button>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link">
              <p class="nav-item" >{{ routeName }}</p>
            </a>
          </li>
          
          <li class="nav-item">
            <p-button type="danger" @click.native.prevent="logout">
              <a >
                <small>Deconnecter</small>
              </a>
            </p-button>
        </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import axios from 'axios';

export default {
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
  },
  data() {
    return {
      activeNotifications: false,
      user : null
    };
  },

  created() {
    this.fetchUserInfo();
  },
  methods: {
    async fetchUserInfo() {
      try {
        const response = await axios.get('http://localhost:8081/api/utilisateur', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include the JWT in the headers
          },
        });
        this.user = response.data; // Store the user data in the component's state
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    logout() {
      // this.$store.commit('clearUser'); // Call the clearUser mutation
      localStorage.clear("authToken");
      this.$router.push('/'); // Redirect to login page
    }
  },
};
</script>
<style></style>
