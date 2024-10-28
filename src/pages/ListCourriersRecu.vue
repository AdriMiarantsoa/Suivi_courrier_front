<template>
    <div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
                
                <div class="form-inline">
                  <div class="form-group">
                    <label for="expediteur">Expediteur:</label>
                    <input type="text" v-model="expediteur" id="expediteur" />
                  </div>  
                  <div class="form-group">
                      <label for="startDate">Date début:</label>
                      <input type="date" v-model="startDate" id="startDate" />
                    </div>
                    <div class="form-group">
                      <label for="endDate">Date Fin:</label>
                      <input type="date" v-model="endDate" id="endDate" />
                    </div>
                    <button class="btn btn-submit" @click="getListRecu">Filtrer</button>
                    <button v-if="!startDate && !endDate && !expediteur" class="btn btn-submit export-button" @click="downloadFile">export Excel</button>
                  </div>
            </div>

            <div class="card-body table-responsive">
              <table class="table" v-if="reculist.length > 0">
                <thead>
                  <tr>
                    <th>Statut</th>
                    <th>Courrier</th>
                    <th>Description</th>
                    <th>Expediteur</th>
                    <th>Date de traitement</th>
                    <th>Reçu par</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="courrier in currentItems" :key="courrier.id_courrier">
                    <td>{{ courrier.statut }}</td>
                    <td>{{ courrier.nom_courrier }}</td>
                    <td>{{ courrier.description }}</td>
                    <td>{{ courrier.expediteur }}</td>
                    <td>{{ courrier.date_traitement }}</td>
                    <td>{{ courrier.nom_utilisateur }}</td>
                  </tr>
                </tbody>
              </table>

              <div v-else class="empty-state"><i class="ti-folder empty-icon"></i>
                <p>Pas de courrier reçu pour le moment</p>
              </div>

              <div class="pagination" v-if="this.reculist && this.reculist.length > 0">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
                <span>Page {{ currentPage }} sur {{ totalPages }}</span>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
              </div>

            </div>
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
        reculist: [],
        user:null,
        departement:'',
        startDate: '',
        expediteur: '',
        endDate: '',
        departementName: '',

        downloadUrl: '',

        currentPage: 1,
        itemsPerPage: 5,
        totalItems: 0
      };
    },
    async mounted() {
      await this.getListRecu();
      this.exportCourriers();
    },
    computed: {
      totalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
      },
      currentItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.reculist.slice(start, start + this.itemsPerPage);
      }
    },
    methods: {
        async getListRecu() {
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

                const responsedept = await axios.get(`http://localhost:8081/api/departement/utilisateur/${this.user.id_utilisateur}`);
                this.departement = responsedept.data;
                console.log("Données du view :",this.departement);

                const deptresponse = await axios.get(`http://localhost:8081/api/departement/${this.departement}`);
                this.departementName = deptresponse.data;
                console.log('nom_departement:', this.departementName)


                let url = `http://localhost:8081/api/courriers_recu/${this.departement}`;

                const params = [];
              
                if (this.startDate && this.endDate && this.expediteur) {
                    params.push(`startDate=${this.startDate}&endDate=${this.endDate}&expediteur=${this.expediteur}`);
                }

                if (this.startDate && this.endDate) {
                    params.push(`startDate=${this.startDate}&endDate=${this.endDate}`);
                }

                if (this.expediteur) {
                    params.push(`expediteur=${this.expediteur}`);
                }

                // Ajout des paramètres de pagination
                params.push(`page=${this.currentPage}`);
                params.push(`limit=${this.itemsPerPage}`);

                const paramString = params.length > 0 ? `?${params.join('&')}` : '';
                const listresponse = await axios.get(`${url}${paramString}`);

                this.reculist = listresponse.data;
                this.totalItems = listresponse.data.length;

                console.log("liste :", this.reculist);
            } catch (error) {
                console.error(error);
            }
        },
        downloadFile() {
          const a = document.createElement('a');
          a.href = this.downloadUrl;
          a.download = 'courriers.xlsx';
          a.click();
        },
        async exportCourriers() {
          try {
            const response = await axios.post('http://localhost:8081/api/courriers/export', this.reculist, {
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                departementName: this.departementName
              },
              responseType: 'arraybuffer',
            });
            console.log("Données du tab :",response.data);
            
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            this.downloadUrl = url;
          } catch (error) {
            console.error(error);
          }
        },
        changePage(page) {
          if (page < 1 || page > this.totalPages) return; // Vérifier les limites
          this.currentPage = page;
          this.getListRecu();
        }

      },
    watch: {
        startDate() {
            if (!this.startDate) {
                this.getListRecu();
            }
        },
        endDate() {
            if (!this.endDate) {
                this.getListRecu();
            }
        },
        expediteur() {
            if (!this.expediteur) {
                this.getListRecu();
            }
        },
    },
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
    max-height: max-content;
    overflow-y: auto; 
    overflow-x: hidden; 
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
    margin-top:55px;
  }
  .table th, .table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    position: relative;
  }
  .table th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  .table td {
    word-break: break-word; 
  }

  .table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  .table tbody tr:hover {
    background-color: #f1f1f1;
  }
  .btn {
    padding: 10px 15px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
  }
  .btn-show {
    display: block;
    width: 100%;
    background-color: #001122;
    color: white;
  }
  .btn-show:hover {
    background-color: #007BFF;
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
    background-color: #001122;
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
    background-color: #fff;
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
    background-color: #007BFF ;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-submit:hover {
    background-color:  #007BFF;
  }
  
  .form-inline {
    display: flex;
    align-items: center;
    gap: 10px; 
  }
  
  .form-inline .form-group {
    display: flex;
    align-items: center;
    margin-right: 20px; 
  }
  
  .form-inline label {
    margin-right: 10px; 
  }
  
  .form-inline input {
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  .btn-submit {
    margin-left: 20px; 
    padding: 6px 20px;
    margin-top: 25px;
    height: 38px; 
    display: flex;
    align-items: center;
  }
  .export-button {

    position: absolute;  
    top: 65px;
    left: 10px;
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