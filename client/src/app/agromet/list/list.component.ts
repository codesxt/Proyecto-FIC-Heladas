import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { StationsService } from '../../shared/services/stations.service';
import { AgrometService } from '../../shared/services/agromet.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import * as zpad from 'zpad';
import * as moment from 'moment';

@Component({
  selector: 'app-agromet-list',
  templateUrl: './list.component.html'
})
export class AgrometListComponent implements OnInit {
  stations : any = [];

  total    : number = 1;
  page     : number = 1;
  pageSize : number = 10;
  constructor(
    private notificationsService  : NotificationsService,
    private stationsService       : StationsService,
    private agrometService        : AgrometService,
    @Inject('moment') private moment
  ) {  }

  ngOnInit(){
    this.loadData();
  }

  loadData(){
    this.agrometService.getAgrometStations(this.page-1, this.pageSize)
    .subscribe(
      data => {
        this.notificationsService.success(
          'Datos cargados',
          'Los datos de estaciones se leyeron exitosamente.'
        )
        this.stations = data.data;
        this.total    = data.meta['total-items'];
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Los datos de estaciones no se pudieron leer.\n'+'Detalles: '+ error.json().message
        )
      }
    );
  }

  removeStation(){
    alert('Va a eliminar una estación, oiga.');
  }
}
