<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Welcome</h2>
      <p>Please login to Admin Dashboard.</p>
      <div v-if="erreurMessage" class="error">{{ erreurMessage }}</div>
      <form @submit.prevent="login()">
        <div class="input-field">
          <label for="nom">Username</label>
          <input type="text" id="nom" v-model="nom_admin" placeholder="Username" />
        </div>
        <div class="input-field">
          <label for="mdp">Password</label>
          <input type="password" id="mdp" v-model="mot_de_passe" placeholder="Password" />
        </div>
        <button type="submit" class="login-btn">LOGIN</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'connection_user',
  data() {
    return {
      nom_admin: '',
      mot_de_passe: '',
      erreurMessage: ''
    }
  },
  methods: {
    login() {
      const formData = new FormData();
      formData.append('nom_admin', this.nom_admin);
      formData.append('mot_de_passe', this.mot_de_passe);

      axios.post('http://localhost:8081/api/admin/login_admin', formData)
        .then(response => {
          console.log(response.data);
          const token = response.data.token;
          localStorage.setItem('authToken', token);
          const redirectUrl = response.data.redirect;
          this.$router.push({ name: 'List of users not approved' });
        })
        .catch(error => {
          console.error(error);
          if (error.response) {
            this.erreurMessage = error.response.data;
          } else {
            this.erreurMessage = 'Une erreur est survenue lors de la connexion.'; 
          }
        });
    }
  }
}
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center; 
  align-items: center; 
  min-height: 100vh; 
  background-color: #e9ecef; 
}

.login-card {
  background: #ffffff; 
  border: 1px solid #dee2e6; 
  border-radius: 10px; 
  padding: 30px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px; 
  margin: 0 auto; 
  text-align: center;
  color: #333; 
}

.login-card h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #007BFF; 
}

.login-card p {
  margin-bottom: 20px;
  color: #666; 
}

.input-field {
  margin-bottom: 20px; 
}

.input-field label {
  display: block; 
  margin-bottom: 5px; 
  color: #555; 
}

.input-field input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da; 
  border-radius: 5px; 
  outline: none;
  font-size: 16px;
  background-color: #f9f9f9; 
  transition: border-color 0.3s; 
}

.input-field input:focus {
  border-color: #007BFF; 
}

.login-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px; 
  background-color: #007BFF;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s; 
}

.login-btn:hover {
  background-color: #0056b3; 
}

.forgot-password {
  display: block;
  margin-top: 10px;
  color: #007BFF; 
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline; 
}

.error {
  color: red;
  margin-bottom: 10px; 
}
</style>