import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Response, Headers, Http} from '@angular/http';
import {ErrorService} from '../errorHandler/error.service';
import {Form} from './form.model';
import {ToastsManager} from 'ng2-toastr';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FormService {

  private url: string = 'http://localhost:3000/';
  private token: string = localStorage.getItem('token');
  private userId: string = localStorage.getItem('userId');
  private forms = [];
  private singleForm = Object;

  constructor(private http: Http, private errorService: ErrorService, private toastr: ToastsManager) {}

  // get user forms from backend in order to display them in the front end
  getUserForms() {
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.token);
    return this.http.get(this.url + 'forms/' + this.userId, {headers: headers})
      .timeout(1000)
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

  deleteForm(form: Form) {
    this.forms.splice(this.forms.indexOf(form), 1);
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.token);
    return this.http.delete(this.url + 'forms/' + form, {headers: headers})
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
    return this.http.get(this.url + 'forms/edit/' + formId, {headers: headers})
      .map((response: Response) => {
        this.singleForm = response.json();
        // console.log(this.singleForm)
        return this.singleForm;
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }
}
