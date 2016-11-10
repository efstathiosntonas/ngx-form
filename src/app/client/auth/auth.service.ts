import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {User} from './user';
import {Observable} from 'rxjs';
import 'rxjs/Rx' // you can cut it down to include only the nescessary parts like .map etc
import {ToastsManager} from "ng2-toastr";
import {ErrorService} from "../../errorHandler/error.service";


@Injectable()

export class AuthService {

  constructor(private http: Http, private errorService: ErrorService, private toastr: ToastsManager) {
  }

  signup(user: User) {
    const body = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/user/register', body, {headers: headers})
      .map(response => response.json())
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

  signin(user: User) {
    const body = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/user/login', body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

  logout() {
    localStorage.clear();
    this.toastr.info('You have been logged out' );
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }


}
