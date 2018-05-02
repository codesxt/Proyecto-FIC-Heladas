import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgrometComponent } from './agromet.component';
import { AgrometStationsListComponent } from './agromet-stations/agromet-stations.component';
import { AgrometRegisterComponent } from './register/register.component';
import { AgrometListComponent } from './list/list.component';
import { AgrometEditComponent } from './edit/edit.component';

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
      {
        path: 'register',
        component: AgrometRegisterComponent,
        data: {
          title: 'Registrar estación de Agromet'
        }
      },
      {
        path: 'list',
        component: AgrometListComponent,
        data: {
          title: 'Estaciones de Agromet Registradas'
        }
      },
      {
        path: 'edit/:id',
        component: AgrometEditComponent,
        data: {
          title: 'Editar Estación'
        }
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class AgrometRoutingModule {}
