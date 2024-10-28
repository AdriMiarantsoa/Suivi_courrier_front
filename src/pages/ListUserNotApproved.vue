<template>
  <div class="ged-container">
    <div class="card">
      <div class="card-header">
        <h3>Utilisateur en attente d'approbation</h3>
      </div>
      <div class="card-body">
        <div v-if="utilisateurlist.length === 0" class="empty-state">
          <i class="ti-folder empty-icon"></i>
          <p>Pas d'utilisateur en attente pour le moment.</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Departement</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="utilisateur in paginatedUsers" :key="utilisateur.id_utilisateur">
                <td>{{ utilisateur.nom_utilisateur }}</td>
                <td>{{ utilisateur.nom_departement }}</td>
                <td>{{ utilisateur.nom_role }}</td>
                <td>
                  <button class="btn btn-approve btn-space" @click="Approve(utilisateur)"><i class="ti-check"></i></button>
                  <button class="btn btn-delete btn-space" @click="DeleteUser(utilisateur)"><i class="ti-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination" v-if="utilisateurlist && utilisateurlist.length > 0">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
          <span>Page {{ currentPage }} sur {{ totalPages }}</span>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
        </div>

      </div>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        utilisateurlist: [],
        currentPage: 1,
        itemsPerPage: 5
      };
    },
    mounted() {
      this.getListUserNotApprove();
    },
    computed: {
      totalPages() {
        return Math.ceil(this.utilisateurlist.length / this.itemsPerPage);
      },
      paginatedUsers() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.utilisateurlist.slice(start, end);
      },
    },
    methods: {
        async getListUserNotApprove() {
            try {
                const response = await axios.get("http://localhost:8081/api/utilisateurs_non_approuves");
                this.utilisateurlist = response.data;
                console.log("Données du view :",this.utilisateurlist);
            } catch (error) {
          //      console.error(error);
            }
        },
        async Approve(utilisateur) {
            try {
                const response = await axios.put(`http://localhost:8081/api/approve/${utilisateur.id_utilisateur}`);
                console.log("update :",response.data);
                this.getListUserNotApprove();
            } catch (error) {
                console.error(error);
            }
        },
        async DeleteUser(utilisateur) {
            try {
                const response = await axios.delete(`http://localhost:8081/api/deleteUtilisateur/${utilisateur.id_utilisateur}`);
                console.log("delete :",response.data);
                this.getListUserNotApprove();
            } catch (error) {
                console.error(error);
            }
        },
        changePage(page) {
          if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
          }
        }
    }
  };
  </script>
  
  <style scoped>
  .ged-container {
    padding: 20px;
    background-color: #f5f5f5;
  }
  .card {
    background-color: #ffffff;
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  .card-header {
    color: #007BFF;
    padding: 15px 20px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .card-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  .card-body {
    padding: 20px;
  }
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #6c757d;
  }
  .empty-icon {
    font-size: 48px;
    margin-bottom: 20px;
  }
  .table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
  }
  .table th {
    background-color: #f8f9fa;
    border: none;
    padding: 12px;
    font-weight: 600;
    color: #495057;
  }
  .table td {
    background-color: #ffffff;
    border: none;
    padding: 12px;
    vertical-align: middle;
  }
  .table tbody tr {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); 
    transition: all 0.3s ease;
  }
  .table tbody tr:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .btn-approve {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .btn-approve:hover {
    background-color: #218838;
  }
  .btn-delete {
    background-color: #e01d0f;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .btn-delete:hover {
    background-color: #cc2014;
  }
  .btn-space {
    margin-right: 10px; 
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