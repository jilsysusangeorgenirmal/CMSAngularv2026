import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { authGuard } from '../app/guards/auth-guard';
import { ReceptionistDashboard } from './auth/receptionist-dashboard/receptionist-dashboard';
import { DoctorDashboard } from './auth/doctor-dashboard/doctor-dashboard';
import { LabtechnicianDashboard } from './auth/labtechnician-dashboard/labtechnician-dashboard';
import { Notfound } from './auth/notfound/notfound';


export const routes: Routes = [
  //Lazy Loading
  {
   //empty path 
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    //authentication
    path:'auth',
    children:[
      {path:'login', component: Login},
      {path:'receptionist', component: ReceptionistDashboard,
        canActivate:[authGuard],
        data:{role: '1'}
      },       //Receptionist
      {path:'doctor', component: DoctorDashboard,
         canActivate:[authGuard],
        data:{role: '2'}
      },      //Doctor
      {path:'labtechnician', component: LabtechnicianDashboard,
         canActivate:[authGuard],
        data:{role: '4'}
      },     // LabTechnician
      {path:'not found', component: Notfound} 
    ]
  },
//   {
//     path: 'employees',
//     children: [
//       { path: '', component: Employees },
//       // call list of employees
//       { path: 'list', component: EmployeeList,
//         canActivate:[authGuard],
//         data:{role:'2'} //Manager
//        },
//       // add an employee
//       { path: 'add', component: EmployeeAdd,
//         canActivate:[authGuard],
//         data:{role:'2'} //Manager
//        },
//       { path: 'edit/:id', component: EmployeeEdit,
//         canActivate:[authGuard],
//         data:{role:['1', '2']} //acess both admin & manager by giving array
//       }
//     ]
//   },
  {
    //WildCard route ---Login
    path:'**', component:Notfound
    //redirectTo: 'auth/login', pathMatch:'full'
  },
];
