import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { MyStationsComponent } from './mystations.component';

const routes: Routes = [
  {
    path: '',
    component: MyStationsComponent,
    data: {
      title: 'Lista de Estaciones'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyStationsRoutingModule {}
