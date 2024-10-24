<template>
    <div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 style="color:#003366;">{{ this.departementName }}</h3>
            </div>  
            <div class="card-body table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Expeditor</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="courrier in courriersDepartement" :key="courrier.id_courrier">
                    <td>{{ courrier.statut === 'enregistre' ? 'awaiting processing' : courrier.statut }}</td>
                    <td>{{ courrier.nom_courrier }}</td>
                    <td>{{ courrier.expediteur }}</td>
                    <td>
                    <div class="btn-group">
                          <button class="btn btn-show" @click="ShowCourrier(courrier)">see details</button>    
                    </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire de mise à jour en tant que modal -->
      <div v-if="showForm" class="modal">
        <div class="modal-content">
          <span class="close" @click="hideDetails">&times;</span>
          <h2>Document Details</h2>
          <h3>Courier Information</h3>
          <form @submit.prevent>
            <section>
              <div class="form-group">
                <label for="id">ID</label>
                <input type="text" v-model="id_courrier.id_courrier" readonly>
              </div>
              <div class="form-group">
                <label for="nom_courrier">Courier Name</label>
                <input type="text" v-model="id_courrier.nom_courrier" readonly>
              </div>
              <div class="form-group">
                <label for="expediteur">Expeditor</label>
                <input type="text" v-model="id_courrier.expediteur" readonly>
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" v-model="id_courrier.description" rows="5" readonly/>
              </div>    
            </section>
            <div class="btn-group">
              <p-button style="background-color:  rgb(1, 31, 65);" round @click.native.prevent="submitForm">
                Received
              </p-button>
              <button v-if="departementName.toLowerCase() === 'direction'" class="btn btn-transfer" @click="ShowTransferForm(id_courrier)">Transfer
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Formulaire de transfert en tant que modal -->
      <div v-if="showTransferForm" class="modal">
        <div class="modal-content">
          <span class="close" @click="hideTransferForm">&times;</span>
          <h2>Transfer document</h2>
          <form @submit.prevent>
            <section>
              <div class="form-group">
                <label for="id">ID</label>
                <input type="text" v-model="id_courrier.id_courrier" readonly>
              </div>
              <div class="form-group">
                <label for="nom_courrier">Name</label>
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
                Submit
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

        selectedDepartement: null,
        departements: []
      
      };
    },
    mounted() {
      this.getCourriersDepartement();
    },
    methods: {
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
            
            } catch (error) {
            console.error(error);
            }
        },
        ShowCourrier(courrier) {
            console.log("showUpdateForm called with:", courrier);
            this.id_courrier = { ...courrier };
            this.showForm = true;
            console.log("showForm set to true");
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
            this.departements = response.data;
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
              id_courrier: this.id_courrier.id_courrier,
              dept_destinataire: this.selectedDepartement,
            };
            console.log("Sending Transfer Data:", transferData);
            
            await axios.put(`http://localhost:8081/api/transfer_courrier?id_courrier=${transferData.id_courrier}&dept_destinataire=${transferData.dept_destinataire.id_departement}`, null, {
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
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
  }
  .btn-show {
    display: block;
    width: 100%;
    background-color:rgb(1, 31, 65);
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
    background-color:rgb(1, 31, 65);
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
  
  </style>