import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { AgrometService } from '../../shared/services/agromet.service';

import * as moment from 'moment';
moment.locale('es-cl');

interface marker {
	lat: number;
	lng: number;
	stationID: string;
	label?: string;
	draggable: boolean;
  iconUrl: string;
	stationData?: any;
	prediction?: any;
}

@Component({
  selector: 'app-admin-predictions-map',
  templateUrl: './predictions-map.component.html',
  styleUrls: ['./predictions-map.component.scss']
})
export class PredictionsMapComponent implements OnInit {
  stations : any = [];
  mapLat : number = -35.4422115171564;
  mapLng : number = -71.63749692030251;
  zoom: number = 9;
  markers   : marker[] = [];
	predictionDate : Date;
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private agrometService       : AgrometService
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
		this.agrometService.getAgrometPublicStations(0, 1000)
		.subscribe(
			data => {
        this.notificationsService.success(
          'Datos cargados',
          'Los datos de estaciones se leyeron exitosamente.'
        )
        this.stations = data.data
        this.getStationsPredictions()
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
		this.markers = [];
		let hour = new Date().getHours();
		let index = 0;

		for (let station of this.stations) {
      this.agrometService.getLastPrediction(station._id)
      .subscribe(
        data => {
          station.prediction = data.frost
					let iconUrl = this.getIconUrl(data.frost);
					this.markers.push({
						stationID: station._id,
						lat: station.location.coordinates[1],
						lng: station.location.coordinates[0],
						draggable: false,
						iconUrl: iconUrl,
						label: '',
						stationData: station,
						prediction: data.frost
					})
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

	getIconUrl(status: boolean): string{
		if(status==true){
			return 'assets/img/map-info.png';
		}else if(status==false){
			return 'assets/img/map-success.png';
		}else{
			return 'assets/img/map-warning.png';
		}
	}
}
