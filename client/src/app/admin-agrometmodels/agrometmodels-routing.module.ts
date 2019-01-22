import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgrometModelsComponent } from './agrometmodels.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gestionar Estaciones'
    },
    component: AgrometModelsComponent,
    children: [ ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class AgrometModelsRoutingModule {}
