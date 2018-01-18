import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HoboStationsService } from '../shared/services/hobostations.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-hobostations-create',
  templateUrl: './stations-create.component.html',
  styleUrls: ['./stations-create.component.scss']
})
export class StationsCreateComponent implements OnInit {
  stationList : any[] = [ ]
  stationForm: FormGroup;

  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private stationsService: HoboStationsService,
    private router: Router
  ) {  }

  ngOnInit() {
    this.stationForm = this.formBuilder.group({
      stationDisplayName : ['', Validators.required],
      stationName        : ['', Validators.required]
    })
  }

  doCreate() {
    if(this.stationForm.valid){
      let station = {
        displayName : this.stationForm.get('stationDisplayName').value,
        name        : this.stationForm.get('stationName').value
      }

      this.stationsService.createStation(station)
      .subscribe(
        data => {
          this.notificationsService.success('Creación Exitosa', 'La estación fue creada exitosamente.');
          this.router.navigate(['/admin-hobostations/list']);
        },
        error => {
          this.notificationsService.error('Error', 'No se pudo crear la estación.');
        }
      )
    }else{

    }
  }
}
