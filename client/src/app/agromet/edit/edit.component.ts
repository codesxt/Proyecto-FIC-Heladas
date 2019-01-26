import { Component, OnInit } from '@angular/core';
import { AgrometService } from '../../shared/services/agromet.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-agromet-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../map.scss']
})
export class AgrometEditComponent implements OnInit {
  stationId   : string;
  stationData : any;
  stationForm : FormGroup;

  mapLat : number = -35.4422115171564;
  mapLng : number = -71.63749692030251;
  lat: number = this.mapLat;
  lng: number = this.mapLng;
  zoom: number = 8;
  constructor(
    private agrometService       : AgrometService,
    private notificationsService : NotificationsService,
    private route                : ActivatedRoute,
    private router               : Router,
    private formBuilder          : FormBuilder
  ) { }

  createForm(){
    this.stationForm = this.formBuilder.group({
      name                : ['', Validators.required],
      settings_autobackup : ['', Validators.required]
    })
  }

  ngOnInit() {
    this.createForm();
    this.route.params.subscribe(params => {
       this.stationId = params['id']
       this.loadStationData();
    });
  }

  loadStationData(){
    this.agrometService.getAgrometStation(this.stationId)
    .subscribe(
      data => {
        this.notificationsService.success("Éxito", "Datos de la estación cargados correctamente.");
        this.stationData = {
          _id      : data.id,
          station  : data.attributes.station,
          name     : data.attributes.name,
          region   : data.attributes.region,
          city     : data.attributes.city,
          settings : data.attributes.settings
        }

        this.mapLat = data.attributes.location.coordinates[1]
        this.mapLng = data.attributes.location.coordinates[0]
        this.lat = this.mapLat
        this.lng = this.mapLng

        this.stationForm.setValue({
          name                : this.stationData.name,
          settings_autobackup : this.stationData.settings.autobackup
        });
      },
      error => {

      }
    )
  }

  updateStationData(){
    if(this.stationForm.valid){
      let updateData = {
        name: this.stationForm.get('name').value,
        location: {
          type: 'Point',
          coordinates: [
            this.lng,
            this.lat
          ]
        }
        settings: {
          autobackup : this.stationForm.get('settings_autobackup').value
        }
      };
      this.agrometService.updateAgrometStation(this.stationData._id, updateData)
      .subscribe(
        data => {
          this.notificationsService.success("Éxito", "Datos de la estación actualizados correctamente.");
          this.router.navigate(['/agromet/list']);
        },
        error => {
          this.notificationsService.error("Error", error.json().message);
        }
      )
    }else{

    }
  }

  goBack(){
    this.router.navigate(['/agromet/list']);
  }

  // Métodos relacionados con mapas
  mapClicked($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
  }
}
