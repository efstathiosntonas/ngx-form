import {Component, OnInit} from '@angular/core';
import {EditOptionsService} from './editOptions.service';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr';
import {MdDialog, MdDialogRef} from '@angular/material';
//import { UserFormsComponent }  from '../../userForms/formsTable/userForms.component';





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

  constructor(
    private editOptionsService: EditOptionsService,
    private toastr: ToastsManager,
    public dialog: MdDialog,
  ) {}


  openDialog() {
  //  this.dialog.open(EditOptionsComponentDialog);
  }

  onPassForm(obj) {
    console.log(obj)
    this.fetchedObj.design.mainPage.imgLeft = obj._id
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


      this.editOptionsService.updateOptions(model)
        .subscribe(
          res => {
            this.toastr.success('Great!', res.message);
          },
          error => {
            console.log(error);
          }
        );
      }


}



@Component({
  selector: 'edit-options-dialog',
  templateUrl: './editOptionsDialog.component.html',
})
export class EditOptionsComponentDialog {}
