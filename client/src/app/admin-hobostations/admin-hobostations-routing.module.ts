import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminHoboStationsComponent } from './admin-hobostations.component';
import { StationsCreateComponent } from './stations-create.component';
import { StationsListComponent } from './stations-list.component';
import { StationDetailsComponent } from './station-details.component';
import { AdminHoboStationsManualUploadComponent } from './manual-upload/manual-upload.component';
import { AdminHoboStationsDataDisplayComponent } from './data-display/datadisplay-hobostations.component';
import { AdminHoboStationsIntegrationsComponent } from './integrations/integrations.component';
import { AdminHoboStationsDataExploreComponent } from './data-explore/dataexplore-hobostations.component';

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
        path: 'station/:id',
        component: StationDetailsComponent,
        data: {
          title: 'Detalles de Estación'
        }
      },
      {
        path: 'manual-upload',
        component: AdminHoboStationsManualUploadComponent,
        data: {
          title: 'Subir datos manualmente'
        }
      },
      {
        path: 'datadisplay',
        component: AdminHoboStationsDataDisplayComponent,
        data: {
          title: 'Visualizar Datos'
        }
      },
      {
        path: 'dataexplore',
        component: AdminHoboStationsDataExploreComponent,
        data: {
          title: 'Explorar Datos'
        }
      },
      {
        path: 'integrations',
        component: AdminHoboStationsIntegrationsComponent,
        data: {
          title: 'Integraciones'
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
