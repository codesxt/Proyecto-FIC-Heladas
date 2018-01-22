import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Heladas'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'users',
        loadChildren: './admin-users/admin-users.module#AdminUsersModule'
      },
      {
        path: 'admin-stations',
        loadChildren: './admin-stations/admin-stations.module#AdminStationsModule'
      },
      {
        path: 'admin-hobostations',
        loadChildren: './admin-hobostations/admin-hobostations.module#AdminHoboStationsModule'
      },
      {
        path: 'admin-predictions',
        loadChildren: './admin-predictions/admin-predictions.module#AdminPredictionsModule'
      },
      {
        path: 'user-predictions',
        loadChildren: './user-predictions/user-predictions.module#UserPredictionsModule'
      },
      {
        path: 'station/:id',
        loadChildren: './station/station.module#StationModule'
      },
      {
        path: 'mystations/:id',
        loadChildren: './mystations/mystations.module#MyStationsModule'
      },
      {
        path: 'station-history/:id',
        loadChildren: './station-history/station-history.module#StationHistoryModule'
      },
      {
        path: 'stations-list',
        loadChildren: './stations-list/stations-list.module#StationsListModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      }
    ]
  },
  {
    path: 'home',
    component: SimpleLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        loadChildren: './landing/landing.module#LandingModule'
      }
    ]
  },
  {
    path: 'public-predictions',
    component: SimpleLayoutComponent,
    data: {
      title: 'Predicciones Públicas'
    },
    children: [
      {
        path: '',
        loadChildren: './public-predictions/public-predictions.module#PublicPredictionsModule'
      }
    ]
  },
  {
    path: 'auth',
    component: SimpleLayoutComponent,
    data: {
      title: 'Authentication'
    },
    children: [
      {
        path: '',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
      }
    ]
  },
  {
    path: 'hobostations',
    component: SimpleLayoutComponent,
    data: {
      title: 'Estaciones Hobo'
    },
    children: [
      {
        path: '',
        loadChildren: './hobostations/public-hobostations.module#PublicHobostationsModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
