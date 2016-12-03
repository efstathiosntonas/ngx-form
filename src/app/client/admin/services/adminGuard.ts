import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ToastsManager} from 'ng2-toastr';
import {AdminService} from './admin.service';

@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(private router: Router, private toastr: ToastsManager, private adminService: AdminService) {
  }

  // we check if the user is an Administrator or not
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.adminService.isAdmin()) {
      return true;
    } else {
      this.router.navigate(['/']);
    }
  }
}
