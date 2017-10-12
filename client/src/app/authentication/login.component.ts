import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./authentication.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formError: boolean = false;
  errorMessage: string = "";
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  createForm(){
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {
    if(this.authenticationService.isLoggedIn()){
      this.router.navigate(['/dashboard']);
    }
  }

  doLogin(){
    if(this.loginForm.valid){
      this.authenticationService.login(this.loginForm.value)
      .subscribe(
        data => {
          this.authenticationService.saveToken(data.token);
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.formError = true;
          this.errorMessage = "Ocurrió un error al acceder. Revise que los datos sean correctos e intente nuevamente. \n Detalles del error: " + error.json().message;
          console.log("Ocurrió un error.");
          console.log(error.json());
        }
      );
    }
  }

  sendToRegister(){
    this.router.navigate(['/auth/register']);
  }
}
