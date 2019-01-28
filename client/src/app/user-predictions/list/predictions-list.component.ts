import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { AgrometService } from '../../shared/services/agromet.service';
import { SubscriptionsService } from '../../shared/services/subscriptions.service';

import * as moment from 'moment';
moment.locale('es-cl');

@Component({
  selector: 'app-admin-predictions-list',
  templateUrl: './predictions-list.component.html'
})
export class PredictionsListComponent implements OnInit {
  stations : any = [];
  meta     : any = [];

  total    : number = 1;
  page     : number = 1;
  pageSize : number = 10;

  predictionDate : Date;

  subscriptions : any[] = [];
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private agrometService       : AgrometService,
    private subscriptionsService : SubscriptionsService
  ) {  }

  ngOnInit() {
    let hour = new Date().getHours();
		if(hour < 15){
			this.predictionDate = moment().toDate();
		}else{
			this.predictionDate = moment().add(1, 'days').toDate();
		}
    this.loadData();
  }

  loadData(){
    this.agrometService.getAgrometPublicStations(this.page-1, this.pageSize)
    .subscribe(
      data => {
        this.notificationsService.success(
          'Datos cargados',
          'Los datos de estaciones se leyeron exitosamente.'
        )
        this.stations = data.data
        this.total    = data.meta['total-items']
        this.getStationsPredictions()
        this.getUserSubscriptions()
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Los datos de estaciones no se pudieron leer.\n'+'Detalles: '+ error.json().message
        )
      }
    )
  }

  getStationsPredictions(){
    for (let station of this.stations) {
      this.agrometService.getLastPrediction(station._id)
      .subscribe(
        data => {
          station.prediction = data.frost
        },
        error => {
          console.log(error)
          this.notificationsService.error(
            'Error',
            'No se obtuvo la predicción para la estación ' + station.name
          )
        }
      )
    }
	}

  onPageChange(event: Event){
    console.log(event);
    this.loadData();
  }

  getUserSubscriptions () {
    this.subscriptionsService.getSubscriptions()
    .subscribe(
      data => {
        let subscriptionsIds = [];
        for(let subscription of data.subscriptions){
          subscriptionsIds.push(subscription._id);
        }
        this.subscriptions = [];
        for(let station of this.stations){
          this.subscriptions.push(subscriptionsIds.indexOf(station._id) > -1);
        }
      },
      error => {

      }
    )
  }

  switchClicked(event, station, index){
    console.log(event);
    console.log(station);
    if(this.subscriptions[index]==false){
      this.subscriptionsService.subscribeToStation(station._id)
      .subscribe(
        data => {
          console.log(data);
          this.notificationsService.success(
            'Suscripción Exitosa',
            'Se ha suscrito exitosamente a la estación.'
          )
        },
        error => {
          this.notificationsService.error(
            'Error en la Suscripción',
            'Ocurrió un error en la suscripción. Detalles: ' + error.message
          )
          this.subscriptions[index] = false;
        }
      )
    }else{
      // Desuscribir
      this.subscriptionsService.unsubscribeToStation(station._id)
      .subscribe(
        data => {
          console.log(data);
          this.notificationsService.success(
            'Suscripción Cancelada',
            'Se canceló la suscripción.'
          )
        },
        error => {
          this.notificationsService.error(
            'Error en la Suscripción',
            'Ocurrió un error en la suscripción. Detalles: ' + error.message
          )
          this.subscriptions[index] = true;
        }
      )
    }
  }
}
