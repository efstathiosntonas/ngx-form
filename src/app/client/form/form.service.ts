import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Response, Headers, Http} from '@angular/http';
import {ErrorService} from '../errorHandler/error.service';
// import {Form} from './form.model';

@Injectable()
export class FormService {

  private url: string = 'http://localhost:3000/';
  private token: string = localStorage.getItem('token');
  private userId: string = localStorage.getItem('userId');
  private forms = [];

  constructor(private http: Http, private errorService: ErrorService) {
  }

  // submitForm(newForm: Form): Observable<any> {
  //   const body = JSON.stringify(newForm);
  //   console.log(body);
  //   let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.token);
  //   const token = localStorage.getItem('token') ? '?token=' + this.token : '';
  //   return this.http.post(this.url + 'uploads' + token, body, {headers: headers})
  //     .map((response: Response) => response.json())
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }

  // get user forms from backend in order to display them in the front end
  getUserForms() {
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.token);
    return this.http.get(this.url + 'forms/' + this.userId, {headers: headers})
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
