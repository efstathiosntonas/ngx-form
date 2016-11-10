import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {ToastsManager} from "ng2-toastr";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private _authService: AuthService, private _route: Router, private toastr: ToastsManager) {
  }

  // we check if the user is logged in or not
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // user is actually logged in
    if (this._authService.isLoggedIn()) {
      return true;
      //user is not logged in, return the user to the login page
    } else {
      this._route.navigate(['/user/login']);
      this.toastr.error('Please login first!!');
    }
  }
}
