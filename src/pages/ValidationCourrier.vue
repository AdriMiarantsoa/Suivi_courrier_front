<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div v-if="courriersEnAttente.length > 0" class="card-header">
            <h3>{{ table1.title }}</h3>
            <p>{{ table1.subTitle }}</p>
          </div>

          <div v-if="errors" class="alert alert-danger">
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </div>

          <div class="card-body table-responsive">
            <table class="table" v-if="courriersEnAttente.length > 0">
              <thead>
                <tr>
                  <th v-for="column in tableColumns" :key="column">{{ column }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="courrier in currentItems" :key="courrier.id_courrier">
                  <td>{{ courrier.id_courrier }}</td>
                  <td>{{ courrier.date_reception }}</td>
                  <td>{{ courrier.nom_courrier }}</td>
                  <td class="description">{{ courrier.description }}</td>
                  <td>{{ courrier.expediteur }}</td>
                  <td>
                    <span v-if="courrier.dept_destinataire && courrier.dept_destinataire.nom_departement">
                      {{ courrier.dept_destinataire.nom_departement }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-confirm" @click="confirmCourrier(courrier)"><i class="ti-check"></i></button>
                      <button class="btn btn-update" @click="showUpdateForm(courrier)"><i class="ti-pencil"></i></button>
                    </div>
                  </td>
                </tr>
                </tbody>
            </table>

            <div v-else class="empty-state">
              <i class="ti-clipboard  empty-icon"></i>
                <p>Plus de courrier en attente d'enregistrement</p>
            </div>

            <div class="pagination" v-if="courriersEnAttente && courriersEnAttente.length > 0">
              <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
              <span>Page {{ currentPage }} sur {{ totalPages }}</span>
              <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Formulaire de mise à jour en tant que modal -->
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <span class="close" @click="hideUpdateForm">&times;</span>
        <h3 style="color: #FF5733;">Rectification du Courrier</h3>
        <form @submit.prevent="submitUpdate">
          <div v-if="errors" class="alert alert-danger">
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </div>
          
          <div class="form-group">
            <label for="date_reception">Date de reception</label>
            <input type="date" id="date_reception" v-model="selectedCourrier.date_reception" required>
          </div>
          <div class="form-group">
            <label for="nom_courrier">Nom</label>
            <input type="text" id="nom_courrier" v-model="selectedCourrier.nom_courrier" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="selectedCourrier.description" rows="5" required></textarea>
          </div>
          <div class="form-group">
            <label for="expediteur">Expediteur</label>
            <input type="text" id="expediteur" v-model="selectedCourrier.expediteur" required>
          </div>
          <div class="form-group">
            <label for="dept_destinataire">Departement</label>
            <select id="dept_destinataire" v-model="selectedCourrier.dept_destinataire" required>
              <option value="" disabled selected>Select le department</option>
              <option v-for="dept in departements" :key="dept.id" :value="dept">{{ dept.nom_departement }}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-submit">Valider</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      courriersEnAttente: [],
      table1: {
        title: 'Tableau des courriers non enregistrés',
        subTitle: 'Listes des courriers en attente de confirmation'
      },
      errors: null,
      tableColumns: ["Id", "Date de reception", "Nom", "Description", "Expediteur", "Departement", "Actions"],
      showForm: false,
      selectedCourrier: {},
      departements: [],

      currentPage: 1,
        itemsPerPage: 5,
        totalItems: 0
    };
  },
  mounted() {
    this.getCourriersEnAttente();
    this.getDepartements();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    currentItems() {
      if (!this.courriersEnAttente) return [];
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.courriersEnAttente.slice(start, start + this.itemsPerPage);
    }
  },
  methods: {
    async getCourriersEnAttente() {
      try {
        const params = new URLSearchParams({
          page: this.currentPage,
          limit: this.itemsPerPage
        });

        const response = await axios.get(`http://localhost:8081/api/courriers_attente?${params}`);
        
        if (response.data) {
          this.courriersEnAttente = response.data;
          this.totalItems = response.data.length;
          console.log("Courriers chargés :", this.courriersEnAttente);
        } else {
          this.courriersEnAttente = [];
          this.totalItems = 0;
          console.log("Aucun courrier trouvé");
        }

      } catch (error) {
        console.error("Erreur lors du chargement des courriers :", error);
        this.courriersEnAttente = [];
        this.totalItems = 0;
        this.errors = ["Erreur lors du chargement des courriers"];
      }
    },
    async getDepartements() {
      try {
        const response = await axios.get("http://localhost:8081/api/departements");
        this.departements = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async confirmCourrier(courrier) {
      try {
        this.error = null;
        const response = await axios.put('http://localhost:8081/api/confirm_courrier', courrier);
        this.getCourriersEnAttente();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors;
        } else {
          this.errors = ["Une erreur est survenue"];
        }
      }
    },
    showUpdateForm(courrier) {
      console.log("showUpdateForm called with:", courrier);
      this.selectedCourrier = { ...courrier };
      this.showForm = true;
      console.log("showForm set to true");
    },
    hideUpdateForm() {
      this.showForm = false;
    },
    async submitUpdate() {
      if (!this.selectedCourrier.date_reception || !this.selectedCourrier.nom_courrier || !this.selectedCourrier.expediteur || !this.selectedCourrier.dept_destinataire) {
          this.errors = ["Veuillez remplir les champs nécessaires"];
          return;
      }
      try {
        const courrier = {
          id_courrier: this.selectedCourrier.id_courrier,
          date_reception: this.selectedCourrier.date_reception,
          nom_courrier: this.selectedCourrier.nom_courrier,
          description: this.selectedCourrier.description,
          expediteur: this.selectedCourrier.expediteur,
          statut:this.selectedCourrier.statut,
          dept_destinataire: this.selectedCourrier.dept_destinataire
        };
        this.errors = null;
        console.log("Données du formulaire :", courrier);
        const response = await axios.put(`http://localhost:8081/api/update_courrier/${this.selectedCourrier.id_courrier}`, courrier, {
        });
        console.log(response.data);
        this.hideUpdateForm();
        this.getCourriersEnAttente();
      } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
              this.errors = [error.response.data.message];
            } else if (error.response && error.response.data && error.response.data.errors) {
              this.errors = error.response.data.errors;
            } else {
              this.errors = ["une erreur a survenue"];
            }
      }
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return; // Vérifier les limites
      this.currentPage = page;
      this.getCourriersEnAttente();
    }
  },
  watch: {
    showForm(newVal) {
      console.log("showForm changed to:", newVal);
    }
  }
};
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 100px 80px;
  color: #6c757d;
}
.empty-icon {
  font-size: 100px;
  margin-bottom: 40px;
}
.card {
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,  0, 0.1);
  margin-bottom: 20px;
  padding: 15px; /* Ajout de padding pour un meilleur espacement */
}

