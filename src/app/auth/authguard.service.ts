import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {ToastsManager} from 'ng2-toastr';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastsManager) {
  }

  // we check if the user is logged in or not
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // user is actually logged in
    if (this.authService.isLoggedIn()) {
      return true;
      // user is not logged in, return the user to the login page
    } else {
      this.router.navigate(['/user/login']);
      this.toastr.error('Please login first');
    }
  }
}
