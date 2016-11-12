import {Component, OnInit} from '@angular/core';
import {ErrorService} from "./error.service";
import {ToastsManager} from "ng2-toastr";


@Component({
  selector: 'app-error',
  templateUrl: 'error.component.html'
})
export class ErrorComponent implements OnInit {

  constructor(private errorService: ErrorService, private toastr: ToastsManager) {
  }

  error: Error;

  ngOnInit() {

    this.errorService.errorOccured
      .subscribe(
        (error: Error) => {
          this.error = error;
          this.toastr.error(this.error.message);
        })
  }
}
