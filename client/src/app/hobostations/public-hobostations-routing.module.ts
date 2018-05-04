import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicHobostationsComponent } from './public-hobostations.component';
import { HoboStationsDataDisplayComponent } from './data-display/datadisplay-hobostations.component';
import { HoboStationsDataExploreComponent } from './data-explore/dataexplore-hobostations.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ver datos de las estaciones Hobo'
    },
    component: PublicHobostationsComponent,
    children: [
      {
        path: 'data',
        component: HoboStationsDataExploreComponent,
        data: {
          title: 'Datos de las estaciones'
        }
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class PublicHobostationsRoutingModule {}
