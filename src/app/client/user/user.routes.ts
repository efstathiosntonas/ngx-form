import { Routes } from '@angular/router'
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";

export const USER_ROUTES: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];
