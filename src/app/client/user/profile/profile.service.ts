import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Response, Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ErrorService} from '../../errorHandler/error.service';
import {newPassword} from './userProfile.model';

@Injectable()
export class ProfileService {

  private url: string = 'http://localhost:3000/user/profile/';
  private token: string = localStorage.getItem('id_token');
  private userProfile = [];

  constructor(private http: Http, private errorService: ErrorService) {
  }
  // get user details from database to display them in front end profile page
  getUserDetails(userId) {
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.token);
    return this.http.get(this.url + userId, {headers: headers})
      .map((response: Response) => {
        this.userProfile = response.json();
        return this.userProfile;
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }
  // submit the new password via the form in front end
  newPassword(newPass: newPassword) {
    const body = JSON.stringify(newPass);
    const headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.token);
    return this.http.post('http://localhost:3000/user/password', body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.errorService.handleError((error.json()));
        return Observable.throw(error.json());
      });
  }
}
