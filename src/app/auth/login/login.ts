import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  //declare variables  ----FormGroup, FormBuilder
  loginForm!: FormGroup; // ! assertion assignment operator expects all properties inside form to be initialised.

  isSubmitted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthService,
  ) {}

  //Life cycle Hook
  ngOnInit(): void {
    //Create Reactive Form --RxJS validation
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.]{3,20}$')]], //RxJS Validation
      password: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9@]{3,10}$')]],
    });
  }

  //1-Get All Controls of loginForm for Validation
  get getAllformControls() {
    return this.loginForm.controls;
  }

  //2-Login Functionality
  //Based on roleId redirect tp the respective dashboard
  checkLoginCredentials(): void {
    //Setting isSubmitted
    this.isSubmitted = true;

    //Check form is INVALID
    if (this.loginForm?.invalid) {
      this.errorMessage = 'Please enter Username and Password';
      return;
    }

    //Check form is VALID..then proceeds and redirect to the dashboard based on roleId
    if (this.loginForm?.valid) {
      this.errorMessage = '';
      this.isLoading = true;
      console.log(this.loginForm.value);

      //Call REST API to check UserName and Password
      this.authService.loginVerify(this.loginForm.value).subscribe(
        (response: any) => {
          this.isLoading = false;
          console.log(response);

          //Based on Role, need to redirect
          if (response.roleId === 0) {
            this.errorMessage = 'Invalid Username and password';
          }
          if (response.roleId === 1) {
            console.log('Receptionist');
            //Local Storage
            localStorage.setItem('USER_NAME', response.uName);
            localStorage.setItem('ACCESS_ROLE', response.roleId.toString());
            localStorage.setItem('JWT_TOKEN', response.token);
            //redirect to Receptionist
            this.router.navigate(['/auth/receptionist']);
          } else if (response.roleId === 2) {
            console.log('Doctor');
            //Local Storage
            localStorage.setItem('USER_NAME', response.uName);
            localStorage.setItem('ACCESS_ROLE', response.roleId.toString());
            localStorage.setItem('JWT_TOKEN', response.token);
            //redirect to Doctor
            this.router.navigate(['/auth/doctor']);
          }
          else if (response.roleId === 4) {
            console.log('Lab_technician');
            //Local Storage
            localStorage.setItem('USER_NAME', response.uName);
            localStorage.setItem('ACCESS_ROLE', response.roleId.toString());
            localStorage.setItem('JWT_TOKEN', response.token);
            //redirect to labtechnician
            this.router.navigate(['/auth/labtechnician']);
          } 
          else {
            this.errorMessage = 'Sorry! Invalid credentials not allowed';
          }
        },
        (error: any) => {
          this.isLoading = false;
          console.log(error);
          this.errorMessage = 'Sorry! Invalid credentials';
        },
      );
    }
  }
}
