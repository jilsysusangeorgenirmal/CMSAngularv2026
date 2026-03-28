import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { authGuard } from '../app/guards/auth-guard';
import { ReceptionistDashboard } from './auth/receptionist-dashboard/receptionist-dashboard';
import { DoctorDashboard } from './auth/doctor-dashboard/doctor-dashboard';
import { LabtechnicianDashboard } from './auth/labtechnician-dashboard/labtechnician-dashboard';
import { Notfound } from './auth/notfound/notfound';
import { Patient } from './models/patient';
import { PatientList } from './patients/patient-list/patient-list';
import { PatientAdd } from './patients/patient-add/patient-add';
import { PatientEdit } from './patients/patient-edit/patient-edit';
import { Appointment } from './models/appointment';
import { AppointmentList } from './appointments/appointment-list/appointment-list';
import { AppointmentAdd } from './appointments/appointment-add/appointment-add';
import { AppointmentEdit } from './appointments/appointment-edit/appointment-edit';


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
  {
    path: 'patients',
    children: [
      { path: '', component: Patient },
      // call list of patients
      { path: 'list', component: PatientList,
        canActivate:[authGuard],
        data:{role:'1'} //Receptionist
       },
      // add an patient
      { path: 'add', component: PatientAdd,
        canActivate:[authGuard],
        data:{role:'1'} //Receptionist
       },
      { path: 'edit/:id', component: PatientEdit,
        canActivate:[authGuard],
        data:{role:'1'} //Receptionist
      }
    ]
  },
  {
    path: 'appointments',
    children: [
      { path: '', component: Appointment },
      // call list of patients
      { path: 'list', component: AppointmentList,
        canActivate:[authGuard],
        data:{role:'1'} //Receptionist
       },
      // add an patient
      { path: 'add', component: AppointmentAdd,
        canActivate:[authGuard],
        data:{role:'1'} //Receptionist
       },
      { path: 'edit/:id', component: AppointmentEdit,
        canActivate:[authGuard],
        data:{role:'1'} //Receptionist
      }
    ]
  },
  {
    //WildCard route ---Login
    path:'**', component:Notfound
    //redirectTo: 'auth/login', pathMatch:'full'
  },
];
