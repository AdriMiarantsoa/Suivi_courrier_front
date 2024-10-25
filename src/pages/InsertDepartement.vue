<template>
    <card class="card" title="Insert Departement">
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
                label="name"
                placeholder="Enter Departement name"
                v-model="formData.nom_departement"
              >
              </fg-input>
              <fg-input
                type="text"
                label="responsable"
                placeholder="Enter Responsable name"
                v-model="formData.responsable"
              >
              </fg-input>

              <div class="form-group">
                <label for="dept">Department parent</label>
                <select v-model="formData.dept_parent" id="dept" class="form-control" placeholder="Select a department">
                  <option v-for="dept in depts" :key="dept.id_departement" :value="dept">
                    {{ dept.nom_departement }}
                  </option>
                </select>
              </div>
            </div>
          </div>
  
          <div class="text-center">
            <p-button style="background-color: #007BFF;" round @click.native.prevent="submitForm">
              Insert
            </p-button>
          </div>
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
          nom_departement: '',
          responsable: '',
          dept_parent: ''
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
        if (!this.formData.nom_departement || !this.formData.responsable ) {
          this.errors = ["Please fill in all required fields"];
          return;
        }

        if (!this.formData.dept_parent) {
          this.formData.dept_parent = null;
        }

        try {
          await axios.post('http://localhost:8081/api/insert_departement', this.formData);
          this.errors = null;

          this.formData = { nom_departement: '',responsable:'',dept_parent:''}; // Reset form data
        } catch (error) {
          console.error('Error response:', error.response);
            if (error.response && error.response.data && error.response.data.message) {
              this.errors = [error.response.data.message];
            } else if (error.response && error.response.data && error.response.data.errors) {
              this.errors = error.response.data.errors;
            } else {
              this.errors = ["An unknown error occurred. Please try again later."];
            }
        }

      }
    },
  };
  </script>
  
  <style>
  </style>