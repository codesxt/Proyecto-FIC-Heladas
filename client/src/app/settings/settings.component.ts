import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../shared/services/profile.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-register',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  profileData : any = {};
  settings    : any = {};
  constructor(
    private profileService       : ProfileService,
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService
  ) {  }

  loadData(){
    this.profileService.getProfile()
    .subscribe(
      data => {
        this.profileData = data;
        this.notificationsService.success(
          'Carga Exitosa',
          'Datos de usuario cargados exitosamente.'
        )
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Ocurrió un error en la obtención de los datos.'
        )
      }
    );
    this.profileService.getSettings()
    .subscribe(
      data => {
        this.settings = data.settings;
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Ocurrió un error en la obtención de la configuración.'
        )
      }
    );
  }

  updateProfile(){
    let user = {
      _id  : this.profileData._id,
      name : this.profileData.name,
      email: this.profileData.email
    }
    this.profileService.updateProfile(user)
    .subscribe(
      data => {
        this.notificationsService.success(
          'Perfil actualizado',
          'Los datos del usuario se actualizaron exitosamente.'
        )
        this.profileData = data.user;
        this.authenticationService.saveToken(data.token);
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Los datos del usuario no se pudieron actualizar.'
        )
        alert(JSON.stringify(error));
      }
    );
  }

  updateSettings(){
    let settings = {
      dailyEmail  : this.settings.dailyEmail
    }
    this.profileService.updateSettings(settings)
    .subscribe(
      data => {
        this.notificationsService.success(
          'Perfil actualizado',
          'Los datos del usuario se actualizaron exitosamente.'
        )
        this.settings = data.settings;
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Las configuraciones no se pudieron actualizar.'
        )
        console.log(error);
      }
    );
  }

  ngOnInit() {
    this.loadData();
  }
}
