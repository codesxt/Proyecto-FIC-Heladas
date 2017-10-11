import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { StationsService } from '../../shared/services/stations.service';

import * as moment from 'moment';
moment.locale('es-cl');

@Component({
  selector: 'app-public-predictions-list',
  templateUrl: './predictions-list.component.html'
})
export class PredictionsListComponent implements OnInit {
  stations : any = [];
  meta     : any = [];

  total    : number = 1;
  page     : number = 1;
  pageSize : number = 10;

  predictionDate : Date;
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private stationsService      : StationsService
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
    this.stationsService.getPublicStations(this.page-1, this.pageSize)
    .subscribe(
      data => {
        this.notificationsService.success(
          'Datos cargados',
          'Los datos de estaciones se leyeron exitosamente.'
        )
        this.stations = data.data;
        this.meta     = data.meta;
        this.total    = this.meta['total-items'];
        this.getStationsPredictions();
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Los datos de estaciones no se pudieron leer.\n'+'Detalles: '+ error.json().message
        )
      }
    );
  }

  getStationsPredictions(){
		let hour = new Date().getHours();
		let index = 0;

		for(let station of this.stations){
			if(hour < 15){
	      console.log("Consultando Predicciones del Día Anterior");
	      this.stationsService.getStationDayBeforePrediction(station._id)
	      .subscribe(
	        data => {
            station.prediction = false;
	        },
	        error => {
	          console.log(error);
	        }
	      )
	    }else{
	      console.log("Consultando Predicciones del Día Actual")
				this.stationsService.getStationDayPrediction(station._id)
	      .subscribe(
	        data => {
            station.prediction = data.data.frost;
	        },
	        error => {
	          console.log(error);
	        }
	      )
	    }
		}
	}

  onPageChange(event: Event){
    console.log(event);
    this.loadData();
  }

  deleteStation(stationId: any){
    let conf = confirm("¿Deseas eliminar la estación?");
    if(conf) {
      this.stationsService.deleteStation(stationId)
      .subscribe(
        data => {
          this.notificationsService.success("Estación Eliminada", "La estación fue eliminada exitosamente.");
          this.loadData();
        },
        error => {
          this.notificationsService.error("Error", "Se produjo un error en la eliminación de la estación.");
        }
      )
    } else {
      // NO
    }
    /*

    */
  }
}
