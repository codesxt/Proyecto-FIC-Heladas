import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminHoboStationsComponent } from './admin-hobostations.component';
import { StationsCreateComponent } from './stations-create.component';
import { StationsListComponent } from './stations-list.component';
import { StationDetailsComponent } from './station-details.component';
import { StationsAdminMapComponent } from './stations-map.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gestionar Estaciones Hobo'
    },
    component: AdminHoboStationsComponent,
    children: [
      {
        path: 'create',
        component: StationsCreateComponent,
        data: {
          title: 'Registrar Nueva Estación'
        }
      },
      {
        path: 'list',
        component: StationsListComponent,
        data: {
          title: 'Lista de Estaciones'
        }
      },
      {
        path: 'map',
        component: StationsAdminMapComponent,
        data: {
          title: 'Mapa de Estaciones'
        }
      },
      {
        path: 'station/:id',
        component: StationDetailsComponent,
        data: {
          title: 'Detalles de Estación'
        }
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class AdminHoboStationsRoutingModule {}
