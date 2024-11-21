<template>
    <div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 style="color:#007BFF;">Département : {{ this.departementName }}</h3>
            </div>  
            <div class="card-body table-responsive">
              <table class="table" v-if="courriersDepartement.length > 0">
                <thead>
                  <tr>
                    <th>Statut</th>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Expediteur</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="courrier in paginatedCourriers" :key="courrier.id_courrier">
                    <td>{{ courrier.statut === 'enregistre' ? 'en attente' : courrier.statut }}</td>
                    <td>{{ courrier.id_courrier }}</td>
                    <td>{{ courrier.nom_courrier }}</td>
                    <td>{{ courrier.expediteur }}</td>
                    <td>
                    <div class="btn-group">
                      <button class="btn btn-details" @click="ShowCourrier(courrier)">
                        <i class="ti-eye"></i> 
                        <span>Détails</span>
                      </button>                            
                    </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="empty-state">
                <i class="ti-folder empty-icon"></i>
                <p>Pas de document arrivé pour votre département</p>
              </div>

              <div class="pagination" v-if="courriersDepartement && courriersDepartement.length > 0">
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
          <span class="close" @click="hideDetails">&times;</span>
          <h2>Details du courrier</h2>
          <h3>Information du courrier</h3>
          <form @submit.prevent>
            <section>
              <div v-if="error_upload" class="alert alert-danger">
                <ul>
                  <li v-for="error in error_upload" :key="error">{{ error }}</li>
                </ul>
              </div>
              
              <div class="form-group" v-if="fichiers && fichiers.length > 0">
                <label for="fichiers">Fichiers associés</label>
                <div class="files-container" v-if="fichiers && fichiers.length > 0">
                  <div v-for="fichier in fichiers" :key="fichier.id" class="file-item">
                    <div v-if="isImage(fichier)">
                      <p>
                        <a :href="getFileUrl(fichier.chemin)" target="_blank">{{ fichier.chemin.split('/').pop() }}</a>
                        <img :src="getFileUrl(fichier.chemin)" alt="Image" style="max-width: 200px; max-height: 200px;" />
                      </p>
                    </div>
                    <div v-else-if="isPdf(fichier)">
                      <p><a :href="getFileUrl(fichier.chemin)" target="_blank">{{ fichier.chemin.split('/').pop() }}</a></p>
                      <embed :src="getFileUrl(fichier.chemin)" type="application/pdf" width="300" height="200" />
                    </div>
                    <div v-else>
                      <a :href="getFileUrl(fichier.chemin)" target="_blank">{{ fichier.chemin.split('/').pop() }}</a>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <p>Aucun fichier associé.</p>
                </div>
              </div>

              <div class="form-group">
                <label for="id">ID</label>
                <input type="text" v-model="id_courrier.id_courrier" readonly>
              </div>
              <div class="form-group">
                <label for="nom_courrier">Nom</label>
                <input type="text" v-model="id_courrier.nom_courrier" readonly>
              </div>
              <div class="form-group">
                <label for="expediteur">Expediteur</label>
                <input type="text" v-model="id_courrier.expediteur" readonly>
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" v-model="id_courrier.description" rows="5" readonly/>
              </div>    
            </section>
            <div class="btn-group">
              <p-button style="background-color:  #007BFF;" round @click.native.prevent="submitForm">
                Traité
              </p-button>
              <button v-if="departementName.toLowerCase() === 'direction'" class="btn btn-transfer" @click="ShowTransferForm(id_courrier)">Transferé
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Formulaire de transfert en tant que modal -->
      <div v-if="showTransferForm" class="modal">
        <div class="modal-content">
          <span class="close" @click="hideTransferForm">&times;</span>
          <h2>Transferé le courrier</h2>
          <form @submit.prevent>
            <section>
              <div class="form-group">
                <label for="id">ID</label>
                <input type="text" v-model="id_courrier.id_courrier" readonly>
              </div>
              <div class="form-group">
                <label for="nom_courrier">Nom</label>
                <input type="text" v-model="id_courrier.nom_courrier" readonly>
              </div>
              <div class="form-group">
                <label for="departement">Departement</label>
                <select v-model="selectedDepartement">
                  <option v-for="departement in departements" :key="departement.id_departement" :value="departement">{{ departement.nom_departement }}</option>
                </select>
              </div>
            </section>
            <div class="text-center">
              <p-button style="background-color:  rgb(231, 21, 21);" round @click.native.prevent="submitTransferForm">
                Valider
              </p-button>
            </div>

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
        courriersDepartement: [],
        departementName: '',
        departementId: '',
        recu_par:null,
        showForm: false,
        id_courrier: {},
        showTransferForm: false,

        fichiers: [],
        error_upload: null,

        selectedDepartement: null,
        departements: [],

        currentPage: 1,
        itemsPerPage: 5,
        totalItems: 0
      
      };
    },
    mounted() {
      this.getCourriersDepartement();
    },
    computed: {
      totalPages() {
        return Math.ceil(this.courriersDepartement.length / this.itemsPerPage);
      },
      paginatedCourriers() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.courriersDepartement.slice(start, end);
      }
    },
    methods: {
        isImage(fichier) {
          return fichier.chemin.endsWith('.png') || fichier.chemin.endsWith('.jpg') || fichier.chemin.endsWith('.jpeg') || fichier.chemin.endsWith('.gif');
        },
        isPdf(fichier) {
          return fichier.chemin.endsWith('.pdf');
        },
        getFileUrl(chemin) {
          return `http://localhost:8081/uploads/${chemin.split('/').pop()}`;
        },
        changePage(page) {
          if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
          }
        },
        async getCourriersDepartement() {
            try {
              const userresponse = await axios.get('http://localhost:8081/api/utilisateur', {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('authToken')}`, 
                },
              });
              this.recu_par = userresponse.data; 
              if (!this.recu_par) {
                console.error("User data is missing");
                return;
              }
              const responsedept = await axios.get(`http://localhost:8081/api/departement/utilisateur/${this.recu_par.id_utilisateur}`);
                this.departementId = responsedept.data;
                console.log('id_departement:', this.departementId);

              const deptresponse = await axios.get(`http://localhost:8081/api/departement/${this.departementId}`);
              this.departementName = deptresponse.data;
              console.log('nom_departement:', this.departementName)
            
              const response = await axios.get(`http://localhost:8081/api/departement/${this.departementId}/courriers`);
              console.log(response.data);
              this.courriersDepartement = response.data;
              
              this.currentPage = 1;
            } catch (error) {
            console.error(error);
            }
        },
        async ShowCourrier(courrier) {
            console.log("showUpdateForm called with:", courrier);
            this.id_courrier = { ...courrier };
            this.showForm = true;
            console.log("showForm set to true");

            // Récupérer les fichiers associés à ce courrier
            try {
              const response = await axios.get(`http://localhost:8081/api/courriers/${courrier.id_courrier}/fichiers`);
              this.fichiers = response.data; 

              console.log("Fichiers associés récupérés :", this.fichiers);

              } catch (error) {
              console.error("Erreur lors de la récupération des fichiers :", error);
              this.error_upload = ["Erreur lors de la récupération des fichiers"];
              this.selectedCourrier.fichiers = [];
            }
        },
      hideDetails() {
        this.showForm = false;
      },
      async submitForm() {
        console.log(this.id_courrier);
        console.log(this.recu_par);

        try {
          const response = await axios.get('http://localhost:8081/api/utilisateur', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`, 
            },
          });
          this.recu_par = response.data; 
          if (!this.recu_par) {
            console.error("User data is missing");
            return;
          }

          const receptionData = {
            id_courrier : this.id_courrier , 
            recu_par: this.recu_par, 
            date_traitement: new Date(), 
          };

          console.log("Sending Reception Data:", receptionData);

          await axios.post('http://localhost:8081/api/insert_reception', receptionData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`, 
            },
          });

          this.hideDetails();
          this.getCourriersDepartement();
        } catch (error) {
          console.error("Error during form submission:", error.response ? error.response.data : error.message);
        }
      },
      //transfer de courrier
      async ShowTransferForm(id_courrier) {
        console.log("ShowTransferFom");
        console.log("courrier:", id_courrier);
        this.hideDetails();

          this.id_courrier = { ...id_courrier };
          this.showTransferForm = true;
          console.log("showTransferForm set to true");
          
          try {
            const response = await axios.get('http://localhost:8081/api/departements');
            const allDepartements = response.data;
            console.log("alldept :",allDepartements);
            // Filtrer les départements pour exclure celui de l'utilisateur
            this.departements = allDepartements.filter(departement => 
              departement.nom_departement !== this.departementName
            );
            console.log("dept :",this.departements);
          } catch (error) {
            console.error(error);
          }
      },
        hideTransferForm() {
          this.showTransferForm = false;
        },
        async submitTransferForm() {
          console.log(this.id_courrier);
          console.log(this.selectedDepartement);
          try {
            const transferData = {
              id_courrier: this.id_courrier,
              departement: this.selectedDepartement,
              date_transfert: new Date(), 
            };
            console.log("Sending Transfer Data:", transferData);
            
            
          await axios.post('http://localhost:8081/api/insert_Transfert', transferData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`, 
            },
          });

            this.hideTransferForm();
            this.getCourriersDepartement();
          } catch (error) {
            console.error("Error during form submission:", error.response ? error.response.data : error.message);
          }
        },

    }
  };
  </script>
  
  <style scoped>
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #6c757d;
  }
  .empty-icon {
    font-size: 48px;
    margin-bottom: 20px;
  }
  .card {
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    height:max-content;
  }
  .card-header {
    background-color: #343a40;
    color: white;
    padding: 15px;
    border-bottom: 1px solid #343a40;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .card-header h3 {
    margin: 0;
    color:rgb(12, 12, 12);
    font-size: medium;
  }
  .card-body {
    padding: 20px;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  .table th, .table td {
    border: 1px solid #ddd;
    padding: 8px;
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
.table td:first-child {
  font-weight: 500;
  color: #6c757d;
}
  .btn {
    padding: 10px 15px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
  }
  .btn-details {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: #f8f9fa;
    color: #007BFF;
    border: 1px solid #007BFF;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.3s ease;
    min-width: 100px;
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
  }
  
  .btn-details:hover {
    background-color: #007BFF;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 123, 255, 0.2);
  }
  
  .btn-details:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
  }

  .btn-details i {
    font-size: 14px;
  }
  
  .table td .btn-group {
    display: flex;
    justify-content: center;
  }

  .btn-show {
    display: block;
    width: 100%;
    background-color:#007BFF;
    color: white;
  }
  .btn-transfer {
    display: block;
    width: max-content;
    background-color:rgb(87, 3, 8);
    color: white;
  }
  .btn-show:hover {
    background-color:  #023c7a;
    transition: background-color 1s ease;
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
  .close {
    color: #fff;
    background-color: #dc3545;
    border-radius: 50%;
    padding: 5px 10px;
    position: absolute;
    top: 10px;
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
  .modal-content {
    background-color: rgba(245, 243, 243, 0.9);
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow-y: auto;
    max-height: 80vh;
  }
  
  .modal-content h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #FF5733;
  }
  
  .modal-content h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .form-group input, .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .btn-submit {
    background-color:#007BFF;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-submit:hover {
    background-color:#023c7a;
  }
  
  .btn-group {
    display: flex;
    gap: 10px;
    justify-content: center;
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
/*upload */
.files-container {
  display: flex;
  flex-wrap: wrap; 
  gap: 10px;
}

.file-item {
  flex: 0 1 auto; /* Permet aux éléments de garder leur taille naturelle */
  max-width: 200px;
  text-align: center;
}
  </style>
