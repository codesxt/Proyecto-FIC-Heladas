import { Component, OnInit } from '@angular/core';
import { HoboStationsService } from '../shared/services/hobostations.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-hobostation-detail',
  templateUrl: './station-details.component.html',
  styleUrls: ['./stations-create.component.scss']
})
export class StationDetailsComponent implements OnInit {
  stationId   : string;
  stationData : any;
  stationForm : FormGroup;

  constructor(
    private stationsService      : HoboStationsService,
    private notificationsService : NotificationsService,
    private route                : ActivatedRoute,
    private router               : Router,
    private formBuilder          : FormBuilder
  ) { }

  createForm(){
    this.stationForm = this.formBuilder.group({
      name        : ['', Validators.required],
      displayName : ['', Validators.required]
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
    this.stationsService.getStation(this.stationId)
    .subscribe(
      data => {
        this.notificationsService.success("Éxito", "Datos de la estación cargados correctamente.");
        this.stationData = {
          _id   : data._id,
          name  : data.attributes.name,
          displayName : data.attributes.displayName
        }
        this.stationForm.setValue({
          name   : this.stationData.name,
          displayName : this.stationData.displayName
        });
      },
      error => {

      }
    )
  }

  updateStationData(){
    if(this.stationForm.valid){
      let station = {
        name : this.stationForm.get('name').value,
        displayName : this.stationForm.get('displayName').value
      }
      this.stationsService.updateStation(this.stationId , station)
      .subscribe(
        data => {
          this.notificationsService.success('Actualzación Exitosa', 'La estación fue actualizada exitosamente.');
          this.router.navigate(['/admin-hobostations/list']);
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
