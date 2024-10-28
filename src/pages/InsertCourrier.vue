<template>
    <card class="card" title="Insertion Courrier">
      <div>
        <form @submit.prevent>
          <div v-if="errors" class="alert alert-danger">
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </div>

          <div class="row">
            <div class="col-md-12">
              <fg-input
                type="text"
                label="nom"
                placeholder="Entre le nom du courrier"
                class="form-input"
                v-model="formData.nom_courrier"
              >
              </fg-input>
              <fg-input
                type="text"
                label="expediteur"
                placeholder="Entre le nom de l'expediteur"
                class="form-input"
                v-model="formData.expediteur"
              >
              </fg-input>
              <textarea name="description" 
                label="description"
                placeholder="Entre la description" 
                rows="5"
                class="form-control border-input"
                v-model="formData.description"
              >
              </textarea>
              <!-- dropdown dept -->
            <br>
              <div class="form-group">
                <label for="dept">Department</label>
                <select v-model="formData.dept_destinataire" id="dept-courrier" class="form-control" placeholder="Select a department">
                  <option v-for="dept in depts" :key="dept.id_departement" :value="dept">
                    {{ dept.nom_departement }}
                  </option>
                </select>
              </div>
            </div>
          </div>
  
          <div class="text-center">
            <p-button style="background-color:#007BFF" round @click.native.prevent="submitForm">
              Insert
            </p-button>
          </div>
          <div class="clearfix"></div>
        </form>
      </div>
    </card>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        formData: {
          nom_courrier: '',
          expediteur: '',
          description: '',
          dept_destinataire: '',
        },
        depts: [],
        errors: null,
      };
    },
    mounted() {
      axios.get('http://localhost:8081/api/departements')
        .then(response => {
          this.depts = response.data;
        })
        .catch(error => {
          console.error('Error fetching departments:', error);
        });
      },
    methods: {
      async submitForm() {
        if (!this.formData.nom_courrier || !this.formData.expediteur || !this.formData.dept_destinataire) {
          this.errors = ["Veuillez remplir les champs nécessaires"];
          return;
        }
        try {
          await axios.post('http://localhost:8081/api/insert_courrier', this.formData);
          this.errors = null;
          this.formData = { nom_courrier: '',expediteur:'',description:'',dept_destinataire:'' }; // Reset form data
        } catch (error) {
          console.error('Error response:', error.response);
            if (error.response && error.response.data && error.response.data.message) {
              this.errors = [error.response.data.message];
            } else if (error.response && error.response.data && error.response.data.errors) {
              this.errors = error.response.data.errors;
            } else {
              this.errors = ["une erreur a survenue"];
            }
        }
      },
    },
  };
  </script>
  
  <style>
  .card {
    border: 1px solid #b1abab;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    max-height: max-content; 
    overflow-y: auto; 
    overflow-x: hidden; 
  }
  
  form {
    max-height: 100%;
  }
  .form-input, .form-select, .form-textarea {
    width: 100%; 
    padding: 12px;
    border: 1px solid #a3a3a3; 
    border-radius: 5px; 
    margin-bottom: 15px; 
    font-size: 16px; 
    transition: border-color 0.3s; 
  }
  #dept-courrier{
    width: 100%; 
    padding: 12px;
    border: 1px solid #a3a3a3; 
    border-radius: 5px; 
    margin-bottom: 15px; 
    font-size: 12px; 
    transition: border-color 0.3s; 
  }
  </style>