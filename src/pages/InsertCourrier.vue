<template>
    <card class="card" title="Insertion Courrier">
      <div>
        <form @submit.prevent>
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
              <div class="form-group">
                <label for="files">Aperçu du courrier</label>
                <input type="file" id="files" multiple @change="handleFileUpload" />
                <ul>
                  <li v-for="(file, index) in files" :key="index">
                    {{ file.name }}
                    <button type="button" @click="removeSelectedFile(index)" v-if="files.length > 0"><i class="ti-trash"></i></button>
                  </li>
                </ul>
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
        files: [],
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
      removeSelectedFile(index) {
        this.files.splice(index, 1);
      },
      handleFileUpload(event) {
        const newFiles = Array.from(event.target.files);
        this.files = this.files.concat(newFiles); 
      },

      async submitForm() {
        if (!this.formData.nom_courrier || !this.formData.expediteur || !this.formData.dept_destinataire) {
          this.errors = ["Veuillez remplir les champs nécessaires"];
          alert(this.errors);
          return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append('nom_courrier', this.formData.nom_courrier);
        formDataToSend.append('expediteur', this.formData.expediteur);
        formDataToSend.append('description', this.formData.description);

        // Vérifier la valeur de dept_destinataire
        console.log('dept_destinataire:', this.formData.dept_destinataire);
        formDataToSend.append('dept_destinataire', this.formData.dept_destinataire.id_departement);

        this.files.forEach(file => {
          formDataToSend.append('files', file);
        });

        try {
          const response = await axios.post('http://localhost:8081/api/insert_courrier', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          this.errors = null;
          this.formData = { nom_courrier: '', expediteur: '', description: '', dept_destinataire: '' }; 
          this.files = [];

        } catch (error) {
              console.error('Error response:', error.response);
              if (error.response) {
                this.errors = [error.response.data];
              } else {
                this.errors = ["une erreur a survenue"];
              }
              alert(this.errors);
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