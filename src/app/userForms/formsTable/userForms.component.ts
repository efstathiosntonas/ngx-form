import {Component, OnInit} from '@angular/core';
import {FormService} from '../../form/form.service';



@Component({
  selector: 'app-user-form',
  templateUrl: './userForms.component.html',
  styleUrls: ['./userForms.component.css']
})
export class UserFormsComponent implements OnInit {
  fetchedForms = [];


  constructor(private formService: FormService) {
  }

  ngOnInit() {
    this.formService.getUserForms()
      .subscribe(
        forms => this.fetchedForms = forms,
        error => console.log(error));
  }

  onDelete(formId) {
    this.formService.deleteForm(formId)
      .subscribe();
  }
}
