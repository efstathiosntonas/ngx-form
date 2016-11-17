import {Component, OnInit, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr';
import {Router} from '@angular/router';
import {ErrorService} from '../errorHandler/error.service';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.css']
})
export class FormComponent implements OnInit {

  // setting up the form
  myForm: FormGroup;
  textInput1: FormControl;
  textInput2: FormControl;

  // get the Auth Token from localStorage in order to Authenticate to back end while submitting the form
  authToken: string = localStorage.getItem('token');
  url: string = 'http://localhost:3000/uploads';
  maxSize: number = 5000000;
  invalidFileSizeMessage: string = '{0}: Invalid file size, ';
  invalidFileSizeMessageDetail: string = 'Maximum upload size is {0}.';
  public files: File[];
  public progress: number = 0;

  name: string;
  onClear: EventEmitter<any> = new EventEmitter();
  onError: EventEmitter<any> = new EventEmitter();
  onUpload: EventEmitter<any> = new EventEmitter();
  onSelect: EventEmitter<any> = new EventEmitter();

  constructor(private _fb: FormBuilder, private toastr: ToastsManager, private router: Router, private errorService: ErrorService,
              private sanitizer: DomSanitizer) {
  }


  onFileSelect(event) {
    this.clear();
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (this.validate(file)) {
        if (this.isImage(file)) {
          file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
          this.files.push(files[i]);
        }
      } else if (!this.isImage(file)) {
        this.toastr.error('Only images are allowed');
      }

    }
    this.onSelect.emit({originalEvent: event, files: files});
  }

  isImage(file: File): boolean {
    if (!file.type.match('image/*')) {
      this.toastr.error('Only images are allowed');
      return false;
    }
    return true;
  }

  hasFiles(): boolean {
    return this.files && this.files.length > 0;
  }

  onImageLoad(img: any) {
    window.URL.revokeObjectURL(img.src);
  }

  clear() {
    this.files = [];
    this.onClear.emit();
  }

  remove(index: number) {
    this.files.splice(index, 1);
  }

  validate(file: File): boolean {
    if (this.maxSize && file.size > this.maxSize) {
      this.toastr.error(this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxSize)),
        this.invalidFileSizeMessage.replace('{0}', file.name));
      return false;
    }
    return true;
  }

  formatSize(bytes) {
    if (bytes === 0) {
      return '0 B';
    }
    let k = 1000,
      dm = 3,
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  ngOnInit() {
    this.files = [];
    this.textInput1 = new FormControl('', Validators.required);
    this.textInput2 = new FormControl('', Validators.required);

    this.myForm = this._fb.group({
      textInput1: this.textInput1,
      textInput2: this.textInput2
    });
  }

  onSubmit() {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      formData.append('fileUp', this.files[i], this.files[i].name);
    }
    xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
      if (event.lengthComputable) {
        this.progress = Math.round((event.loaded * 100) / event.total);
      }
    }, false);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        this.progress = 0;
        if (xhr.status === 201) {
          this.router.navigateByUrl('/user/forms');
          this.toastr.success('Form submitted successfully');
        } else if(xhr.status === 404 || 500) {
          this.toastr.error('There was an error!');
          this.onError.emit({xhr: xhr, file: this.files});

        }

        this.clear();
      }
    };
    xhr.open('POST', this.url, true);
    formData.append('textInput1', this.myForm.value.textInput1);
    formData.append('textInput2', this.myForm.value.textInput2);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Authorization', this.authToken);
    xhr.send(formData);
    console.log(xhr);
  }
}
