import {Injectable, EventEmitter} from '@angular/core';
import {Error} from './error'

@Injectable()
export class ErrorService {
  errorOccured = new EventEmitter<Error>();

  handleError(error: any) {
    const errorData = new Error(error.error.message);
    this.errorOccured.emit(errorData);
  }
}
