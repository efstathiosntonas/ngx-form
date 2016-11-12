import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {ToastsManager} from "ng2-toastr";
import {Http} from "@angular/http";
import {Form} from './form.model';
import {FormService} from "./form.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.css']
})
export class FormComponent implements OnInit {

  authToken: string = localStorage.getItem('token');
  preview: string;
  private _reader: FileReader;

  constructor(private _fb: FormBuilder, private toastr: ToastsManager, private http: Http, private formService: FormService, private sanitizer: DomSanitizer) {
  }

  myForm: FormGroup;
  textInput1: FormControl;
  textInput2: FormControl;
  fileUp: FormControl;

  imgPreview(event) {
    this._reader = new FileReader();
    this._reader.readAsDataURL(event.target.files[0]);
    this._reader.addEventListener('loadend', () => this.preview = this._reader.result);
  }


  ngOnInit() {

    this.textInput1 = new FormControl('', Validators.required);
    this.textInput2 = new FormControl('', Validators.required);
    this.fileUp = new FormControl('');

    this.myForm = this._fb.group({
      textInput1: this.textInput1,
      textInput2: this.textInput2,
      fileUp: this.preview
    })
  }

  onSubmit() {
    const newForm = new Form(this.myForm.value.textInput1, this.myForm.value.textInput2, this.myForm.value.fileUp);

    this.formService.submitForm(newForm)
      .subscribe(
        data => console.log(data),
        error => console.log(error)
      )
  }
}
