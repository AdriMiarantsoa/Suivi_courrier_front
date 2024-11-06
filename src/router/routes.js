import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
import DashboardDept from "@/layout/dashboard/DashboardDept.vue";
import DashboardAdmin from "@/layout/dashboard/DashboardAdmin.vue";

// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Notifications from "@/pages/Notifications.vue";
import  ValidationCourrier from "@/pages/ValidationCourrier.vue";
import LoginUser from "@/pages/LoginUser.vue";
import InsertCourrier from "@/pages/InsertCourrier.vue";
import CourriersDepartement from "@/pages/CourriersDepartement.vue";
import LoginAdmin from "@/pages/LoginAdmin.vue";
import ListUser from "@/pages/ListUserNotApproved.vue";
import Insert_role from "@/pages/InsertRole.vue";
import InsertDepartement from "@/pages/InsertDepartement.vue";
import ListRole from "@/pages/ListRole.vue";
import ListDepartement from "@/pages/ListDepartement.vue";
import CourriersRecu from "@/pages/ListCourriersRecu.vue";
import MotDePasse from "@/pages/MotDePasseOublie.vue";
import StatDept from "@/pages/StatistiqueCourrierDept.vue";
import etatCourrier from "@/pages/EtatCourrier.vue";

const routes = [
  {
    path: "/",
    component: LoginUser,
    name: "connection_user",
  },
  {
    path: "/admin/login",
    component: LoginAdmin,
    name: "connection_admin",
  },
  {
    path: "/forget_password",
    component: MotDePasse,
    name: "forget_password",
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    redirect: "/dashboard/insertion_document",
    children: [
      {
        path: "/dashboard/document_validation",
        name: "Liste des documents en attente de confirmation",
        component: ValidationCourrier,
      },
      {
        path: "/dashboard/insertion_document",
        name: "Insertion de courrier",
        component: InsertCourrier,
      }
    ],
  },
  {
    path: "/board",
    component: DashboardDept,
    redirect: "/board/departement/:id_departement/courriers",
    children: [
      {
        path: "/board/departement/:id_departement/courriers",
        name: "Liste de courriers en attente",
        component: CourriersDepartement,
      },
      {
        path: "/board/courriersRecu",
        name: "Liste de courriers reçus par votre departement",
        component: CourriersRecu,
      },
      {
        path: "/board/etatCourrier",
        name: "Suivi de l'etat du courrier",
        component: etatCourrier,
      },
      {
        path: "/board/notifications",
        name: "notifications",
        component: Notifications,
      },
      {
        path: "/board/statistique",
        name: "Statistique par an",
        component: StatDept,
      }
    ],
  },
  {
    path: "/adminboard",
    component: DashboardAdmin,
    redirect: "/adminboard/users",
    children: [
      {
        path: "/adminboard/users",
        name: "Liste des utilisateurs en attente non approuvé",
        component: ListUser,
      },
      {
        path: "/adminboard/insert_role",
        name: "Insertion de role",
        component: Insert_role,
      },
      {
        path: "/adminboard/insert_departement",
        name: "Insertion de departement",
        component: InsertDepartement,
      },
      {
        path: "/adminboard/list_role",
        name: "Listes de roles",
        component: ListRole,
      },
      {
        path: "/adminboard/list_departement",
        name: "Listes de departements",
        component: ListDepartement,
      }
    ],
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
