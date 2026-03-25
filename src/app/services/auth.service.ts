import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Staff } from '../models/staff';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private httpClient:HttpClient, private router:Router) {

  }

  //1-Login-- Verify Credentails Username and Password
  public loginVerify(staff:Staff):Observable<any>{

    //Call WebAPI for checking UserName and Password
    return this.httpClient.get<Staff>(environment.apiUrl + 'Logins/' + staff.username + '/' + staff.password);

  }

  //2-Logout functionaloity
  public logOutWithClearKeyValues(){
    //clear all sessions and localstorage keys
    localStorage.removeItem('USER_NAME');
    localStorage.removeItem("ACCESS_Role");
    localStorage.removeItem("JWT_TOKEN");

    //redirect to Login
    this.router.navigate(['auth/login']);
  }

  //3- Check if the User is currently logged in
  isLoggedIn():boolean{
    return localStorage.getItem('USER_NAME') !== null;

  }
}
