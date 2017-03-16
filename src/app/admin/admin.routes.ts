import {Routes} from '@angular/router';
import {AdminGuardService} from './services/adminGuard';
import {EditUsersFormsComponent} from './editUsersForms/editUsersForms.component';
import {EditOptionsComponent} from './editOptions/editOptions.component';


import {AdminPageComponent} from './adminPage/adminPage.component';


export const ADMIN_ROUTES: Routes = [
  {path: '', component: AdminPageComponent, canActivate: [AdminGuardService]},
  {path: 'edit/:id', component: EditUsersFormsComponent, canActivate: [AdminGuardService]},
  {path: 'options', component: EditOptionsComponent, canActivate: [AdminGuardService]},
];
