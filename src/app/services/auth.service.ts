import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
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
    return this.httpClient.get<any>(environment.apiUrl + 'Logins/' + staff.username + '/' + staff.password)
      .pipe(
        tap((response: any) => {
          if (response && response.token) {
             this.saveAuthData(response);
          }
        })
      );
  }

  public saveAuthData(response: any) {
    localStorage.setItem('USER_NAME', response.uName);
    localStorage.setItem('ACCESS_ROLE', response.roleId.toString());
    localStorage.setItem('JWT_TOKEN', response.token);
  }

  //2-Logout functionaloity
  public logOutWithClearKeyValues(){
    //clear all sessions and localstorage keys
    localStorage.removeItem('USER_NAME');
    localStorage.removeItem("ACCESS_ROLE");
    localStorage.removeItem("JWT_TOKEN");

    //redirect to Login
    this.router.navigate(['auth/login']);
  }

  //3- Check if the User is currently logged in
  isLoggedIn():boolean{
    return localStorage.getItem('USER_NAME') !== null;
  }
}
