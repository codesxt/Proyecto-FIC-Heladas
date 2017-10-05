import { Component, OnInit } from '@angular/core';
import { UsersService } from '../shared/services/users.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-users-detail',
  templateUrl: './user-detail.component.html'
})
export class AdminUserDetailsComponent implements OnInit {
  userId   : string;
  userData : any;
  userForm : FormGroup;
  roleList = ['user', 'administrator'];
  constructor(
    private usersService       : UsersService,
    private notificationsService : NotificationsService,
    private route                : ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  createForm(){
    this.userForm = this.formBuilder.group({
      name : ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role : ['', Validators.required]
    })
  }

  ngOnInit() {
    this.createForm();
    this.route.params.subscribe(params => {
       this.userId = params['id']
       this.loadUserData();
    });
  }

  loadUserData(){
    this.usersService.getUser(this.userId)
    .subscribe(
      data => {
        this.notificationsService.success("Éxito", "Datos del usuario cargados exitosamente.");
        this.userData = {
          _id  : data._id,
          email: data.attributes.email,
          name : data.attributes.name,
          role : data.attributes.role
        }
        this.userForm.setValue({
          name : this.userData.name,
          email: this.userData.email,
          role : this.userData.role
        });
      },
      error => {

      }
    )
  }

  updateUserData(){
    if(this.userForm.valid){
      this.usersService.updateUser(this.userId, this.userForm.value)
      .subscribe(
        data => {
          this.notificationsService.success("Datos actualizados", "Los datos del usuario se actualizaron exitosamente.");
        },
        error => {
          this.notificationsService.error("Error", error.message);
        }
      )
    }else{
      this.notificationsService.error("Error", "Los datos del usuario no son válidos.");
    }
  }
}
