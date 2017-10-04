import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { StationHistoryComponent } from './station-history.component';

const routes: Routes = [
  {
    path: '',
    component: StationHistoryComponent,
    data: {
      title: 'Detalles de Estación'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StationHistoryRoutingModule {}
