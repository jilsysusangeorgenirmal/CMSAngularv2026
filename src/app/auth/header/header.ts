import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  //declare variables
  loginName? : string ='';

  constructor(private authService:AuthService) 
  {
  }

  ngOnInit():void{
    this.loginName = localStorage.getItem("USER_NAME")?.toString();
  }

  //Call logout()
  logOut():void{
    this.authService.logOutWithClearKeyValues();
  }
  
}
