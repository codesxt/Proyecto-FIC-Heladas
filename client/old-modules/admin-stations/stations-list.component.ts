import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { StationsService } from '../shared/services/stations.service';

@Component({
  selector: 'app-admin-stations-list',
  templateUrl: './stations-list.component.html'
})
export class StationsListComponent implements OnInit {
  stations : any = [];
  meta     : any = [];

  total    : number = 1;
  page     : number = 1;
  pageSize : number = 10;
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private stationsService      : StationsService
  ) {  }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.stationsService.getStations(this.page-1, this.pageSize)
    .subscribe(
      data => {
        this.notificationsService.success(
          'Datos cargados',
          'Los datos de estaciones se leyeron exitosamente.'
        )
        this.stations = data.data;
        this.meta     = data.meta;
        this.total    = this.meta['total-items'];
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Los datos de estaciones no se pudieron leer.\n'+'Detalles: '+ error.json().message
        )
      }
    );
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
