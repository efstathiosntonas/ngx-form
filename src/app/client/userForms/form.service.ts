import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Response, Headers, Http} from "@angular/http";
import {ErrorService} from "../errorHandler/error.service";
import {Form} from "./form.model";

@Injectable()
export class FormService {

  constructor(private http: Http, private errorService: ErrorService) {
  }

  private url: string = 'http://localhost:3000/';
  private tokenLocal: string = localStorage.getItem('token');

  submitForm(newForm: Form): Observable<any> {
    const body = JSON.stringify(newForm);
    console.log(body);
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + localStorage.getItem('token'));
    const token = localStorage.getItem('token') ? '?token=' + this.tokenLocal : '';
    return this.http.post(this.url + 'uploads' + token, body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

}
