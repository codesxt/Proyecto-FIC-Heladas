import { Component, OnInit } from '@angular/core';
import { StationsService } from '../shared/services/stations.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-station-detail',
  templateUrl: './station-details.component.html',
  styleUrls: ['./stations-create.component.scss']
})
export class StationDetailsComponent implements OnInit {
  stationId   : string;
  stationData : any;
  stationForm : FormGroup;

  stationList : any[] = [ ];

  mapLat : number = -35.4422115171564;
  mapLng : number = -71.63749692030251;
  lat: number = this.mapLat;
  lng: number = this.mapLng;
  zoom: number = 8;
  constructor(
    private stationsService      : StationsService,
    private notificationsService : NotificationsService,
    private route                : ActivatedRoute,
    private router               : Router,
    private formBuilder          : FormBuilder
  ) { }

  createForm(){
    this.stationForm = this.formBuilder.group({
      name    : ['', Validators.required],
      ema     : ['', Validators.required],
      public  : ['', Validators.required]
    })
  }

  ngOnInit() {
    this.createForm();
    this.route.params.subscribe(params => {
       this.stationId = params['id']
       this.loadStationData();
    });
    this.stationsService.getEmaList()
    .subscribe(
      data => {
        this.stationList = data.data;
      },
      error => {
        this.notificationsService.error(
          'Error',
          'La lista de EMAs no se pudo leer.\n'+'Detalles: '+ error.json().message
        )
      }
    );
  }

  loadStationData(){
    this.stationsService.getStation(this.stationId)
    .subscribe(
      data => {
        this.notificationsService.success("Éxito", "Datos de la estación cargados correctamente.");
        this.stationData = {
          _id   : data._id,
          name  : data.attributes.name,
          idEMA : data.attributes.idEMA,
          public: data.attributes.public
        }
        this.mapLat = data.attributes.location.coordinates[1];
        this.mapLng = data.attributes.location.coordinates[0];
        this.lat = this.mapLat;
        this.lng = this.mapLng;
        this.stationForm.setValue({
          name   : this.stationData.name,
          ema    : this.stationData.idEMA,
          public : this.stationData.public
        });
      },
      error => {

      }
    )
  }

  mapClicked($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
  }

  updateStationData(){
    if(this.stationForm.valid){
      let station = {
        name: this.stationForm.get('name').value,
        ema: this.stationForm.get('ema').value,
        public: this.stationForm.get('public').value,
        lat: this.lat,
        lng: this.lng
      }
      this.stationsService.updateStation(this.stationId , station)
      .subscribe(
        data => {
          this.notificationsService.success('Actualzación Exitosa', 'La estación fue actualizada exitosamente.');
          this.router.navigate(['/admin-stations/list']);
        },
        error => {
          this.notificationsService.error('Error', 'No se pudo actualizar la estación.');
        }
      )
    }else{

    }
  }

  /*
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
  }*/
}
