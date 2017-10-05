import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { StationComponent } from './station.component';

const routes: Routes = [
  {
    path: '',
    component: StationComponent,
    data: {
      title: 'Detalles de Estación'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StationRoutingModule {}
