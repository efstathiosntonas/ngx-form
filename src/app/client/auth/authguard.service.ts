import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import {ToastsManager} from "ng2-toastr";

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(private _authService: AuthService, private _route: Router, private toastr: ToastsManager) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this._authService.isLoggedIn()) {
      return true;
    } else {
      this._route.navigate(['/user/login']);
      this.toastr.error('Please login first!!');
    }
  }
}