.card-header {
  background-color: #343a40;
  color: rgb(17, 17, 17);
  padding: 15px;
  border-bottom: 1px solid #343a40;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.card-header h3 {
  margin: 0;
  color: rgb(5, 5, 5); 
}

.card-header p {
  margin: 0;
  font-size: 16px;
  color: #4c4c4d;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 12px; 
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tbody tr:hover {
  background-color: #f1f1f1;
}

td {
  word-wrap: break-word;
  max-width: 200px;
}

td.description {
  word-wrap: break-word;
  max-width: auto;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 15px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-confirm {
  background-color: #28a745;
  color: white;
}

.btn-update {
  background-color: #007BFF;
  color: white;
}

.btn-confirm:hover {
  background-color: #218838;
}

.btn-update:hover {
  background-color: #023c7a;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: rgba(245, 243, 243, 0.9);
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  height:400px;
  overflow-y: auto;
}

.close {
  color: #fff;
  background-color: #dc3545;
  border-radius: 50%;
  padding: 5px 10px;
  position: absolute;
  top: 20px;
  right: 10px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  background-color: #c82333;
  text-decoration: none;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.btn-submit {
  background-color: #28a745;
  color: white;
}

.btn-submit:hover {
  background-color: #218838;
}
/* Styles pour la pagination */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
}
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.pagination span {
  align-self: center;
  margin: 0 10px;
}
</style>