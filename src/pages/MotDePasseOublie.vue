<template>
  <div class="login-container">
    <div class="login-page">
      <div class="form-container">
        <div class="form">
          <h3 style="color: #FF5733">Change Password</h3>
  
          <div v-if="erreurMessage" class="error">{{ erreurMessage }}</div>
  
          <form @submit.prevent="ChangeMDP()">
            <div class="input-field">
              <label for="nom">Username</label>
              <input type="text" id="nom" v-model="nom_utilisateur" placeholder="Enter your username" />
            </div>
            <div class="input-field">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="email" placeholder="Enter your mail" />
              <div v-if="!isValidEmail(email) && email" class="error">e-mail invalide</div>
            </div>
            <div class="input-field">
              <label for="mdp">Password</label>
              <input type="password" id="mdp" v-model="mot_de_passe" placeholder="Enter your password" />
            </div>
            <div v-if="!isLogin" class="input-field">
              <label for="confirm-mdp">Confirm Password</label>
              <input type="password" id="confirm-mdp" v-model="confirmMdp" placeholder="Re-enter your password" />
            </div>
            <button type="submit" class="login-btn">Submit</button>
          </form>
          <router-link to="/" class="back-to-login">Back to Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'connection_user',
  data() {
    return {
      nom_utilisateur: '',
      mot_de_passe: '',
      confirmMdp: '',
      email: '',
      erreurMessage: '' 
    }
  },
  methods: {
    async ChangeMDP() {
      if (this.mot_de_passe === this.confirmMdp) {
        const formData = new FormData();
        formData.append('nom_utilisateur', this.nom_utilisateur);
        formData.append('mot_de_passe', this.mot_de_passe);
        formData.append('email', this.email);

        axios.put('http://localhost:8081/api/update_mdp', formData)
          .then(response => {
            console.log(response.data);
            this.$router.push("/");
          })
          .catch(error => {
            console.error(error);
            if (error.response) {
              this.erreurMessage = error.response.data; 
            } else {
              this.erreurMessage = 'Une erreur est survenue lors de la modification.'; 
            }
          });
      }
    },
    isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
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
  background-color: #f0f0f0; 
  backdrop-filter: blur(10px);
}

.login-page {
  display: flex;
  width: 800px;
  flex-direction: column; 
  justify-content: center;
  align-items: center;
  margin: auto;
  position: relative; 
  border-radius: 10px; 
}

.form-container {
  width: 100%; 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
}

.form {
  background-color: #ffffff; 
  padding: 30px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); 
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  color: #333; 
}

h3 {
  color: #FF5733; 
  margin-bottom: 20px; 
}

.input-field {
  margin-bottom: 20px; 
}

.input-field label {
  display: block; 
  margin-bottom: 5px; 
  color: #555; 
}

.input-field input,
.input-field select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc; 
  border-radius: 5px; 
  outline: none;
  font-size: 16px;
  transition: border-color 0.3s; 
  background-color: #f9f9f9; 
}

.input-field input:focus,
.input-field select:focus {
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

.error {
  color: red;
  margin-bottom: 10px; 
}

.back-to-login {
  display: block;
  margin-top: 20px;
  text-align: center;
  color: #007BFF;
  text-decoration: none;
}

.back-to-login:hover {
  text-decoration: underline; 
}
</style>