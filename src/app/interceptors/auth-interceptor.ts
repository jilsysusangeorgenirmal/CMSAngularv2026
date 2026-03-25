import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // @param req- The outgoing Http request
  // @param next - the next handler in the interceptor chain
  // @returns Observable of the HttpClient

  const router = inject(Router);
  console.log("Intercepting...");

  //1-Skip JWT for Login API
  if (req.url.includes('api/Logins')){
    console.log("Not checking JWT");
    return next(req);
  }

  //2.Get token & role
  const token = localStorage.getItem('JWT_TOKEN');
  const hasAccessRole = localStorage.getItem('ACCESS_ROLE');

  let modifiedRequest =  req;

  //3. Attach token if exists to the header
  if (token && hasAccessRole){
    modifiedRequest = req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`
      }
    });
  }

  //4- Handle response & errors
  return next(modifiedRequest).pipe(
    catchError((error:any) => {
      if (error.status == 401){
        handleUnauthorized(router);
      }
      return throwError(() => error);
    })
  );

  function handleUnauthorized(router: Router) :void {
    //Clear auth data
    localStorage.removeItem('JWT_TOKEN');
    localStorage.removeItem('ACCESS_ROLE');

    //Redirect to login ( replace history)
    router.navigate(['/auth/login'], {replaceUrl:true}); // replaceUrl: to replace history cache with login page 
  }
  
};