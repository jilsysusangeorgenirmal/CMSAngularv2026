import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// route -Url, state: activate / not
export const authGuard: CanActivateFn = (route, state) => {
  //route- The activated route snapshot  //auth/admin
  // state- the router state snapshot   //activated Route ---in url
  // returns boolean - indicating if route can be activated --true/false

  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);// wheteher we are working s browser rendering or server rendering

  if(!isPlatformBrowser(platformId)){
    //on server dont block (avoid crash)
    return true;

  }
  const token = localStorage.getItem("JWT_TOKEN");
  const currentRole = localStorage.getItem("ACCESS_ROLE");

  //1-Check login
  if(!token)
  {
    router.navigate(['auth/login'], {replaceUrl:true});
    return false;
  }

  //2-check role(if defined)
  //const expectedRole = route.data?.['roles'] as string[];
  const expectedRole = route.data?.['role'];

  console.log(expectedRole);

  if(expectedRole && currentRole !==expectedRole ){
    localStorage.removeItem("USER_NAME");
    localStorage.removeItem("ACCESS_ROLE");
    localStorage.removeItem("JWT_TOKEN");
    router.navigate(['auth/login'], {replaceUrl:true}); // replaceUrl: to replace history cache with login page 
    return false;
  }
  return true;
};
