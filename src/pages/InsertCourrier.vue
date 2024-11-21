<template>
  <card class="card-insertion">
    <h1 class="card-title">Insertion Courrier</h1>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="nom-courrier">Nom du Courrier</label>
        <input
          type="text"
          id="nom-courrier"
          class="form-input"
          placeholder="Entrer le nom du courrier"
          v-model="formData.nom_courrier"
        />
      </div>
      <div class="form-group">
        <label for="expediteur">Expéditeur</label>
        <input
          type="text"
          id="expediteur"
          class="form-input"
          placeholder="Entrer le nom de l'expéditeur"
          v-model="formData.expediteur"
        />
      </div>
      <div class="form-group">
        <label for="description">Entrer la description</label>
        <textarea
          id="description"
          class="form-input"
          placeholder="Entrer la description"
          v-model="formData.description"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="departement">Département</label>
        <select
          id="departement"
          class="form-select"
          v-model="formData.dept_destinataire"
        >
          <option disabled value="">Sélectionner un département</option>
          <option v-for="dept in depts" :key="dept.id_departement" :value="dept">
            {{ dept.nom_departement }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="apercu-courrier">Aperçu du Courrier</label>
        <input type="file" id="apercu-courrier" class="form-input" multiple @change="handleFileUpload" />
        <ul class="file-list">
          <li v-for="(file, index) in files" :key="index">
            {{ file.name }}
            <button type="button" @click="removeSelectedFile(index)" class="remove-file-btn" v-if="files.length > 0">
              <i class="ti-trash"></i>
            </button>
          </li>
        </ul>
      </div>
      <div class="button-container">
        <button type="submit" class="btn-courrier" style="margin-top:-400px">INSERT</button>
      </div>
    </form>
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
.card-insertion {
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 30px;
  background-color: #fefefe; /* Fond similaire à votre exemple */
  width: 800px; /* Largeur fixe pour le formulaire */
  margin: 0 auto; /* Centrer le formulaire horizontalement */
  height: max-content;
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px; /* Espace entre les colonnes */
  margin-top: 20px;
}

.button-container {
  grid-column: span 2; /* Le bouton s'étend sur les deux colonnes */
  text-align: right; /* Aligner le bouton à droite */
  margin-top: 20px; /* Espacement au-dessus du bouton */
}
.card-title {
  font-size: 28px;
  color: #ff9800;
  text-align: center; /* Centrer le texte */
}

.form-group {
  margin-bottom: 20px; /* Espace entre les groupes de champs */
}

.form-group label {
  display: block;
  font-size: 16px;
  margin-bottom: 8px;
  color: #555555;
}

.form-input,
.form-select,
textarea {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  background-color: #fff; /* Couleur de fond des champs */
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus,
textarea:focus {
  border-color: #ff9800; /* Couleur de bordure au focus */
  outline: none;
}

textarea {
  height: 120px; /* Hauteur fixe pour le textarea */
  resize: none; /* Désactiver le redimensionnement */
}

.file-list {
  list-style-type: none;
  padding: 0;
}

.file-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #eee; /* Ligne de séparation entre les fichiers */
}

.remove-file-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ff4d4d; /* Couleur pour le bouton de suppression */
}

.remove-file-btn:hover {
  color: #d9534f; /* Couleur de survol */
}

.btn-courrier {
  padding: 12px 25px;
  font-size: 16px;
  color: #ffffff;
  background-color: #007bff; /* Couleur de fond bleu */
  border: none;
  border-radius: 5px; /* Coins arrondis */
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3; /* Couleur de fond au survol (bleu plus foncé) */
}
</style>
