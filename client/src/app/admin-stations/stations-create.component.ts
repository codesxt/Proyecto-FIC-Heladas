import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StationsService } from '../shared/services/stations.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-stations-create',
  templateUrl: './stations-create.component.html',
  styleUrls: ['./stations-create.component.scss']
})
export class StationsCreateComponent implements OnInit {
  stationList : any[] = [ ]
  stationForm: FormGroup;

  mapLat : number = -35.4422115171564;
  mapLng : number = -71.63749692030251;
  lat: number = this.mapLat;
  lng: number = this.mapLng;
  zoom: number = 8;
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private stationsService: StationsService,
    private router: Router
  ) {  }

  ngOnInit() {
    this.stationForm = this.formBuilder.group({
      name: ['', Validators.required],
      ema: ['', Validators.required],
      public: [true, Validators.required]
    })

    this.stationsService.getEmaList()
    .subscribe(
      data => {
        this.stationList = data.data;
        this.stationForm.patchValue({
          ema: this.stationList[0].id
        })
      },
      error => {
        this.notificationsService.error(
          'Error',
          'La lista de EMAs no se pudo leer.\n'+'Detalles: '+ error.json().message
        )
      }
    );
  }

  mapClicked($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
  }

  doCreate() {
    if(this.stationForm.valid){
      let station = {
        name: this.stationForm.get('name').value,
        ema: this.stationForm.get('ema').value,
        public: this.stationForm.get('public').value,
        lat: this.lat,
        lng: this.lng
      }
      this.stationsService.createStation(station)
      .subscribe(
        data => {
          this.notificationsService.success('Creación Exitosa', 'La estación fue creada exitosamente.');
          this.router.navigate(['/admin-stations/list']);
        },
        error => {
          this.notificationsService.error('Error', 'No se pudo crear la estación.');
        }
      )
    }else{

    }
  }
}
