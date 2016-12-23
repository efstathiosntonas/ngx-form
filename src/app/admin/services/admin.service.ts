import {Injectable} from '@angular/core';
import {Headers, Response, Http} from '@angular/http';
import {Observable} from 'rxjs';
import {ErrorService} from '../../errorHandler/error.service';
import {ToastsManager} from 'ng2-toastr';
import {Form} from '../adminForms.model';
import {JwtHelper} from 'angular2-jwt';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class AdminService {
  private url: string = 'http://localhost:3000/admin';
  private token: string = localStorage.getItem('id_token');
  private forms = [];
  private singleForm = Object;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http,
              private errorService: ErrorService,
              private toastr: ToastsManager,
              private authService: AuthService) {
  }

  getUserForms() {
    if (this.authService.isLoggedIn()) {
      let token = localStorage.getItem('id_token');
      let headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', '' + token);
      return this.http.get(this.url, {headers: headers})
        .map((response: Response) => {
          console.log(response);
          const forms = response.json().forms;
          let fetchedForms = [];
          for (let form of forms) {
            fetchedForms.push(form);
          }
          console.log(fetchedForms);
          this.forms = fetchedForms;
          return fetchedForms;
        })
        .catch((error: Response) => {
          this.errorService.handleError(error.json());
          return Observable.throw(error.json());
        });
    }
  }

  deleteForm(form: Form) {
    this.forms.splice(this.forms.indexOf(form), 1);
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.token);
    return this.http.delete(this.url + '/' + form, {headers: headers})
      .map((response: Response) => {
        this.toastr.success('Form deleted successfully!');
        response.json();
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getSingleForm(formId) {
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.token);
    return this.http.get(this.url + '/edit/' + formId, {headers: headers})
      .map((response: Response) => {
        this.singleForm = response.json();
        return this.singleForm;
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  // check if user is an Administrator by decoding the token from localStorage
  isAdmin() {
    let userInfo = localStorage.getItem('id_token') ? this.jwtHelper.decodeToken(localStorage.getItem('id_token')) : null;
    if (userInfo) {
      if (userInfo.user.role[0] === 'admin') {
        return true;
      }
    }
    return false;
  }
}

