import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./authentication.scss']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  registerForm: FormGroup;
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
    this.registerForm = this.formBuilder.group({
      name : ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwords: this.formBuilder.group({
        password: ['', Validators.required],
        repeat: ['', Validators.required]
      }, {validator: this.areEqual})
    })
  }

  areEqual(group: FormGroup) {
    let val;
    let valid = true;
    for (let name in group.controls) {
      if (val === undefined) {
        val = group.controls[name].value
      } else {
        if (val !== group.controls[name].value) {
          valid = false;
          break;
        }
      }
    }
    if (valid) {
      return null;
    }
    return {
      areEqual: true
    };
  }

  doRegister(){
    if(this.registerForm.valid){
      if(this.model.password1 != this.model.password2){
        alert("Las contraseñas no coinciden");
      }else{
        this.authenticationService.register({
          name: this.registerForm.value.name,
          email: this.registerForm.value.email,
          password1: this.registerForm.value.passwords.password,
          password2: this.registerForm.value.passwords.repeat
        })
        .subscribe(
          data => {
            this.authenticationService.saveToken(data.token);
            this.router.navigate(['/auth/login']);
          },
          error => {
            this.formError = true;
            this.errorMessage = "Ocurrió un error al registrarse. Revise que los datos sean correctos e intente nuevamente. \n Detalles del error: " + error.json().message;
            console.log("Ocurrió un error.");
            console.log(error.json());
          }
        );
      }
    }
  }

  ngOnInit() {
    if(this.authenticationService.isLoggedIn()){
      this.router.navigate(['/dashboard']);
    }
  }
}
