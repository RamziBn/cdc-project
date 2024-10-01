import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Departement from "../Pages/DepartementRep/Departement";
import Competences from "../Pages/CompetencesRep/Competences";
import User from "../Pages/UserRep/User";
import Register from "../Pages/user/Register";
import Login from "../Pages/user/Login";
import DetailDepartement from "../Pages/DepartementRep/DetailDepartement";
import UpdateDepartement from "../Pages/DepartementRep/UpdateDepartement";
import UserCompetence from "../Pages/UserRep/UserCompetence";
import AjouterUserCompetence from "../Pages/UserRep/AjouterUserCompetence";
import UpdateCompetence from "../Pages/CompetencesRep/UpdateCompetence";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../Pages/DashboardRep/Dashboard";
import AdminHome from "../Pages/DashboardRep/admin/adminHome";
import UserHome from "../Pages/DashboardRep/user/userHome";
import ManageUser from "../Pages/DashboardRep/admin/manageUser";
import UpdateUser from "../Pages/DashboardRep/admin/UpdateUser";
import ManageDepartement from "../Pages/DashboardRep/admin/ManageDepartement";
import UpadateDep from "../Pages/DashboardRep/admin/UpadateDep";
import UpdateDep from "../Pages/DashboardRep/admin/UpadateDep";
import ManageCompetence from "../Pages/DashboardRep/admin/ManageCompetence";
import AjoutCompetence from "../Pages/DashboardRep/admin/AjouterCompetence";
import UpadateCom from "../Pages/DashboardRep/admin/UpdateCompetence";
import ManagePost from "../Pages/DashboardRep/admin/ManagePost";
import AjoutPost from "../Pages/DashboardRep/admin/AjoutPost";
import ManageUserCom from "../Pages/DashboardRep/admin/ManageUserCom";
import AjoutUserCom from "../Pages/DashboardRep/admin/AjoutUserCom";
import UpdatePost from "../Pages/DashboardRep/admin/UpdatePost";
import AddUser from "../Pages/DashboardRep/admin/AddUser";
import UpdateUserCom from "../Pages/DashboardRep/admin/UpdateUserCom";
import SuperVisorHome from "../Pages/DashboardRep/supervisor/SuperVisorHome";
import ManageUserSu from "../Pages/DashboardRep/supervisor/manageUserSu";
import AddUserSu from "../Pages/DashboardRep/supervisor/AddUserSu";
import UpdateUserSu from "../Pages/DashboardRep/supervisor/UpdateUserSu";
import ManageDepartementSu from "../Pages/DashboardRep/supervisor/ManageDepartementSu";
import UpdateDepSu from "../Pages/DashboardRep/supervisor/UpadateDepSu";
import ManageCompetenceSu from "../Pages/DashboardRep/supervisor/ManageCompetenceSu";
import AjoutCompetenceSu from "../Pages/DashboardRep/supervisor/AjouterCompetenceSu";
import UpdateCompetenceSu from "../Pages/DashboardRep/supervisor/UpdateCompetenceSu";
import ManagePostSu from "../Pages/DashboardRep/supervisor/ManagePostSu";
import AjoutPostSu from "../Pages/DashboardRep/supervisor/AjoutPostSu";
import UpdatePostSu from "../Pages/DashboardRep/supervisor/UpdatePostSu";
import ManageUserComSu from "../Pages/DashboardRep/supervisor/ManageUserComSu";
import AjoutUserComSu from "../Pages/DashboardRep/supervisor/AjoutUserComSu";
import AjoutDepSu from "../Pages/DashboardRep/supervisor/AjoutDepSu";
import AjoutDep from "../Pages/DashboardRep/admin/AjoutDep";
import ManageKpis from "../Pages/DashboardRep/admin/ManageKpis";
import AddKpi from "../Pages/DashboardRep/admin/AddKpi";
import UpdateKpi from "../Pages/DashboardRep/admin/UpdateKpi";
import UserCompetenceDetails from "../Pages/DashboardRep/admin/UserCompetenceDetails";
import AddFormule from "../Pages/DashboardRep/admin/AddFormule";
import ManageFormule from "../Pages/DashboardRep/admin/ManageFormule";
import UpdateFormule from "../Pages/DashboardRep/admin/UpdateFormule";
import ManageUserKpi from "../Pages/DashboardRep/admin/ManageUserKpi";
import AjoutUserKpi from "../Pages/DashboardRep/admin/AjoutUserKpi";
import UpdateUserKpi from "../Pages/DashboardRep/admin/UpdateUserKpi";
import ManageNote from "../Pages/DashboardRep/admin/ManageNote";
import AddFormuleGen from "../Pages/DashboardRep/admin/AddFormulGen";
import ManageFormuleGen from "../Pages/DashboardRep/admin/ManageFormuleGen ";
import UpdateFormuleGen from "../Pages/DashboardRep/admin/UpdateFormuleGen";
import AddIndicateur from "../Pages/DashboardRep/admin/AddIndicateur";
import ManageIndicateur from "../Pages/DashboardRep/admin/ManageIndicateur";
import ManageNotefinale from "../Pages/DashboardRep/admin/ManageNotefinale";

