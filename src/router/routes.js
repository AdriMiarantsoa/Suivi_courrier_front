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
    redirect: "/dashboard/document_register",
    children: [
      {
        path: "/dashboard/document_validation",
        name: "List of documents awaiting confirmation",
        component: ValidationCourrier,
      },
      {
        path: "/dashboard/document_register",
        name: "Insert the document",
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
        name: "Waiting document list",
        component: CourriersDepartement,
      },
      {
        path: "/board/courriersRecu",
        name: "List of documents received by your departement",
        component: CourriersRecu,
      },
      {
        path: "/board/notifications",
        name: "notifications",
        component: Notifications,
      },
      {
        path: "/board/statistique",
        name: "document statistique of your departement",
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
        name: "List of users not approved",
        component: ListUser,
      },
      {
        path: "/adminboard/insert_role",
        name: "Insertion of role",
        component: Insert_role,
      },
      {
        path: "/adminboard/insert_departement",
        name: "Insertion of departement",
        component: InsertDepartement,
      },
      {
        path: "/adminboard/list_role",
        name: "List of roles",
        component: ListRole,
      },
      {
        path: "/adminboard/list_departement",
        name: "List of departements",
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
