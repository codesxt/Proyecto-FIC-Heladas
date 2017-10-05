import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {
  user : any = {};
  public options = {
    position: ["top", "left"],
    timeOut: 1500,
    lastOnBottom: true,
    maxLength: 0,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: false
  };
  constructor(
    private authenticationService : AuthenticationService,
    private router : Router,
    private notificationsService : NotificationsService
  ){ }
  public disabled = false;
  public status: {isopen: boolean} = {isopen: false};

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit(){
    if(!this.authenticationService.isLoggedIn()){
      this.notificationsService.alert("Error", "Debes acceder para poder usar la aplicación.");
      this.router.navigate(['/auth/login']);
    }else{
      this.notificationsService.success("Ingreso Exitoso", "Has ingresado exitosamente al sistema.");
      this.user = this.authenticationService.getCurrentUser();
    }
  }

  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/auth/login']);
  }

  isAdmin(){
    return this.user.role == "administrator";
  }
}
