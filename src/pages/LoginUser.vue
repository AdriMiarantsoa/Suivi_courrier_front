<template>
  <div class="login-container">
    <div class="login-page">
      <div class="left" ref="left">
        <h2>{{ isLogin ? 'Connexion' : '' }}</h2>
        <div v-if="erreurMessage" class="error">{{ erreurMessage }}</div>
        <form @submit.prevent="isLogin ? login() : signUp()">
          <div class="input-field">
            <label for="nom">Nom</label>
            <input type="text" id="nom" v-model="nom_utilisateur" placeholder="Nom" />
          </div>
          <div class="input-field">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Entre votre mail" />
            <div v-if="!isValidEmail(email) && email" class="error">e-mail invalide</div>
          </div>
          <div class="input-field">
            <label for="mdp">Mot de passe</label>
            <input type="password" id="mdp" v-model="mot_de_passe" placeholder="Mot de passe" />
          </div>
          <div v-if="!isLogin" class="input-field">
            <label for="confirm-mdp">Confirmation Mot de passe</label>
            <input type="password" id="confirm-mdp" v-model="confirmMdp" placeholder="Confirme votre mot de passe" />
          </div>
          <div v-if="!isLogin" class="input-field">
            <label for="role">Role</label>
            <select v-model="role" id="role" class="styled-select">
              <option value="" disabled>Select votre role</option>
              <option v-for="role in roles" :key="role.id" :value="role">
                {{ role.nom_role }}
              </option>
            </select>
          </div>
          <div v-if="!isLogin && role.nom_role !== 'Secretaire'" class="input-field">
            <label for="departement">Department</label>
            <select v-model="departement" id="departement" class="styled-select">
              <option value="" disabled>Select votre department</option>
              <option v-for="departement in departements" :key="departement.id" :value="departement">
                {{ departement.nom_departement }}
              </option>
            </select>
          </div>
          <div class="remember-me" v-if="isLogin">
            <router-link :to="{ name: 'forget_password'}" class="forgot-password">Mot de passe oublié?</router-link>
          </div>
          <button type="submit" class="sign-in-btn">{{ isLogin ? 'Connexion' : 'Inscription' }}</button>
        </form>
      </div>
      <div class="right">
        <h2 style="color: #FF5733">Suivi de Courrier physique</h2>
        <p>Bienvenu sur la page de {{ isLogin ? 'Connexion' : 'Inscription' }}</p>
        <button class="sign-up-btn" @click="toggleMode">{{ isLogin ? 'Inscription' : 'Connexion' }}</button>
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
      role: '',
      email: '',
      departement: '',
      isLogin: true,
      departements: [],
      roles: [],
      erreurMessage: '',
    }
  },
  mounted() {
    this.getDepartements();
    this.getRoles();

  },
  methods: {
    async getDepartements() {
      try {
        const response = await axios.get("http://localhost:8081/api/departements");
        this.departements = response.data;
        console.log(this.departements);
      } catch (error) {
        console.error(error);
      }
    },
    async getRoles() {
      try {
        const response = await axios.get("http://localhost:8081/api/roles");
        this.roles = response.data;
        console.log(this.roles);
      } catch (error) {
        console.error(error);
      }
    },
    login() {
      this.error ='';
      const formData = new FormData();
      formData.append('nom_utilisateur', this.nom_utilisateur);
      formData.append('mot_de_passe', this.mot_de_passe);
      formData.append('email', this.email);

      axios.post('http://localhost:8081/api/login', formData)
        .then(response => {
          console.log(response.data);
          const token = response.data.token;
          localStorage.setItem('authToken', token);
          const redirectUrl = response.data.redirect;
          this.$router.push(redirectUrl);
        })
        .catch(error => {
          console.error(error);
          if (error.response) {
            this.erreurMessage = error.response.data; // Affichez le message d'erreur
          } else {
            this.erreurMessage = 'Une erreur est survenue lors de la connexion.'; // Message générique
          }
        });
    },
    async signUp() {
      if (this.mot_de_passe === this.confirmMdp) {
        const receptionData = {
          nom_utilisateur: this.nom_utilisateur,
          mot_de_passe: this.confirmMdp,
          email: this.email,
          departement: this.departement || null,
          role: this.role
        };

        console.log("Sending Reception Data:", receptionData);

        try {
          const response = await axios.post('http://localhost:8081/api/signup', receptionData);
          console.log(response.data);  
          
          this.isLogin = true;
          this.nom_utilisateur = '';
          this.mot_de_passe = '';
          this.confirmMdp = '';
          this.email = '';
          this.role = '';
          this.departement = '';
        } catch (error) {
          console.error("Erreur lors de l'inscription:", error);
          if (error.response) {
            this.erreurMessage = error.response.data; 
          } else {
            this.erreurMessage = 'Une erreur est survenue lors de la connexion.';
          }
        }
      } else {
        this.erreurMessage = 'password does not match';
      }
    },
    toggleMode() {
      this.isLogin = !this.isLogin;
      this.erreurMessage = '';
    },
    isValidEmail(email) {
      // Utilisation d'une expression régulière pour valider l'email
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
  height: 100vh; 
  background-color: #f0f0f0; 
  backdrop-filter: blur(10px);
}

.login-page {
  display: flex;
  width: 800px;
  height: 500px;
  background-color: rgba(255, 255, 255, 0.9); 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); 
  border-radius: 10px; 
  overflow-y: auto;
  justify-content: center;
  align-items: center;
  margin: auto;
}

.left, .right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 40px;
}

.left {
  border-right: 1px solid #e0e0e0; 
}

.right {
  color: #333; 
}

.left h2, .right h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333; 
}

.left .input-field {
  width: 100%;
  margin-bottom: 10px; 
}

.left .input-field label {
  display: block;
  margin-bottom: 2px;
  color: #555; 
  font-weight: 600; 
}

.left .input-field input, .left .input-field select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc; 
  border-radius: 5px; 
  background-color: #f9f9f9; 
  transition: border-color 0.3s; 
}

.left .input-field input:focus, .left .input-field select:focus {
  border-color: #007BFF; 
  outline: none; 
}

.left .sign-in-btn {
  width: 100%;
  padding: 10px;
  background-color: #007BFF; 
  border: none;
  border-radius: 5px;
  color: #FFFFFF;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s; 
}

.left .sign-in-btn:hover {
  background-color: #0056b3; 
}

.right .sign-up-btn {
  padding: 10px 20px;
  background-color: transparent;
  border: 2px solid #007BFF; 
  border-radius: 5px;
  color: #007BFF; 
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s; 
}

.right .sign-up-btn:hover {
  background-color: #007BFF; 
  color: #FFFFFF;
}

.left .forgot-password {
  color: #007BFF; 
  text-align: right;
  display: block;
  margin-top: 10px;
  text-decoration: none;
}

.error {
  color: red;
  margin-bottom: 10px;
}
</style>




