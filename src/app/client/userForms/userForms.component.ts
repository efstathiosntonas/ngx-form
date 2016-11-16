import {Component, OnInit} from '@angular/core';
import {FormService} from '../form/form.service';


@Component({
  selector: 'app-user-form',
  templateUrl: 'userForms.component.html',
  styleUrls: ['userForms.component.css']
})
export class UserFormComponent implements OnInit {
  fetchedForms = [] ;

  constructor(private formService: FormService) {
  }

  ngOnInit() {
    this.formService.getUserForms()
      .subscribe(
        (forms) => {
          this.fetchedForms = forms;
        });
  }
}
