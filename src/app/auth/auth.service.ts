import {Injectable} from '@angular/core';
import {Headers, Response} from '@angular/http';
import {User} from './user.model';
import {Observable} from 'rxjs';
import 'rxjs/operator/map';
import 'rxjs/operator/catch';
import {ToastsManager} from 'ng2-toastr';
import {ErrorService} from '../errorHandler/error.service';
import {Reset} from './resetPassword';
import {AuthHttp, tokenNotExpired} from 'angular2-jwt';
import {AUTH_API_URL} from '../config/config';

@Injectable()

export class AuthService {
  constructor(private authHttp: AuthHttp, private errorService: ErrorService, private toastr: ToastsManager) {
  }

  // sending request to back end to register our user
  signup(user: User) {
    const body    = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.authHttp.post(`${AUTH_API_URL}/register`, body, {headers: headers})
      .map(response => response.json())
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  // sending request to back end to login the user
  signin(user: User) {
    const body    = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.authHttp.post(`${AUTH_API_URL}/login`, body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  // sending request for password reset
  forget(reset: Reset) {
    const body    = JSON.stringify(reset);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.authHttp.post(`${AUTH_API_URL}/forgot`, body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  // sending request with the newly created password
  reset(reset: Reset) {
    const body    = JSON.stringify(reset);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.authHttp.post(`${AUTH_API_URL}/reset/` + reset.token, body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  // logout function to be used in html file of both pages (login/register) in order to clear the localStorage from token and user id.
  logout() {
    localStorage.clear();
    this.toastr.info('You have been logged out');
  }

  // check if the user is logged in or not, if token is expired, token is deleted from localstorage
  isLoggedIn() {
    if (!tokenNotExpired()) {
      localStorage.clear();
    }
    return tokenNotExpired();
  }
}
