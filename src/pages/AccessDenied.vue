<template>
    <div class="access-denied">
      <h1>Accès Refusé</h1>
      <p>Désolé, vous n'avez pas la permission d'accéder à cette page.</p>
      <router-link to="/">Retour à la page d'accueil</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AccessDenied',
  };
  </script>
  
  <style scoped>
  .access-denied {
    text-align: center;
    margin-top: 50px;
  }
  </style>