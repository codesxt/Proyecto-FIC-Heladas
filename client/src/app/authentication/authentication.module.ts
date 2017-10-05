import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  imports: [
    AuthenticationRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ]
})
export class AuthenticationModule { }
