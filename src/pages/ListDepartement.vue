<template>
    <div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Departement</th>
                    <th>Supervisor</th>
                    <th>Parent</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="departement in departementlist" :key="departement.id_departement">
                    <td>{{ departement.id_departement }}</td>
                    <td>{{ departement.nom_departement }}</td>
                    <td>{{ departement.responsable }}</td>
                    <td>{{ departement.dept_parent }}</td>
                    <td>
                    <div class="btn-group">
                          <button class="btn btn-show" @click="Remove(departement)"><i class="ti-trash"></i></button>

                          <button class="btn btn-update" @click="showUpdateForm(departement)"><i class="ti-pencil"></i></button>
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
        <span class="close" @click="hideUpdateForm">&times;</span>
        <h3 style="color: #FF5733;">Changer le Departement</h3>
        <form @submit.prevent="submitUpdate">
          <div v-if="errors" class="alert alert-danger">
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </div>
          
          <div class="form-group">
            <label for="nom_departement">Nom</label>
            <input type="text" id="nom_departement" v-model="selectedDept.nom_departement" required>
          </div>
          <div class="form-group">
            <label for="responsable">Responsable</label>
            <input type="text" id="responsable" v-model="selectedDept.responsable" required>
          </div>
          <div class="form-group">
            <label for="dept_destinataire">Departement Parent</label>
            <select id="dept_destinataire" v-model="selectedDept.dept_parent">
              <option v-for="dept in departementlist" :key="dept.id" :value="dept">{{ dept.nom_departement }}</option>
              <option :value="null">Aucun parent</option>
            </select>
          </div>
          <button type="submit" class="btn btn-submit">Submit</button>
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
        departementlist: [],
        errors: null,
        showForm: false,
        selectedDept: {}
      };
    },
    mounted() {
      this.getDepartements();
    },
    methods: {
        async getDepartements() {
            try {
                const response = await axios.get("http://localhost:8081/api/departements");
                this.departementlist = response.data;
                console.log("Données du view :",this.departementlist);
            } catch (error) {
          //      console.error(error);
            }
        },
        async Remove(departement) {
            try {
                const response = await axios.delete(`http://localhost:8081/api/deleteDepartement/${departement.id_departement}`);
                console.log("delete :",response.data);
                this.getDepartements();
            } catch (error) {
                console.error(error);
            }
        },
        showUpdateForm(departement) {
          this.errors = '';
          console.log("showUpdateForm called with:",departement);
          this.selectedDept = { ...departement};
          this.showForm = true;
          console.log("showForm set to true");
        },
        hideUpdateForm() {
          this.showForm = false;
        },
        async submitUpdate() {
          
            if (!this.selectedDept.nom_departement || !this.selectedDept.responsable ) {
                this.errors = ["Veuillez remplir les champs nécessaires"];
                return;
            }
          try {
              const departements = {
                id_departement: this.selectedDept.id_departement,
                nom_departement: this.selectedDept.nom_departement,
                responsable: this.selectedDept.responsable,
                dept_parent: this.selectedDept.dept_parent
              };
              console.log("donnees du departement :",departements);

              const response = await axios.put(`http://localhost:8081/api/updateDepartement`, departements);
              this.hideUpdateForm();
              this.getDepartements();

            } catch (error) {
                  if (error.response && error.response.data && error.response.data.message) {
                    this.errors = [error.response.data.message];
                  } else if (error.response && error.response.data && error.response.data.errors) {
                    this.errors = error.response.data.errors;
                  } else {
                    this.errors = ["Une erreur est survenue"];
                  }
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
  .btn-show {
    display: block;
    width: 100%;
    background-color: #d62e04;
    color: white;
  }
  .btn-show:hover {
    background-color: #9b0707;
    transition: background-color 1s ease;
  }
  .btn-update {
    background-color: #007BFF;
    color: white;
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