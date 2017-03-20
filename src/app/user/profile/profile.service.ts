import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Response, Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ErrorService} from '../../errorHandler/error.service';
import {newPassword} from './userProfile.model';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class ProfileService {

  private token: string = localStorage.getItem('id_token');
  private userId: string = localStorage.getItem('userId');

  private url: string = '/profile/';
  // private token = localStorage.getItem('id_token');
  // private userId = localStorage.getItem('userId');

  constructor(private http: Http, private errorService: ErrorService, private authService: AuthService) {
  }

  // get user details from database to display them in front end profile page
  getUserDetails(userId) {
    if (this.authService.isLoggedIn()) {
      let token = localStorage.getItem('id_token');
      let userId = localStorage.getItem('userId');
      let headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', '' + token);
      return this.http.get(this.url + userId, {headers: headers})
        .map((response: Response) => response.json())
        .catch((error: Response) => {
          this.errorService.handleError(error.json());
          return Observable.throw(error.json());
        });
    }
  }


  updateUser(user) {
  //  console.log(user)
    const body = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.token);
    return this.http.put( '/profile/' + user._id, body, {headers: headers})
      .map(response => response.json())
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }



  // submit the new password via the form in front end
  newPassword(newPass: newPassword) {
    if (this.authService.isLoggedIn()) {
      let token = localStorage.getItem('id_token');
      const body = JSON.stringify(newPass);
      const headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', '' + token);
      return this.http.post('/profile/password', body, {headers: headers})
        .map((response: Response) => response.json())
        .catch((error: Response) => {
          this.errorService.handleError((error.json()));
          return Observable.throw(error.json());
        });
    }
  }
}
