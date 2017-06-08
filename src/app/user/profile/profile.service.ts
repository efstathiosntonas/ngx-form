import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Headers, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ErrorService} from '../../errorHandler/error.service';
import {newPassword} from './userProfile.model';
import {AuthService} from '../../auth/auth.service';
import {AuthHttp} from 'angular2-jwt';
import {USER_API_URL} from '../../config/config';

@Injectable()
export class ProfileService {

  constructor(private http: AuthHttp, private errorService: ErrorService, private authService: AuthService) {
  }

  // get user details from database to display them in front end profile page
  getUserDetails(userId) {
    if (this.authService.isLoggedIn()) {
      let token   = localStorage.getItem('id_token');
      let userId  = localStorage.getItem('userId');
      let headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', token);
      return this.http.get(`${USER_API_URL}/` + userId, {headers: headers})
        .map((response: Response) => response.json())
        .catch((error: Response) => {
          this.errorService.handleError(error.json());
          return Observable.throw(error.json());
        });
    }
  }

  // submit the new password via the form in front end
  newPassword(newPass: newPassword) {
    if (this.authService.isLoggedIn()) {
      let token     = localStorage.getItem('id_token');
      const body    = JSON.stringify(newPass);
      const headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', token);
      return this.http.post(`${USER_API_URL}/password`, body, {headers: headers})
        .map((response: Response) => response.json())
        .catch((error: Response) => {
          this.errorService.handleError((error.json()));
          return Observable.throw(error.json());
        });
    }
  }
}