export const router = createBrowserRouter([
  {
    path:"/",
    element: <MainLayout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "departement",
        element: <Departement/>
      },
      {
        path: "departement/:id",
        element: <DetailDepartement/>
      },
      {
        path: "departement/update/:id",
        element: <UpdateDepartement/>
      },
      {
        path: "competences/ajout",
        element: <AjoutCompetence/>
      },
      {
        path: "competences/update/:id",
        element: <UpdateCompetence/>
      },
      
      {
        path: "competences",
        element: <Competences/>
      },
      {
        path: "usercompetences",
        element: <UserCompetence/>
      },
      {
        path: "ajout-usercompetences",
        element: <AjouterUserCompetence/>
      },
      {
        path: "user",
        element: <User/>
      },
      {
        path: "login",
        element: <Login/>
      },
      {
        path:"register",
        element:<Register/>
      }
      
    ]
  },
  {
    path: "/dashboard",
    element: <DashboardLayout/>,
    children:[{
      index: true,
      element:<Dashboard/>
    },
    //user
    {
      path: "user-home",
      element: <UserHome/>
    },

    //admin
    {
      path: "admin-home",
      element: <AdminHome/>
    },
    {
      path: "manager-user",
      element: <ManageUser/>
    },
    {
      path: "add-user",
      element: <AddUser/>
    },
    {
      path: 'update-user/:id',
      element: <UpdateUser/>,
      loader: ({params}) => fetch(`http://localhost:3000/user/id/${params.id}`)
    },
    {
      path: "manage-departement",
      element: <ManageDepartement/>
    },
    {
      path: "add-dep",
      element: <AjoutDep/>
    },
    {
      path: 'update-departement/:id',
      element: <UpdateDep/>,
      loader: ({params}) => fetch(`http://localhost:3000/dep/${params.id}`)
    },
    {
      path: "manage-competence",
      element: <ManageCompetence/>
    },
    {
      path: "add-competence",
      element: <AjoutCompetence/>
    },
    {
      path: 'update-competence/:id',
      element: <UpadateCom/>,
      loader: ({params}) => fetch(`http://localhost:3000/cat-details/${params.id}`)
    },
    {
      path: "manage-post",
      element: <ManagePost/>
    },
    {
      path: "add-post",
      element: <AjoutPost/>
    },
    {
      path: 'update-post/:id',
      element: <UpdatePost/>,
      loader: ({params}) => fetch(`http://localhost:3000/post/${params.id}`)
    },
    {
      path: "manage-usercom",
      element: <ManageUserCom/>
    },
    {
      path: "add-usercom",
      element: <AjoutUserCom/>
    },
    {
      path: 'update-usercom/',
      element: <UpdateUserCom/>
    },

    {
      path: "manage-kpi",
      element: <ManageKpis/>
    },
    {
      path: "add-kpi",
      element: <AddKpi/>
    },
    {
      path: 'update-kpi/:id',
      element: <UpdateKpi/>,
      loader: ({params}) => fetch(`http://localhost:3000/kpis/${params.id}`)
    },

    // les nouveau pageque j'ai ajouter 
    {
      path: "usercompetencedetail",
      element: <UserCompetenceDetails/>
    },
    {
      path: "addformule",
      element: <AddFormule/>
    },
    {
      path: "manage-formule",
      element: <ManageFormule/>
    },
    {
      path: 'update-formule/:id',
      element: <UpdateFormule/>,
      loader: ({params}) => fetch(`http://localhost:3000/formules/${params.id}`)
    },
    {
      path: "add-userkpi",
      element: <AjoutUserKpi/>
    },
    {
      path: "manage-userkpi",
      element: <ManageUserKpi/>
    },
    {
      path: 'update-userkpi',
      element: <UpdateUserKpi/>,
      loader: ({params}) => fetch(`http://localhost:3000/user-kpi-info/${params.id}`)
    },
    {
      path: "manage-note",
      element: <ManageNote/>
    },
    {
      path: "add-formule-gen",
      element: <AddFormuleGen/>
    },
    {
      path: "manage-formule-gen",
      element: <ManageFormuleGen/>
    },
    {
      path: 'update-formule-gen/:id',
      element: <UpdateFormuleGen/>,
      loader: ({params}) => fetch(`http://localhost:3000/formules-gen/${params.id}`)
    },
    {
      path: "add-indicateur",
      element: <AddIndicateur/>
    },
    {
      path: "manage-indicateur",
      element: <ManageIndicateur/>
    },
    {
      path: "manage-notef",
      element: <ManageNotefinale/>
    },





    

    //************supervisor*********
    {
      path: "supervisor-home",
      element: <SuperVisorHome/>
    },
    {
      path: "manager-usersu",
      element: <ManageUserSu/>
    },
    {
      path: "add-usersu",
      element: <AddUserSu/>
    },
    {
      path: 'update-usersu/:id',
      element: <UpdateUserSu/>,
      loader: ({params}) => fetch(`http://localhost:3000/user/id/${params.id}`)
    },
    {
      path: "manage-departementsu",
      element: <ManageDepartementSu/>
    },
    {
      path: "add-depsu",
      element: <AjoutDepSu/>
    },
    {
      path: 'update-departementsu/:id',
      element: <UpdateDepSu/>,
      loader: ({params}) => fetch(`http://localhost:3000/dep/${params.id}`)
    },
    {
      path: "manage-competencesu",
      element: <ManageCompetenceSu/>
    },
    {
      path: "add-competencesu",
      element: <AjoutCompetenceSu/>
    },
    {
      path: 'update-competencesu/:id',
      element: <UpdateCompetenceSu/>,
      loader: ({params}) => fetch(`http://localhost:3000/cat-details/${params.id}`)
    },
    {
      path: "manage-postsu",
      element: <ManagePostSu/>
    },
    {
      path: "add-postsu",
      element: <AjoutPostSu/>
    },
    {
      path: 'update-postsu/:id',
      element: <UpdatePostSu/>,
      loader: ({params}) => fetch(`http://localhost:3000/post/${params.id}`)
    },
    {
      path: "manage-usercomsu",
      element: <ManageUserComSu/>
    },
    {
      path: "add-usercomsu",
      element: <AjoutUserComSu/>
    },
    {
      path: 'update-usercomsu/',
      element: <UpdateUserCom/>
    },

   ]
  }
  
]);