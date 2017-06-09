import {Injectable} from '@angular/core';
import {Headers, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {ErrorService} from '../../errorHandler/error.service';
import {ToastsManager} from 'ng2-toastr';
import {Form} from '../adminForms.model';
import {AuthHttp, JwtHelper} from 'angular2-jwt';
import {AuthService} from '../../auth/auth.service';
import {ADMIN_API_URL} from '../../config/config';

@Injectable()
export class AdminService {
  private token: string        = localStorage.getItem('id_token');
  private forms                = [];
  private singleForm           = Object;
          jwtHelper: JwtHelper = new JwtHelper();

  constructor(private authHttp: AuthHttp,
              private errorService: ErrorService,
              private toastr: ToastsManager,
              private authService: AuthService) {
  }

  getUserForms() {
    if (this.authService.isLoggedIn()) {
      let token   = localStorage.getItem('id_token');
      let headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', token);
      return this.authHttp.get(`${ADMIN_API_URL}/forms`, {headers: headers})
        .map((response: Response) => {
          const forms      = response.json().forms;
          let fetchedForms = [];
          for (let form of forms) {
            fetchedForms.push(form);
          }
          this.forms = fetchedForms;
          return fetchedForms;
        })
        .catch((error: Response) => {
          this.errorService.handleError(error.json());
          return Observable.throw(error.json());
        });
    }
  }

  editForm(editForm, formId) {
    const body    = JSON.stringify(editForm);
    const headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', this.token);
    return this.authHttp.patch(`${ADMIN_API_URL}/form/` + formId, body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  deleteForm(form: Form) {
    this.forms.splice(this.forms.indexOf(form), 1);
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', this.token);
    return this.authHttp.delete(`${ADMIN_API_URL}/form/` + form, {headers: headers})
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
    headers.append('Authorization', this.token);
    return this.authHttp.get(`${ADMIN_API_URL}/form/` + formId, {headers: headers})
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
      if (userInfo.role[0] === 'admin') {
        return true;
      }
    }
    return false;
  }
}

