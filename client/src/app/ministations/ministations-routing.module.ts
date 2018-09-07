import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinistationsComponent } from './ministations.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { MapComponent } from './map/map.component';
import { MeasurementsComponent } from './measurements/measurements.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gestionar Nodos Controladores'
    },
    component: MinistationsComponent,
    children: [
      {
        path:'',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'create',
        component: CreateComponent,
        data: {
          title: 'Crear nodo controlador'
        }
      },
      {
        path: 'list',
        component: ListComponent,
        data: {
          title: 'Nodos controladores'
        }
      },
      {
        path: 'map',
        component: MapComponent,
        data: {
          title: 'Mapa de codos controladores'
        }
      },
      {
        path: 'measurements',
        component: MeasurementsComponent,
        data: {
          title: 'Datos de las miniestaciones'
        }
      },
      {
        path: 'edit/:id',
        component: EditComponent,
        data: {
          title: 'Editar nodo controlador'
        }
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class MinistationsRoutingModule {}
