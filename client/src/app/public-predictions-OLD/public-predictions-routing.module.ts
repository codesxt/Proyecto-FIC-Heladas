import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicPredictionsComponent } from './public-predictions.component';
import { PredictionsListComponent } from './list/predictions-list.component';
import { PredictionsViewComponent } from './view/predictions-view.component';
import { PredictionsMapComponent } from './map/predictions-map.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ver Predicciones por Estación'
    },
    component: PublicPredictionsComponent,
    children: [
      {
        path: 'list',
        component: PredictionsListComponent,
        data: {
          title: 'Estaciones consultables'
        }
      },
      {
        path: 'map',
        component: PredictionsMapComponent,
        data: {
          title: 'Mapa de Predicciones'
        }
      },
      {
        path: 'view/:id',
        component: PredictionsViewComponent,
        data: {
          title: 'Detalles de Predicción'
        }
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class PublicPredictionsRoutingModule {}
