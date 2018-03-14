import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgrometComponent } from './agromet.component';
import { AgrometStationsListComponent } from './agromet-stations/agromet-stations.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Datos de Agromet'
    },
    component: AgrometComponent,
    children: [
      {
        path: 'agromet-stations',
        component: AgrometStationsListComponent,
        data: {
          title: 'Estaciones de Agromet'
        }
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class AgrometRoutingModule {}
