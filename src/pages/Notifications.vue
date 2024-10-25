<template>
  <card title="Notifications" sub-title="Documents pending for more than 24 hours">
    <div>
      <div class="row">
        <div class="col-md-12">

      <!-- Alert message -->
      <div v-if="courriers.length > 0" class="alert alert-danger alert-with-icon mt-3" data-notify="container">
        <span data-notify="icon" class="ti-bell"></span>
        <span>Some documents have not been received for more than 72 hours.</span>
      </div>

          <table class="table table-hover">
            <thead>
              <tr>
                <th>Date of Reception</th>
                <th>ID</th>
                <th>Name</th>
                <th>Sender</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="courrier in courriers" :key="courrier.id_courrier">
                <td>{{ courrier.date_reception }}</td>
                <td>
                  <router-link :to="{ name: 'Waiting document list', params: { id: courrier.id_courrier } }">
                    {{ courrier.id_courrier }}
                  </router-link>
                </td>
                <td>{{ courrier.nom_courrier }}</td>
                <td>{{ courrier.expediteur }}</td>
              </tr>
              <tr v-if="courriers.length === 0">
                <td colspan="4" class="text-center">No documents pending for more than 72 hours.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </card>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      courriers: [],
      departementId: '',
      user: null,
    };
  },
  mounted() {
    this.getCourriersAlert();
  },
  methods: {
    async getCourriersAlert() {
      try {
        // Get user information
        const userResponse = await axios.get('http://localhost:8081/api/utilisateur', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.user = userResponse.data;
        if (!this.user) {
          console.error("User data is missing");
          return;
        }

        // Get department ID
        const responsedept = await axios.get(`http://localhost:8081/api/departement/utilisateur/${this.user.id_utilisateur}`);
        this.departementId = responsedept.data;

        // Get alert couriers for the department
        const response = await axios.get(`http://localhost:8081/api/departement/${this.departementId}/alerte`);
        this.courriers = response.data;

      } catch (error) {
        console.error("Error retrieving alert couriers:", error);
      }
    },
  },
};
</script>

<style scoped>
.alert-with-icon {
  display: flex;
  align-items: center;
}

.alert-with-icon .ti-bell {
  font-size: 1.5rem;
  margin-right: 10px;
}

.table-hover tbody tr:hover {
  background-color: #f5f5f5;
}
</style>
