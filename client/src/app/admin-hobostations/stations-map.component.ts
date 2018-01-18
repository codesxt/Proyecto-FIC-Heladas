import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { StationsService } from '../shared/services/stations.service';

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
  iconUrl: string;
	stationData?: any;
}

@Component({
  selector: 'app-admin-stations-map',
  templateUrl: './stations-map.component.html',
  styleUrls: ['./stations-create.component.scss']
})
export class StationsAdminMapComponent implements OnInit {
  stations : any = [];
  mapLat : number = -35.4422115171564;
  mapLng : number = -71.63749692030251;
  zoom: number = 8;
  markers   : marker[] = [];
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private stationsService      : StationsService
  ) {  }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.stationsService.getStations(0, 0)
    .subscribe(
      data => {
        this.notificationsService.success(
          'Datos cargados',
          'Los datos de estaciones se leyeron exitosamente.'
        )
        this.stations = data.data;
        for(let station of this.stations){
          this.markers.push({
            lat: station.location.coordinates[1],
            lng: station.location.coordinates[0],
            draggable: false,
            iconUrl: '',
            label: station.name,
						stationData: station
          });
        }
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Los datos de estaciones no se pudieron leer.\n'+'Detalles: '+ error.json().message
        )
      }
    );
  }
}
