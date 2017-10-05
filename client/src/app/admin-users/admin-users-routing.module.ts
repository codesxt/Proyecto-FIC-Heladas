import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUsersComponent } from './admin-users.component';
import { AdminUserDetailsComponent } from './user-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Administración de Usuarios'
    },
    component: AdminUsersComponent
  },{
    path: ':id',
    component: AdminUserDetailsComponent,
    data: {
      title: 'Detalles de Usuario'
    }
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class AdminUsersRoutingModule {}
