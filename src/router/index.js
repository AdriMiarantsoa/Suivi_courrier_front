import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

Vue.use(VueRouter);

// Configure router
const router = new VueRouter({
  mode: 'history', // Utilisation du mode historique
  routes,
  linkActiveClass: "active",
});

// Guard de route global
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken'); 
  // Vérifiez si la route nécessite une authentification
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Rediriger vers la page d'accès refusé si le local storage est vide
    next({ name: 'AccessDenied' });
  } else {
    // Autoriser l'accès à la route
    next();
  }
});

export default router;