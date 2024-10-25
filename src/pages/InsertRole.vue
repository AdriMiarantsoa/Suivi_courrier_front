<template>
    <card class="card" title="Insert Document">
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
                placeholder="Enter Role name"
                v-model="formData.nom_role"
              >
              </fg-input>
            </div>
          </div>
  
          <div class="text-center">
            <p-button style="background-color: #007BFF;" round @click.native.prevent="submitForm">
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
          nom_role: '',
        },
        errors: null,
      };
    },
    methods: {
      async submitForm() {
        if (!this.formData.nom_role) {
          this.errors = ["Please fill in all required fields"];
          return;
        }
        try {
          await axios.post('http://localhost:8081/api/insert_role', this.formData);
          this.errors = null;
          this.formData = { nom_role: ''}; // Reset form data
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
      },
    },
  };
  </script>
  
  <style>
  </style>