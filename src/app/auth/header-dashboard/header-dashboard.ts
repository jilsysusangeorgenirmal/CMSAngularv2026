import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-dashboard',
  standalone:true,
  imports: [CommonModule,RouterLink, RouterModule],
  templateUrl: './header-dashboard.html',
  styleUrl: './header-dashboard.css',
})
export class HeaderDashboard {
  //declare variables
    loginName? : string ='';
  
    constructor(private authService:AuthService, private router: Router) 
    {
    }
  
    ngOnInit():void{
      this.loginName = localStorage.getItem("USER_NAME")?.toString();
    }
  
    //Call logout()
    logOut():void{
      this.authService.logOutWithClearKeyValues();
    }

    dashboard():void{
      console.log('dashboard...');
       this.router.navigate(['/auth/receptionist']);
    }
    
  }
