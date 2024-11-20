import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
import DashboardDept from "@/layout/dashboard/DashboardDept.vue";
import DashboardAdmin from "@/layout/dashboard/DashboardAdmin.vue";

// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Notifications from "@/pages/Notifications.vue";
import ValidationCourrier from "@/pages/ValidationCourrier.vue";
import LoginUser  from "@/pages/LoginUser.vue";
import InsertCourrier from "@/pages/InsertCourrier.vue";
import CourriersDepartement from "@/pages/CourriersDepartement.vue";
import LoginAdmin from "@/pages/LoginAdmin.vue";
import ListUser  from "@/pages/ListUserNotApproved.vue";
import Insert_role from "@/pages/InsertRole.vue";
import InsertDepartement from "@/pages/InsertDepartement.vue";
import ListRole from "@/pages/ListRole.vue";
import ListDepartement from "@/pages/ListDepartement.vue";
import CourriersRecu from "@/pages/ListCourriersRecu.vue";
import MotDePasse from "@/pages/MotDePasseOublie.vue";
import StatDept from "@/pages/StatistiqueCourrierDept.vue";
import etatCourrier from "@/pages/EtatCourrier.vue";
import AccessDenied from "@/pages/AccessDenied.vue";

const routes = [
  {
    path: "/",
    component: LoginUser ,
    name: "connection_user",
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDenied,
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
    meta: { requiresAuth: true }, // Ajout de la protection
    children: [
      {
        path: "/dashboard/document_validation",
        name: "Liste des documents en attente de confirmation",
        component: ValidationCourrier,
        meta: { requiresAuth: true }, // Ajout de la protection
      },
      {
        path: "/dashboard/insertion_document",
        name: "Insertion de courrier",
        component: InsertCourrier,
        meta: { requiresAuth: true }, // Ajout de la protection
      }
    ],
  },
  {
    path: "/board",
    component: DashboardDept,
    redirect: "/board/departement/:id_departement/courriers",
    meta: { requiresAuth: true }, // Ajout de la protection
    children: [
      {
        path: "/board/departement/:id_departement/courriers",
        name: "Liste de courriers en attente",
        component: CourriersDepartement,
        meta: { requiresAuth: true }, // Ajout de la protection
      },
      {
        path: "/board/courriersRecu",
        name: "Liste de courriers reçus par votre departement",
        component: CourriersRecu,
        meta: { requiresAuth: true }, // Ajout de la protection
      },
      {
        path: "/board/etatCourrier",
        name: "Suivi de l'etat du courrier",
        component: etatCourrier,
        meta: { requiresAuth: true }, // Ajout
      },
      {
        path: "/board/notifications",
        name: "notifications",
        component: Notifications,
        meta: { requiresAuth: true }, // Ajout de la protection
      },
      {
        path: "/board/statistique",
        name: "Statistique par an",
        component: StatDept,
        meta: { requiresAuth: true }, // Ajout de la protection
      }
  ],
},
{
  path: "/adminboard",
  component: DashboardAdmin,
  redirect: "/adminboard/users",
  meta: { requiresAuth: true }, // Ajout de la protection
  children: [
    {
      path: "/adminboard/users",
      name: "Liste des utilisateurs en attente non approuvé",
      component: ListUser ,
      meta: { requiresAuth: true }, // Ajout de la protection
    },
    {
      path: "/adminboard/insert_role",
      name: "Insertion de role",
      component: Insert_role,
      meta: { requiresAuth: true }, // Ajout de la protection
    },
    {
      path: "/adminboard/insert_departement",
      name: "Insertion de departement",
      component: InsertDepartement,
      meta: { requiresAuth: true }, // Ajout de la protection
    },
    {
      path: "/adminboard/list_role",
      name: "Listes de roles",
      component: ListRole,
      meta: { requiresAuth: true }, // Ajout de la protection
    },
    {
      path: "/adminboard/list_departement",
      name: "Listes de departements",
      component: ListDepartement,
      meta: { requiresAuth: true }, // Ajout de la protection
    }
  ],
},
{ path: "*", component: NotFound },
];

export default routes;