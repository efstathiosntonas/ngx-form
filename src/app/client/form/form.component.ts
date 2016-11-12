import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";


@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.css']
})
export class FormComponent implements OnInit {

  authToken: string = localStorage.getItem('token'); //get the Auth Token from localStorage in order to Authenticate to back end while submitting the form
  url: string = 'http://localhost:3000/uploads';
  preview: string;
  private _reader: FileReader;

  @ViewChild('file')
  private inputButton: ElementRef;

  constructor(private _fb: FormBuilder) {
  }

  myForm: FormGroup;
  textInput1: FormControl;
  textInput2: FormControl;

  imgPreview(event) {

    this._reader = new FileReader();
    this._reader.readAsDataURL(event.target.files[0]);
    this._reader.addEventListener('loadend', () => this.preview = this._reader.result);
  }


  ngOnInit() {

    this.textInput1 = new FormControl('', Validators.required);
    this.textInput2 = new FormControl('', Validators.required);

    this.myForm = this._fb.group({
      textInput1: this.textInput1,
      textInput2: this.textInput2
    })
  }

  onSubmit() {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 201) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', this.url, true);
      let formData = new FormData();
      let file: FileList = this.inputButton.nativeElement.files[0];
      console.log(file);
      formData.append('fileUp', file);
      formData.append('textInput1', this.myForm.value.textInput1);
      formData.append('textInput2', this.myForm.value.textInput2);
      xhr.withCredentials = true;
      xhr.setRequestHeader("Authorization", this.authToken);
      xhr.send(formData);
      console.log(xhr);
    })
  }
}
