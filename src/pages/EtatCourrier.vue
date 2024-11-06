<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <div class="form-inline">
            <div class="form-group">
              <label for="id_courrier">Id Courrier:</label>
              <input type="text" v-model="id_courrier" id="id_courrier" class="form-control" />
            </div>
            <button class="btn btn-primary" @click="getAcheminementCourrier" style="margin-top:25px;">Voir</button>
          </div>

          <div v-if="errors" class="alert alert-danger mt-3">
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </div>

          <div class="row mt-4">
            <div class="col-md-4 mb-3" v-if="courrierlist">
              <div class="status-card">
                <div class="status-header">
                  <h5>Statut</h5>
                  <span v-if="!transfertlist && !receptionlist" class="badge bg-warning" style="font-size: 20px;">En attente</span>
                  <span v-else-if="transfertlist && !receptionlist" class="badge bg-info" style="font-size: 20px;">Transfert</span>
                  <span v-else-if="receptionlist" class="badge bg-success" style="font-size: 20px;">Reçu</span>
                </div>
                <div class="status-body">
                  <p><strong>Nom:</strong> {{ courrierlist.nom_courrier }}</p>
                  <p><strong>Date de réception:</strong> {{ courrierlist.date_reception }}</p>
                </div>
              </div>
            </div>

            <div class="col-md-4 mb-3" v-if="transfertlist">
              <div class="status-card">
                <div class="status-header">
                  <h5>Date de transfert</h5>
                </div>
                <div class="status-body">
                  <p>{{ transfertlist.date_transfert }}</p>
                </div>
              </div>
            </div>

            <div class="col-md-4 mb-3" v-if="receptionlist">
              <div class="status-card">
                <div class="status-header">
                  <h5>Réception</h5>
                </div>
                <div class="status-body">
                  <p><strong>Date de traitement:</strong> {{ receptionlist.date_traitement }}</p>
                  <p><strong>Traité par:</strong> {{ receptionlist.recu_par.nom_utilisateur }}</p>
                </div>
              </div>
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
        courrierlist:'',
        receptionlist:'',
        transfertlist:'',
        user:null,
        departement:'',
        departementName: '',
        errors: null,
        id_courrier:''
      };
    },
    async mounted() {
      await this.getAcheminementCourrier();
    },
    methods: {
        async getAcheminementCourrier() {
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

                //verification
                if(this.id_courrier !==''){
                  await axios.get(`http://localhost:8081/api/verification/${this.id_courrier}/${this.departement}`);
                  console.log('id_courrier:', this.id_courrier);
                
                const courrierresponse = await axios.get(`http://localhost:8081/api/courrier/${this.id_courrier}/${this.departement}`);
                this.courrierlist = courrierresponse.data;
                console.log('courrierList',this.courrierlist);

                const transfertresponse = await axios.get(`http://localhost:8081/api/courrier_transfert/${this.id_courrier}/${this.departement}`);
                this.transfertlist= transfertresponse.data;
                console.log('transfertList',this.transfertlist);

                const receptionresponse = await axios.get(`http://localhost:8081/api/courrier_reception/${this.id_courrier}`);
                this.receptionlist = receptionresponse.data;
                console.log('receptionList',this.receptionlist);
                this.errors = null;

                
                }

            } catch (error) {
              console.error('Error response:', error.response);
              if (error.response) {
                this.errors = [error.response.data];
              } else {
                this.errors = ["une erreur a survenue"];
              }
                console.error(error);
            }
        }
  }
};
  </script>
  
  <style scoped>
  .card {
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
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
    margin-top: 20px;
    height: 150px;
    overflow: auto;
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
  .btn {
    padding: 10px 15px;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
  }
  .btn-group {
    display: flex;
    gap: 10px;
  }
  .btn-submit {
    background-color: #007BFF;
    color: white;
    margin-top: 25px;
  }
  .btn-submit:hover {
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
  
  </style>