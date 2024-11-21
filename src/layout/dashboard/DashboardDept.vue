<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <!-- Afficher le lien notifications uniquement si notificationCount > 0 -->
        <template v-if="notificationCount > 0">
          <sidebar-link
            to="/board/notifications"
            name="notifications"
            icon="ti-bell"
          />
          <span class="notification-badge">{{ notificationCount }}</span>
        </template>

        <sidebar-link
          to="/board/departement/:id_departement/courriers"
          name="Courriers en attente"
          icon="ti-view-list-alt"
        />
        <sidebar-link
          to="/board/courriersRecu"
          name="Courriers reçus"
          icon="ti-view-list-alt"
        />
        <sidebar-link
          to="/board/etatCourrier"
          name="Etat d'un courrier"
          icon="ti-view-list-alt"
        />
        <sidebar-link
          to="/board/statistique"
          name="Statistique par an"
          icon="ti-view-list-alt"
        />
      </template>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content @click.native="toggleSidebar"></dashboard-content>
    </div>
  </div>
</template>

<style lang="scss">
.notification-badge {
  background-color: red;
  color: white; 
  border-radius: 30%;
  padding-top: 10px; 
  padding-right: 5px;
  padding-left: 3px;
  height: 30px;
  margin-left:48px; 
  margin-top: -50px;
  font-size: 0.8em; 
}
</style>
  <script>
  import TopNavbar from "./TopNavbar.vue";
  import DashboardContent from "./Content.vue";
  import MobileMenu from "./MobileMenu";

  import axios from 'axios';

  export default {
    components: {
      TopNavbar,
      DashboardContent,
      MobileMenu,
    },
    data() {
      return {
        notificationCount: 0,
        user:null,
        departement:'',
      };
    },
    mounted() {
      this.fetchNotificationCount();
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
      async fetchNotificationCount() {
        try {
          const response = await axios.get('http://localhost:8081/api/utilisateur', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`, 
            },
          });
          
          this.user = response.data; 
          if (!this.user) {
            console.error("User data is missing");
            return;
          }

          // Récupérer le département de l'utilisateur
          const responsedept = await axios.get(`http://localhost:8081/api/departement/utilisateur/${this.user.id_utilisateur}`);
          this.departement = responsedept.data;
          console.log("Données du département :", this.departement);
          
          // Récupérer le nombre de notifications pour le département
          const notificationResponse = await axios.get(`http://localhost:8081/api/notifications/${this.departement}`);
          this.notificationCount = notificationResponse.data; // Mettez à jour le compteur de notifications
        } catch (error) {
          console.error("Erreur lors de la récupération des notifications:", error);
        }
      },
    },
  };
  </script>
  
