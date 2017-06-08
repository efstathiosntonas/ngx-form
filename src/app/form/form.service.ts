import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Headers, Response} from '@angular/http';
import {ErrorService} from '../errorHandler/error.service';
import {Form} from './form.model';
import {ToastsManager} from 'ng2-toastr';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {FORMS_API_URL} from '../config/config';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class FormService {

  private token: string = localStorage.getItem('id_token');
  private userId: string = localStorage.getItem('userId');
  private forms = [];
  private singleForm = Object;

  constructor(private authHttp: AuthHttp, private errorService: ErrorService, private toastr: ToastsManager) {}

  // get user forms from backend in order to display them in the front end
  getUserForms() {
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', this.token);
    return this.authHttp.get(`${FORMS_API_URL}/user/` + this.userId, {headers: headers})
      .timeout(1000)
      .map((response: Response) => {
        const forms = response.json().forms;
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

  submitNewForm(newForm) {
    const body    = JSON.stringify(newForm);
    const headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', this.token);
    return this.authHttp.post(`${FORMS_API_URL}/`, body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  editForm(editForm, formId) {
    const body    = JSON.stringify(editForm);
    const headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', this.token);
    return this.authHttp.patch(`${FORMS_API_URL}/` + formId, body, {headers: headers})
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
    return this.authHttp.delete(`${FORMS_API_URL}/` + form, {headers: headers})
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
    return this.authHttp.get(`${FORMS_API_URL}/` + formId, {headers: headers})
      .map((response: Response) => {
        this.singleForm = response.json();
        return this.singleForm;
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  deleteImage(image: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', this.token);
    return this.authHttp.delete(`${FORMS_API_URL}/image/` + image, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }
}
