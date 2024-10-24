<template>
    <div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Departement</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="utilisateur in utilisateurlist" :key="utilisateur.id_utilisateur">
                    <td>{{ utilisateur.nom_utilisateur }}</td>
                    <td>{{ utilisateur.nom_departement }}</td>
                    <td>{{ utilisateur.nom_role }}</td>
                    <td>
                    <div class="btn-group">
                          <button class="btn btn-show" @click="Approve(utilisateur)">approve</button>
                        </div>
                    </td>
                  </tr>
                </tbody>
              </table>
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
        utilisateurlist: []
      };
    },
    mounted() {
      this.getListUserNotApprove();
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
    background-color: rgb(1, 31, 65);
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
    background-color:  #001122;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-submit:hover {
    background-color:  rgb(1, 31, 65);
  }
  
  </style>