import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { UsersService } from '../shared/services/users.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  users: any = [];
  meta : any = [];

  total    : number = 1;
  page     : number = 1;
  pageSize : number = 10;

  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private usersService         : UsersService
  ) {  }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.usersService.getUsers(this.page-1, this.pageSize)
    .subscribe(
      data => {
        this.notificationsService.success(
          'Datos cargados',
          'Los datos de usuarios se leyeron exitosamente.'
        )
        this.users = data.data;
        this.meta  = data.meta;
        this.total = this.meta['total-items'];
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Los datos de usuarios no se pudieron leer.\n'+'Detalles: '+ error.json().message
        )
      }
    );
  }

  onPageChange(event: Event){
    console.log(event);
    this.loadData();
  }
}
