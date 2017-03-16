import {Component, OnInit} from '@angular/core';
import {EditOptionsService} from './editOptions.service';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './editOptions.component.html',
  styleUrls: ['./editOptions.component.css']
})
export class EditOptionsComponent implements OnInit {

  myForm: FormGroup;
  fetchedObj = {
    'design' : {
      'mainPage' : {
        'imgLeft' : ''
      }
    }
  }

  constructor(private editOptionsService: EditOptionsService) {
  }

  ngOnInit() {
    this.editOptionsService.getOptions()
      .subscribe(
        obj => this.fetchedObj = obj.obj,
        error => {
          console.log(error);
        }
      );
  }

  save(model: FormGroup, isValid: boolean) {
    console.log(model, isValid);
  }
}
