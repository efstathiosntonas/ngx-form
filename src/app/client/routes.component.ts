import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {USER_ROUTES} from './user/user.routes';
import {UserComponent} from './user/user.component';
import {FormComponent} from './form/form.component';
import {AuthGuardService} from './auth/authguard.service';
import {MainPageComponent} from './mainPage/mainPage.component';
import {ADMIN_ROUTES} from './admin/admin.routes';
import {AdminComponent} from './admin/admin.component';
import {ErrorPageComponent} from './errorPage/errorPage.component';


const APP_ROUTES: Routes = [
  {path: '', component: MainPageComponent, pathMatch: 'full'},
  {path: 'user', component: UserComponent, children: USER_ROUTES},
  {path: 'form', component: FormComponent, canActivate: [AuthGuardService]},
  {path: 'admin', component: AdminComponent, children: ADMIN_ROUTES},
  {path: '404', component: ErrorPageComponent},
  {path: '**', redirectTo: '404'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
