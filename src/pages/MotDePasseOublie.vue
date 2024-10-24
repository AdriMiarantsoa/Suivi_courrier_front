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
              this.erreurMessage = 'Une erreur est survenue lors de la modification.'; // Message générique
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

<style>
.login-container {
  display: flex;
  justify-content: center; 
  align-items: center; 
  height: 100vh; 
  background-color: #d3d3d3;
}

.login-page {
  display: flex;
  width: 800px;
  height: 500px;
  justify-content: center;
  align-items: center;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.form-container {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  margin-top: 10px;
}

.form {
  background-color:  #011214;
  padding: 30px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  color:white;
}

.input-field {
  margin-bottom: 20px;
}

.input-field label {
  width: 100%;
  padding: 10px;
}

.input-field input,
.input-field select {
  width: 100%;
  padding: 12px;
  border: 1px solid #CCCCCC;
  outline: none;
  font-size: 16px;
  transition: border-color 0.3s;background-color: #FFFFFF;
}

.input-field input:focus,
.input-field select:focus {
  border-color: #003366; 
}

.login-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.95), #003366); 
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.login-btn:hover {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.95), #003366); 
}

.message {
  text-align: center;
  cursor: pointer;
  color: #003366;
}

.error {
  color: red;
  margin-bottom: 10px;
}

.back-to-login {
  display: block;
  margin-top: 20px;
  text-align: center;
  color: #195a9b;
  text-decoration: none;
}

.back-to-login:hover {
  text-decoration: underline;
}

@keyframes fadeIn {
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
}

@keyframes slideIn {
  from {
      transform: translateY(20px);
      opacity: 0;
  }
  to {
      transform: translateY(0);
      opacity: 1;
  }
}
</style>